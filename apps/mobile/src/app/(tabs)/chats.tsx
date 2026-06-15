import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  ActivityIndicator, 
  Modal,
  Vibration,
  Pressable,
  Dimensions
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, MessageCircle, Heart, Trash2, X, Check, Bell, Shield, Users, Volume2, VolumeX, MessageSquare } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

import { UserAvatar } from '../../components/common/UserAvatar';

type InboxTab = 'MESSAGES' | 'COMMUNITIES' | 'REQUESTS';

export default function ChatsScreen() {
  console.log('VIBRA FRONTEND DEBUG: Component ChatsScreen mounted');
  
  const [activeTab, setActiveTab] = useState<InboxTab>('MESSAGES');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { data: requests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ['pending-requests'],
    queryFn: async () => {
      const response = await api.get('/social/requests/pending');
      return response.data;
    },
    refetchInterval: 10000
  });

  const { data: communities = [], isLoading: isLoadingCommunities } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const response = await api.get('/social/communities');
      return response.data;
    },
    refetchInterval: 5000
  });

  const { data: chats = [], isLoading: isLoadingChats } = useQuery({
    queryKey: ['active-chats'],
    queryFn: async () => {
      const response = await api.get('/social/chats');
      return response.data;
    },
    refetchInterval: 5000,
  });

  const muteMutation = useMutation({
    mutationFn: async (channelId: string) => {
      await api.post(`/social/channels/${channelId}/toggle-mute`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    }
  });

  const deleteChatMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      await api.delete(`/social/chats/${targetUserId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-chats'] });
      setIsDeleteModalVisible(false);
      setSelectedChatId(null);
    }
  });

  const acceptMutation = useMutation({
    mutationFn: async (requestId: string) => {
      await api.post(`/social/requests/${requestId}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      queryClient.invalidateQueries({ queryKey: ['active-chats'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (requestId: string) => {
      await api.post(`/social/requests/${requestId}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
    }
  });

  const handleLongPress = (userId: string) => {
    Vibration.vibrate(50);
    setSelectedChatId(userId);
  };

  const confirmDelete = () => {
    if (selectedChatId) {
      deleteChatMutation.mutate(selectedChatId);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-white'}`} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Premium Header */}
      <View className="px-6 py-6 flex-row items-center justify-between">
        <View>
          <Text className={`text-3xl font-plus-bold tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>Inbox</Text>
          <Text className={`text-sm font-plus-medium opacity-50 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            {activeTab === 'MESSAGES' ? `${chats.length} conversas` : activeTab === 'COMMUNITIES' ? `${communities.length} comunidades` : `${requests.length} solicitações`}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className={`p-3 rounded-full ${isDark ? 'bg-stone-900' : 'bg-stone-100'}`}>
            <Search color={isDark ? 'white' : '#1C1917'} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Tabs (3 items) */}
      <View className="px-6 mb-6">
        <View className={`flex-row p-1.5 rounded-full ${isDark ? 'bg-stone-900' : 'bg-stone-100'}`}>
          <Pressable 
            onPress={() => setActiveTab('MESSAGES')}
            className={`flex-1 py-2.5 rounded-full items-center justify-center ${activeTab === 'MESSAGES' ? (isDark ? 'bg-stone-800 shadow-sm' : 'bg-white shadow-sm') : ''}`}
          >
            <Text className={`font-plus-bold text-[10px] uppercase tracking-widest ${activeTab === 'MESSAGES' ? (isDark ? 'text-white' : 'text-stone-900') : 'text-stone-500'}`}>Directs</Text>
          </Pressable>
          
          <Pressable 
            onPress={() => setActiveTab('COMMUNITIES')}
            className={`flex-1 py-2.5 rounded-full items-center justify-center flex-row gap-1.5 ${activeTab === 'COMMUNITIES' ? (isDark ? 'bg-stone-800 shadow-sm' : 'bg-white shadow-sm') : ''}`}
          >
            <Text className={`font-plus-bold text-[10px] uppercase tracking-widest ${activeTab === 'COMMUNITIES' ? (isDark ? 'text-white' : 'text-stone-900') : 'text-stone-500'}`}>Eventos</Text>
            {communities.some((c: any) => c.channels.some((ch: any) => ch.unreadCount > 0 && !ch.isMuted)) && (
              <View className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </Pressable>

          <Pressable 
            onPress={() => setActiveTab('REQUESTS')}
            className={`flex-1 py-2.5 rounded-full items-center justify-center flex-row gap-1.5 ${activeTab === 'REQUESTS' ? (isDark ? 'bg-stone-800 shadow-sm' : 'bg-white shadow-sm') : ''}`}
          >
            <Text className={`font-plus-bold text-[10px] uppercase tracking-widest ${activeTab === 'REQUESTS' ? (isDark ? 'text-white' : 'text-stone-900') : 'text-stone-500'}`}>Pedidos</Text>
            {requests.length > 0 && (
              <View className="bg-primary px-1.5 rounded-md">
                <Text className="text-[8px] font-plus-bold text-white">{requests.length}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {activeTab === 'MESSAGES' && (
          <View className="px-0">
            {chats.map((chat: any, index: number) => (
              <View key={chat.userId}>
                <TouchableOpacity 
                  onPress={() => router.push(`/chat/individual/${chat.userId}?name=${chat.userName}&photoUrl=${chat.userPhotoUrl}`)}
                  onLongPress={() => handleLongPress(chat.userId)}
                  activeOpacity={0.7}
                  className={`flex-row items-center gap-4 px-6 py-4 ${selectedChatId === chat.userId ? 'bg-red-500/5' : (chat.unread ? (isDark ? 'bg-primary/10' : 'bg-primary/5') : 'bg-transparent')}`}
                >
                  <View className="relative">
                    <UserAvatar uri={chat.userPhotoUrl} size={60} />
                    {chat.unread && (
                      <View className="absolute top-0 right-0 w-4 h-4 bg-primary border-4 border-white dark:border-stone-950 rounded-full" />
                    )}
                  </View>
                  
                  <View className="flex-1 min-w-0">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className={`${chat.unread ? 'font-plus-ebold text-stone-900 dark:text-white' : 'font-plus-bold text-stone-700 dark:text-stone-300'} text-base`} numberOfLines={1}>
                        {chat.userName}
                      </Text>
                      <Text className={`text-[10px] font-plus-bold uppercase ${chat.unread ? 'text-primary' : 'text-stone-400'}`}>
                        {chat.lastMessageAt && chat.lastMessageAt.includes('202') ? new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text 
                        className={`text-sm flex-1 mr-2 ${chat.unread ? (isDark ? 'text-stone-100 font-plus-bold' : 'text-stone-900 font-plus-bold') : 'text-stone-400 font-plus-medium'}`} 
                        numberOfLines={1}
                      >
                        {chat.lastMessage}
                      </Text>
                      {chat.unread && (
                        <View className="bg-primary px-2 py-0.5 rounded-full">
                          <Text className="text-[10px] font-plus-ebold text-white">1</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                {index < chats.length - 1 && (
                  <View className="flex-row">
                    <View className="w-[92px]" /> 
                    <View className={`flex-1 h-[0.5px] ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`} />
                  </View>
                )}
              </View>
            ))}
            {chats.length === 0 && !isLoadingChats && <EmptyInbox isDark={isDark} icon={<MessageCircle size={32} color="#78716C" />} title="Sem conversas" subtitle="Suas mensagens diretas aparecerão aqui" />}
          </View>
        )}

        {activeTab === 'COMMUNITIES' && (
          <View className="px-6 gap-6">
            {communities.map((event: any) => (
              <View key={event.id} className={`rounded-[2.5rem] overflow-hidden border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100 shadow-sm'}`}>
                <View className="h-32 w-full relative">
                  <Image source={{ uri: event.thumbnailUrl }} className="w-full h-full" resizeMode="cover" />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} className="absolute inset-0 justify-end p-5">
                    <Text className="text-white font-plus-ebold text-lg" numberOfLines={1}>{event.title}</Text>
                  </LinearGradient>
                </View>
                
                <View className="p-2">
                  {event.channels.map((channel: any) => (
                    <TouchableOpacity 
                      key={channel.id}
                      onPress={() => router.push(`/chat/community?eventId=${event.id}&channelId=${channel.id}&title=${event.title}`)}
                      className="flex-row items-center justify-between p-4 rounded-3xl active:bg-stone-100 dark:active:bg-stone-800"
                    >
                      <View className="flex-row items-center gap-4 flex-1">
                        <View className={`w-12 h-12 rounded-2xl items-center justify-center ${isDark ? 'bg-stone-800' : 'bg-stone-50'}`}>
                          <MessageSquare color={channel.unreadCount > 0 && !channel.isMuted ? '#FB8B3F' : '#78716C'} size={20} />
                        </View>
                        <View>
                          <Text className={`font-plus-bold text-base ${isDark ? 'text-white' : 'text-stone-900'} ${channel.isMuted ? 'opacity-40' : ''}`}>#{channel.name}</Text>
                          <View className="flex-row items-center gap-1.5">
                            <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <Text className="text-[10px] font-plus-bold text-stone-500 uppercase tracking-tight">{channel.activeCount || 0} online agora</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center gap-3">
                        {channel.unreadCount > 0 && !channel.isMuted && (
                          <View className="bg-primary px-2.5 py-1 rounded-full">
                            <Text className="text-[10px] font-plus-ebold text-white">{channel.unreadCount}</Text>
                          </View>
                        )}
                        <TouchableOpacity 
                          onPress={() => muteMutation.mutate(channel.id)}
                          className={`p-2 rounded-full ${channel.isMuted ? 'bg-stone-200 dark:bg-stone-800' : ''}`}
                        >
                          {channel.isMuted ? <VolumeX size={18} color="#78716C" /> : <Volume2 size={18} color="#78716C" />}
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
            {communities.length === 0 && !isLoadingCommunities && <EmptyInbox isDark={isDark} icon={<Users size={32} color="#78716C" />} title="Sem comunidades" subtitle="Favorote um evento para entrar no chat" />}
          </View>
        )}

        {activeTab === 'REQUESTS' && (
          <View className="px-6 gap-4">
            {requests.map((req: any) => (
              <View 
                key={req.id}
                className={`flex-row items-center gap-4 p-5 rounded-[2.5rem] border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100 shadow-sm'}`}
              >
                <TouchableOpacity onPress={() => router.push(`/user/${req.senderId}`)}>
                  <UserAvatar uri={req.senderPhotoUrl} size={56} />
                </TouchableOpacity>
                <View className="flex-1">
                  <Text className={`font-plus-bold text-base ${isDark ? 'text-white' : 'text-stone-900'}`}>{req.senderName}</Text>
                  <Text className="text-[10px] font-plus-bold text-primary uppercase mt-0.5">Quer te conhecer</Text>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => rejectMutation.mutate(req.id)} className={`w-11 h-11 rounded-full items-center justify-center ${isDark ? 'bg-stone-800' : 'bg-stone-50'}`}><X size={20} color={isDark ? '#A8A29E' : '#78716C'} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => acceptMutation.mutate(req.id)} className="w-11 h-11 rounded-full items-center justify-center bg-primary shadow-lg shadow-primary/30"><Check size={20} color="white" /></TouchableOpacity>
                </View>
              </View>
            ))}
            {requests.length === 0 && !isLoadingRequests && <EmptyInbox isDark={isDark} icon={<Bell size={32} color="#78716C" />} title="Sem pedidos" subtitle="Novas solicitações aparecerão aqui" />}
          </View>
        )}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteModalVisible} transparent animationType="fade" onRequestClose={() => setIsDeleteModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/60 px-8">
          <View className={`w-full p-8 rounded-[3rem] items-center ${isDark ? 'bg-stone-900' : 'bg-white'}`}>
            <View className="w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-6">
              <Trash2 color="#EF4444" size={32} />
            </View>
            <Text className={`text-xl font-plus-bold text-center mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>Apagar conversa?</Text>
            <Text className={`text-sm font-plus-medium text-center opacity-50 mb-8 px-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Esta ação removerá a conexão e todas as mensagens. Não pode ser desfeita.</Text>
            <View className="flex-row gap-3 w-full">
              <TouchableOpacity onPress={() => { setIsDeleteModalVisible(false); setSelectedChatId(null); }} className={`flex-1 py-4 rounded-full items-center justify-center ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}><Text className={`font-plus-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} disabled={deleteChatMutation.isPending} className="flex-1 py-4 rounded-full bg-red-500 items-center justify-center shadow-lg shadow-red-500/30">{deleteChatMutation.isPending ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-plus-bold">Apagar</Text>}</TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function EmptyInbox({ isDark, icon, title, subtitle }: any) {
  return (
    <View className="items-center py-20">
      <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-stone-900' : 'bg-stone-50'}`}>
        {icon}
      </View>
      <Text className={`font-plus-bold text-center ${isDark ? 'text-white' : 'text-stone-900'}`}>{title}</Text>
      <Text className={`font-plus-medium text-center opacity-40 mt-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>{subtitle}</Text>
    </View>
  );
}

function StatusBar({ style }: { style: 'light' | 'dark' }) {
  // Simple implementation to maintain structure
  return null;
}
