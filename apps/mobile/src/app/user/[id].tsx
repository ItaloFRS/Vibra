import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MessageSquare, UserPlus, Check, MapPin, Calendar } from 'lucide-react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const blurhash = '|rF?hV%2WCj[ayWDWvUCfP8{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay';

interface PublicUser {
  id: string;
  fullName: string;
  profilePhotoUrl: string;
  bio: string;
  preferences?: {
    interests?: string[];
  };
}

interface UserEvent {
  id: string;
  title: string;
  thumbnailUrl: string;
  eventDate: string;
  location: string;
}

import { UserAvatar } from '../../components/common/UserAvatar';

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const queryClient = useQueryClient();

  const { data: publicUser, isLoading: isLoadingUser } = useQuery<PublicUser>({
    queryKey: ['public-user', id],
    queryFn: async () => {
      const response = await api.get(`/users/${id}`);
      return response.data;
    },
    enabled: !!id
  });

  const { data: relationship, isLoading: isLoadingRel } = useQuery<{ status: string }>({
    queryKey: ['relationship', id],
    queryFn: async () => {
      const response = await api.get(`/social/users/${id}/relationship`);
      return response.data;
    },
    enabled: !!id && id !== currentUser?.id
  });

  const { data: interests = [], isLoading: isLoadingInterests } = useQuery<UserEvent[]>({
    queryKey: ['user-interests', id],
    queryFn: async () => {
      const response = await api.get(`/social/users/${id}/interests`);
      return response.data;
    },
    enabled: !!id
  });

  const requestMutation = useMutation({
    mutationFn: async () => {
      await api.post('/social/requests', { targetUserId: id });
    },
    onSuccess: () => {
      Alert.alert('Solicitação Enviada', 'Aguarde a pessoa aceitar sua mensagem.');
      queryClient.invalidateQueries({ queryKey: ['relationship', id] });
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível enviar a solicitação.');
    }
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      const pending = await api.get('/social/requests/pending');
      const req = pending.data.find((r: any) => r.senderId === id);
      if (req) {
        await api.post(`/social/requests/${req.id}/accept`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationship', id] });
      queryClient.invalidateQueries({ queryKey: ['active-chats'] });
    }
  });

  if (isLoadingUser || isLoadingRel || isLoadingInterests) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-stone-950' : 'bg-surface'}`}>
        <ActivityIndicator color="#FB8B3F" size="large" />
      </View>
    );
  }

  if (!publicUser) {
    return (
      <View className={`flex-1 items-center justify-center p-6 ${isDark ? 'bg-stone-950' : 'bg-surface'}`}>
        <Text className={`font-plus-bold text-center text-lg ${isDark ? 'text-stone-300' : 'text-on-surface-variant'}`}>Usuário não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} className={`mt-6 px-8 py-3 rounded-full ${isDark ? 'bg-primary-container' : 'bg-primary'}`}>
          <Text className={`font-plus-bold ${isDark ? 'text-stone-950' : 'text-white'}`}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const status = relationship?.status || 'NONE';
  const vibes = publicUser.preferences?.interests || [];

  const formatShortDate = (dateString: string) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-surface'}`} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className={`px-6 py-4 flex-row items-center border-b ${isDark ? 'border-stone-800' : 'border-outline-variant/10'}`}>
        <TouchableOpacity onPress={() => router.back()} className={`p-2 -ml-2 rounded-full ${isDark ? 'bg-stone-900' : ''}`}>
          <ArrowLeft color={isDark ? '#FB8B3F' : '#954400'} size={24} />
        </TouchableOpacity>
        <Text className={`text-xl font-plus-bold ml-2 ${isDark ? 'text-primary-container' : 'text-primary'}`}>Perfil Público</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View className="items-center pt-10 px-6">
          <UserAvatar 
            uri={publicUser.profilePhotoUrl} 
            size={160} 
            borderWidth={4} 
            borderColor={isDark ? '#0C0A09' : '#FFF4EF'} 
            style={{ marginBottom: 24 }}
          />

          <Text className={`text-4xl font-plus-ebold mb-1 text-center ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>
            {publicUser.fullName}
          </Text>
          
          <View className="flex-row items-center mb-6">
            <MapPin size={18} color={isDark ? '#A8A29E' : '#7D522B'} />
            <Text className={`font-plus-medium ml-1 ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Campina Grande, PB</Text>
          </View>

          <Text className={`text-lg max-w-sm text-center italic font-plus mb-10 leading-relaxed ${isDark ? 'text-stone-300/80' : 'text-on-surface/80'}`}>
            {publicUser.bio || "“Explorando as melhores vibes do Vibra! 🚀”"}
          </Text>

          {/* Interaction Buttons */}
          <View className="w-full flex-row gap-4 mb-12">
            {id === currentUser?.id ? (
              <TouchableOpacity 
                className={`flex-1 flex-row items-center justify-center py-5 rounded-full shadow-sm ${isDark ? 'bg-stone-800' : 'bg-surface-container-highest'}`}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <Text className={`font-plus-ebold uppercase tracking-widest text-xs ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Meu Perfil</Text>
              </TouchableOpacity>
            ) : status === 'CONNECTED' ? (
              <TouchableOpacity 
                className="flex-1 bg-primary-container flex-row items-center justify-center py-5 rounded-full shadow-lg active:scale-[0.98]"
                onPress={() => router.push(`/chat/individual/${publicUser.id}`)}
              >
                <MessageSquare size={20} color="#1A0700" />
                <Text className="text-on-primary-fixed font-plus-ebold ml-3 uppercase tracking-widest text-xs">Chat</Text>
              </TouchableOpacity>
            ) : status === 'PENDING_SENT' ? (
              <View className={`flex-1 flex-row items-center justify-center py-5 rounded-full border ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-surface-container-highest border-outline-variant/20'}`}>
                <Check size={20} color={isDark ? '#FB8B3F' : '#482603'} />
                <Text className={`font-plus-ebold ml-3 uppercase tracking-widest text-xs ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Solicitado</Text>
              </View>
            ) : status === 'PENDING_RECEIVED' ? (
              <TouchableOpacity 
                className={`flex-1 flex-row items-center justify-center py-5 rounded-full shadow-lg active:scale-[0.98] ${isDark ? 'bg-primary-container' : 'bg-primary'}`}
                onPress={() => acceptMutation.mutate()}
              >
                {acceptMutation.isPending ? <ActivityIndicator color={isDark ? "#1A0700" : "white"} /> : (
                  <>
                    <Check size={20} color={isDark ? "#1A0700" : "white"} />
                    <Text className={`font-plus-ebold ml-3 uppercase tracking-widest text-xs ${isDark ? 'text-stone-950' : 'text-white'}`}>Aceitar Chat</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                className={`flex-1 flex-row items-center justify-center py-5 rounded-full shadow-lg active:scale-[0.98] ${isDark ? 'bg-primary-container' : 'bg-primary'}`}
                onPress={() => requestMutation.mutate()}
              >
                {requestMutation.isPending ? (
                  <ActivityIndicator color={isDark ? "#1A0700" : "white"} />
                ) : (
                  <>
                    <MessageSquare size={20} color={isDark ? "#1A0700" : "white"} />
                    <Text className={`font-plus-ebold ml-3 uppercase tracking-widest text-xs ${isDark ? 'text-stone-950' : 'text-white'}`}>Solicitar Chat</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Interests Section */}
          <View className="w-full mb-12">
            <View className="flex-row items-center mb-6">
              <Text className={`text-xl font-plus-ebold mr-2 ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Minha Vibe</Text>
              <View className="h-1 w-12 bg-primary-container rounded-full" />
            </View>

            <View className="flex-row flex-wrap gap-3">
              {vibes.length > 0 ? (
                vibes.map((interest: string) => (
                  <View key={interest} className={`px-6 py-2 rounded-full shadow-sm ${isDark ? 'bg-primary-container' : 'bg-primary'}`}>
                    <Text className={`text-sm font-plus-bold ${isDark ? 'text-stone-950' : 'text-white'}`}>{interest}</Text>
                  </View>
                ))
              ) : (
                <Text className={`italic font-plus ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Nenhuma vibe compartilhada ainda.</Text>
              )}
            </View>
          </View>

          {/* User's Interests (Events) Section */}
          <View className="w-full mb-12">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <Text className={`text-xl font-plus-ebold mr-2 ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Próximos Eventos</Text>
                <View className="h-1 w-12 bg-primary-container rounded-full" />
              </View>
              {interests.length > 0 && (
                <Text className={`font-plus-bold text-xs uppercase tracking-widest ${isDark ? 'text-primary-container' : 'text-primary'}`}>{interests.length}</Text>
              )}
            </View>

            {interests.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                className="-mx-6 px-6"
                contentContainerStyle={{ gap: 16, paddingRight: 40 }}
              >
                {interests.map((event) => (
                  <TouchableOpacity 
                    key={event.id}
                    onPress={() => router.push(`/events/${event.id}`)}
                    className={`w-64 rounded-3xl overflow-hidden border shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-low border-outline-variant/10'}`}
                  >
                    <View className="h-32 w-full relative">
                      <Image 
                        source={{ uri: event.thumbnailUrl }} 
                        className="w-full h-full"
                        contentFit="cover"
                      />
                      <View className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex-row items-center gap-1.5">
                        <Calendar size={12} color="white" />
                        <Text className="text-white text-[10px] font-plus-bold uppercase">{formatShortDate(event.eventDate)}</Text>
                      </View>
                    </View>
                    <View className="p-4">
                      <Text className={`font-plus-bold text-base mb-1 ${isDark ? 'text-stone-100' : 'text-on-surface'}`} numberOfLines={1}>{event.title}</Text>
                      <View className="flex-row items-center gap-1">
                        <MapPin size={12} color={isDark ? '#A8A29E' : '#7D522B'} />
                        <Text className={`font-plus text-[10px] ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`} numberOfLines={1}>{event.location}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View className={`rounded-[2rem] p-8 items-center border border-dashed ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-low border-outline-variant/30'}`}>
                <Calendar size={32} color={isDark ? '#44403c' : '#7D522B'} opacity={0.3} />
                <Text className={`font-plus-medium text-center mt-4 ${isDark ? 'text-stone-500' : 'text-on-surface-variant'}`}>Ainda não favoritou nenhum evento.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
