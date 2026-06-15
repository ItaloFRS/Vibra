import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import socketService, { MessagePayload } from '../services/socket';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export interface Message {
  messageId: string;
  senderId: string;
  senderName?: string;
  senderPhotoUrl?: string;
  content: string;
  createdAt: string;
  channelId?: string;
  type?: 'CHAT' | 'TYPING' | 'READ_RECEIPT';
  isSystem?: boolean;
}

interface UseChatOptions {
  matchId?: string;
  channelId?: string;
  eventId?: string;
}

export interface OnlineUser {
  id: string;
  fullName: string;
  photoUrl: string;
}

export const useChat = ({ matchId, channelId, eventId }: UseChatOptions) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, { name: string, timeout: NodeJS.Timeout }>>({});
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingSentRef = useRef<number>(0);

  const id = matchId || channelId;
  const type = matchId ? 'directs' : 'channels';
  const topic = `${type}/${id}`;
  const presenceTopic = `${topic}/presence`;

  const { data: history, isLoading, error } = useQuery<Message[]>({
    queryKey: [type, 'history', id],
    queryFn: async () => {
      const endpoint = matchId 
        ? `/social/chat/directs/${matchId}/history`
        : `/social/chat/channels/${channelId}/history`;
      const response = await api.get(endpoint);
      return response.data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (history) {
      setMessages(history);
    }
  }, [history]);

  useEffect(() => {
    if (!id) return;

    const setupSocket = async () => {
      await socketService.connect();
      
      // Send initial read receipt
      socketService.sendMessage(topic, {
        matchId,
        channelId,
        eventId,
        senderId: user?.id || '',
        content: '',
        type: 'READ_RECEIPT'
      });

      // Subscribe to presence (if channel)
      if (channelId) {
        socketService.subscribe(presenceTopic, (payload) => {
          if (payload.participants) {
            setOnlineUsers(payload.participants);
          }
        });
      }

      socketService.subscribe(topic, (payload) => {
        if (payload.type === 'TYPING') {
          if (payload.senderId !== user?.id) {
            setIsOtherTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 3000);

            const userId = payload.senderId;
            const userName = payload.senderName || 'Alguém';
            
            setTypingUsers(prev => {
              if (prev[userId]) clearTimeout(prev[userId].timeout);
              
              const timeout = setTimeout(() => {
                setTypingUsers(current => {
                  const next = { ...current };
                  delete next[userId];
                  return next;
                });
              }, 3000);

              return { ...prev, [userId]: { name: userName, timeout } };
            });
          }
          return;
        }

        if (payload.type === 'READ_RECEIPT') {
          // Handle read receipt if needed
          return;
        }

        const formattedMsg: Message = {
          messageId: payload.messageId || payload.id || Math.random().toString(),
          senderId: payload.senderId,
          senderName: payload.senderName || 'Usuário Vibra',
          senderPhotoUrl: payload.senderPhotoUrl,
          content: payload.content,
          createdAt: payload.createdAt || new Date().toISOString(),
          channelId: payload.channelId,
          isSystem: payload.isSystem
        };

        setMessages((prev) => {
          // Check if this incoming message matches a temporary/optimistic one we sent
          const isRealVersionOfOptimistic = !formattedMsg.isSystem && prev.some(m => 
            m.messageId.startsWith('temp-') && 
            m.content === formattedMsg.content && 
            m.senderId === formattedMsg.senderId
          );

          if (isRealVersionOfOptimistic) {
            // Replace the temp message with the real one from server
            return prev.map(m => 
              (m.messageId.startsWith('temp-') && m.content === formattedMsg.content && m.senderId === formattedMsg.senderId)
                ? formattedMsg 
                : m
            );
          }

          const isDuplicate = prev.some(m => m.messageId === formattedMsg.messageId);
          if (isDuplicate) return prev;
          
          return [...prev, formattedMsg];
        });
        
        setIsOtherTyping(false);
        if (payload.senderId !== user?.id) {
          setTypingUsers(current => {
            const next = { ...current };
            if (next[payload.senderId]) {
              clearTimeout(next[payload.senderId].timeout);
              delete next[payload.senderId];
            }
            return next;
          });

          // Auto-send read receipt for incoming messages
          socketService.sendMessage(topic, {
            matchId,
            channelId,
            eventId,
            senderId: user?.id || '',
            content: '',
            type: 'READ_RECEIPT'
          });
        }
      });
    };

    setupSocket();

    return () => {
      socketService.unsubscribe(topic);
      if (channelId) socketService.unsubscribe(presenceTopic);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      Object.values(typingUsers).forEach(u => clearTimeout(u.timeout));
    };
  }, [id, user?.id, matchId, channelId, eventId, topic, presenceTopic]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !user?.id || !id) return;

    const messageContent = content.trim();
    
    const payload: MessagePayload = {
      matchId,
      channelId,
      eventId,
      senderId: user.id,
      content: messageContent,
      type: 'CHAT'
    };

    socketService.sendMessage(topic, payload);

    // Optimistic update
    const optimisticMsg: Message = {
      messageId: `temp-${Date.now()}`,
      senderId: user.id,
      senderName: user.fullName || 'Você',
      senderPhotoUrl: user.profilePhotoUrl || '',
      content: messageContent,
      createdAt: new Date().toISOString(),
      channelId,
      isSystem: false
    };

    setMessages(prev => [...prev, optimisticMsg]);
  }, [id, user, matchId, channelId, eventId, topic]);

  const sendTyping = useCallback(() => {
    if (!id || !user?.id) return;

    const now = Date.now();
    if (now - lastTypingSentRef.current > 2000) {
      lastTypingSentRef.current = now;
      socketService.sendMessage(topic, {
        matchId,
        channelId,
        eventId,
        senderId: user.id,
        content: '',
        type: 'TYPING'
      });
    }
  }, [id, user?.id, matchId, channelId, eventId, topic]);

  const sendSystemMessage = useCallback((content: string) => {
    if (!content.trim() || !user?.id || !id) return;

    socketService.sendMessage(topic, {
      matchId,
      channelId,
      eventId,
      senderId: user.id,
      content,
      type: 'CHAT',
      isSystem: true
    });
  }, [id, user?.id, matchId, channelId, eventId, topic]);

  return {
    messages,
    sendMessage,
    sendTyping,
    sendSystemMessage,
    isOtherTyping,
    typingUsers,
    onlineUsers,
    isLoading,
    error
  };
};
