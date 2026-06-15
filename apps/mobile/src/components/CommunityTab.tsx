import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, Diamond, Car, MessagesSquare, ChevronRight, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface ChannelResponse {
  id: string;
  name: string;
  description: string;
}

interface CommunityTabProps {
  eventId: string;
  eventName: string;
}

const getIcon = (name: string, isDark: boolean) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('vip')) return <Diamond color={isDark ? "#DAC9FF" : "#503987"} size={22} />;
  if (lowerName.includes('transporte') || lowerName.includes('carona')) return <Car color={isDark ? "#FB8B3F" : "#C86419"} size={22} />;
  return <MessagesSquare color={isDark ? "#FB8B3F" : "#C86419"} size={22} />;
};

const getBgColor = (name: string, isDark: boolean) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('vip')) return isDark ? 'bg-secondary/20' : 'bg-secondary-container/50';
  return isDark ? 'bg-stone-800' : 'bg-surface-container-low';
};

export default function CommunityTab({ eventId, eventName }: CommunityTabProps) {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { data: channels, isLoading } = useQuery<ChannelResponse[]>({
    queryKey: ['channels', eventId],
    queryFn: async () => {
      const response = await api.get(`/social/events/${eventId}/channels`);
      return response.data;
    }
  });

  if (isLoading) {
    return <View className={`flex-1 items-center justify-center py-20 ${isDark ? 'bg-stone-950' : 'bg-background'}`}><ActivityIndicator color="#FB8B3F" /></View>;
  }

  return (
    <View className={`flex-1 px-6 pt-10 pb-32 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
      {/* Editorial Header - Intentional Asymmetry */}
      <View className="mb-16 ml-2">
        <View className={`px-4 py-1.5 rounded-full self-start mb-6 ${isDark ? 'bg-primary-container/20' : 'bg-primary-container/10'}`}>
          <Text className={`text-[10px] font-plus-bold uppercase tracking-widest ${isDark ? 'text-primary-container' : 'text-primary'}`}>The Living Pulse</Text>
        </View>
        <Text className={`text-5xl font-plus-ebold leading-[0.85] tracking-tighter mb-4 ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>
          {eventName.split(' ')[0]}
          {'\n'}
          <Text className={isDark ? 'text-primary-container' : 'text-primary'}>Community</Text>
        </Text>
        <Text className={`font-plus text-base mt-4 leading-relaxed max-w-[90%] ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
          Conecte-se com o pulso vibrante do festival antes mesmo do primeiro beat cair.
        </Text>
      </View>

      {/* Channel Grid - Bento Style inspired by Stitch */}
      <View className="mb-12">
        <View className="flex-row items-center gap-3 mb-8 ml-1">
          <View className={`p-3 rounded-2xl ${isDark ? 'bg-stone-800' : 'bg-surface-container-low'}`}>
            <LayoutGrid color={isDark ? "#FB8B3F" : "#C86419"} size={20} />
          </View>
          <Text className={`text-2xl font-plus-ebold tracking-tight ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>Canais Exclusivos</Text>
        </View>

        <View className="flex-row flex-wrap gap-4">
          {channels?.map((channel, idx) => (
            <TouchableOpacity 
              key={channel.id}
              activeOpacity={0.9}
              className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-low border-outline-variant/10'} ${idx % 3 === 0 ? 'w-full' : 'w-[47%]'}`}
              onPress={() => router.push({ pathname: '/chat/[id]', params: { id: channel.id, eventId, eventName, channelName: channel.name } })}
            >
              <View className="flex-row justify-between items-start mb-6">
                <View className={`w-12 h-12 rounded-2xl ${getBgColor(channel.name, isDark)} flex items-center justify-center shadow-inner`}>
                  {getIcon(channel.name, isDark)}
                </View>
                <View className={`px-2.5 py-1 rounded-full ${isDark ? 'bg-primary-container/20' : 'bg-primary-container/10'}`}>
                  <Text className={`text-[9px] font-plus-ebold uppercase tracking-tighter ${isDark ? 'text-primary-container' : 'text-primary'}`}>Ativo</Text>
                </View>
              </View>
              
              <Text className={`text-xl font-plus-bold leading-tight mb-2 ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>{channel.name}</Text>
              <Text className={`text-xs font-plus leading-relaxed opacity-60 ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`} numberOfLines={2}>
                {channel.description || "Discussões em tempo real sobre o evento."}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {(!channels || channels.length === 0) && (
           <View className={`p-10 rounded-[3rem] items-center justify-center border-2 border-dashed ${isDark ? 'bg-stone-900/50 border-stone-800' : 'bg-surface-container-low/30 border-outline-variant/20'}`}>
             <Sparkles color={isDark ? '#44403c' : '#d9a274'} size={40} opacity={0.5} />
             <Text className={`font-plus-bold text-center mt-4 ${isDark ? 'text-stone-500' : 'text-on-surface-variant/60'}`}>Novos canais em breve</Text>
           </View>
        )}
      </View>

      {/* Featured Card - Overlapping style */}
      <TouchableOpacity activeOpacity={0.95} className="relative overflow-hidden rounded-3xl h-64 shadow-2xl bg-stone-900  active:scale-[0.99] transition-all">
        <Image 
          className="absolute inset-0 w-full h-full" 
          resizeMode="cover"
          source={{ uri: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=800" }} 
        />
        <LinearGradient 
          colors={['transparent', isDark ? 'rgba(12,10,9,0.95)' : 'rgba(72,38,3,0.95)']} 
          locations={[0.4, 1]}
          className="absolute inset-0" 
        />
        <View className="absolute inset-0 flex justify-end p-10">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-2 h-2 rounded-full bg-primary-container" />
            <Text className="text-white/60 text-[10px] font-plus-bold uppercase tracking-widest">Guia Oficial</Text>
          </View>
          <Text className="text-white font-plus-ebold text-3xl tracking-tight leading-none">Manual de Sobrevivência 2024</Text>
        </View>
        <View className="absolute top-8 right-8 w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 items-center justify-center">
            <ChevronRight color="white" size={24} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
