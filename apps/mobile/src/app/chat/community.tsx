import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Keyboard,
  Modal
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Send, Users, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserAvatar } from '../../components/common/UserAvatar';

export default function CommunityChatScreen() {
  const { eventId, channelId, title } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const formatTime = (date: string) => {
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDateLabel = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return 'Hoje';
    if (isYesterday) return 'Ontem';
    
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['channel-messages', channelId],
    queryFn: async () => {
      const response = await api.get(`/social/chat/channels/${channelId}/history`);
      return response.data;
    },
    refetchInterval: 3000
  });

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/social/chat/channels/${channelId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    }
  });

  // Marca como lido ao entrar e sempre que chegarem novas mensagens
  useEffect(() => {
    if (messages.length > 0) {
      markAsReadMutation.mutate();
    }
  }, [messages.length]);

  const { data: members = [] } = useQuery({
    queryKey: ['event-members', eventId],
    queryFn: async () => {
      const response = await api.get(`/social/events/${eventId}/members`);
      return response.data;
    },
    enabled: showMembers
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      await api.post('/social/chat/send', {
        channelId,
        eventId,
        content,
        senderId: currentUser?.id
      });
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['channel-messages', channelId] });
      queryClient.invalidateQueries({ queryKey: ['active-chats'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
      Keyboard.dismiss();
    }
  };

  const renderDateHeader = (date: string) => {
    return (
      <View className="items-center my-6">
        <View className={`px-4 py-1.5 rounded-full ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}>
          <Text className={`text-[10px] font-plus-bold uppercase tracking-widest ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            {formatDateLabel(date)}
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 500);
    return () => clearTimeout(timer);
  }, [messages.length]);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-stone-50'}`} edges={['top']}>
      {/* Premium Header */}
      <View className={`px-4 py-4 flex-row items-center border-b ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'}`}>
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft color={isDark ? 'white' : '#1C1917'} size={28} />
        </TouchableOpacity>
        
        <View className="flex-1 ml-2">
          <Text className={`font-plus-ebold text-base ${isDark ? 'text-white' : 'text-stone-900'}`} numberOfLines={1}>
            {title || 'Comunidade'}
          </Text>
          <TouchableOpacity 
            onPress={() => setShowMembers(true)}
            className="flex-row items-center gap-1.5"
          >
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text className="text-[10px] font-plus-bold text-emerald-500 uppercase tracking-tight">Canal Geral</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => setShowMembers(true)}
          className={`p-3 rounded-2xl ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}
        >
          <Users color={isDark ? '#FB8B3F' : '#954400'} size={20} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <ActivityIndicator color="#FB8B3F" style={{ marginTop: 20 }} />
          ) : (
            messages.map((msg: any, index: number) => {
              const isMine = msg.senderId === currentUser?.id;
              const showAvatar = index === 0 || messages[index-1].senderId !== msg.senderId;
              const showDate = index === 0 || new Date(messages[index-1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

              return (
                <View key={msg.messageId || index}>
                  {showDate && renderDateHeader(msg.createdAt)}
                  <View className={`mb-4 ${isMine ? 'items-end' : 'items-start'}`}>
                    <View className={`flex-row items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isMine && (
                        <View className="w-8 h-8">
                          {showAvatar && <UserAvatar uri={msg.senderPhotoUrl} size={32} />}
                        </View>
                      )}
                      
                      <View className="max-w-[80%]">
                        {showAvatar && !isMine && (
                          <Text className="text-[10px] font-plus-bold text-stone-500 ml-2 mb-1">
                            {msg.senderName}
                          </Text>
                        )}
                        <View className={`px-4 py-3 rounded-[1.5rem] ${
                          isMine 
                            ? (isDark ? 'bg-primary' : 'bg-primary shadow-sm shadow-primary/20') 
                            : (isDark ? 'bg-stone-900' : 'bg-white shadow-sm border border-stone-100')
                        } ${isMine ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                          <Text className={`font-plus-medium text-[15px] leading-5 ${isMine ? 'text-white' : (isDark ? 'text-stone-200' : 'text-stone-800')}`}>
                            {msg.content}
                          </Text>
                          <Text className={`text-[9px] font-plus-bold mt-1 self-end ${isMine ? 'text-white/60' : 'text-stone-400'}`}>
                            {formatTime(msg.createdAt)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Input Area */}
        <View className={`px-4 py-4 border-t ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'}`}>
          <View className={`flex-row items-center p-2 rounded-[2rem] ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Sua mensagem..."
              placeholderTextColor={isDark ? '#78716C' : '#A8A29E'}
              multiline
              className={`flex-1 px-4 py-2 font-plus-medium text-sm ${isDark ? 'text-white' : 'text-stone-900'}`}
            />
            <TouchableOpacity 
              onPress={handleSend}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className={`w-10 h-10 rounded-full items-center justify-center ${message.trim() ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-stone-200 opacity-50'}`}
            >
              <Send color="white" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Members Modal */}
      <Modal visible={showMembers} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className={`h-[70%] rounded-t-[3rem] p-6 ${isDark ? 'bg-stone-900' : 'bg-white'}`}>
            <View className="flex-row items-center justify-between mb-8">
              <Text className={`text-2xl font-plus-ebold ${isDark ? 'text-white' : 'text-stone-900'}`}>Na Comunidade</Text>
              <TouchableOpacity onPress={() => setShowMembers(false)} className={`p-2 rounded-full ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}>
                <X color={isDark ? 'white' : 'black'} size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {members.length > 0 ? (
                members.map((member: any) => (
                  <TouchableOpacity 
                    key={member.id}
                    onPress={() => { setShowMembers(false); router.push(`/user/${member.id}`); }}
                    className="flex-row items-center gap-4 mb-6"
                  >
                    <UserAvatar uri={member.profilePhotoUrl} size={48} />
                    <View className="flex-1">
                      <Text className={`font-plus-bold text-base ${isDark ? 'text-white' : 'text-stone-900'}`}>{member.fullName}</Text>
                      <Text className="text-stone-500 text-xs font-plus-medium" numberOfLines={1}>{member.bio || 'Interessado no evento'}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="items-center py-10">
                  <Users size={48} color="#78716C" opacity={0.3} />
                  <Text className="font-plus-bold text-stone-500 mt-4">Nenhum membro encontrado</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
