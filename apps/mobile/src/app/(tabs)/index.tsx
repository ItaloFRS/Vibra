import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin, 
  Bell, 
  Calendar,
  Heart
} from 'lucide-react-native';
import api from '../../services/api';
import EventCard from '../../components/EventCard';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useTheme } from '../../context/ThemeContext';
import { GlassView } from '../../components/GlassView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { locationName, loading: loadingLocation } = useUserLocation();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { 
    data: events, 
    isLoading: isLoadingEvents, 
    refetch: refetchEvents, 
    isRefetching: isRefetchingEvents 
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get('/events');
      return response.data || [];
    }
  });

  const { 
    data: interests, 
    isLoading: isLoadingInterests 
  } = useQuery({
    queryKey: ['interests'],
    queryFn: async () => {
      const response = await api.get('/social/interests');
      return response.data || [];
    }
  });

  const queryClient = useQueryClient();
  const favoriteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await api.post(`/social/events/${eventId}/favorite`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    }
  });

  const onRefresh = () => {
    refetchEvents();
  };

  const handleEventPress = (eventId: string) => {
    router.push({ pathname: '/events/[id]', params: { id: eventId } });
  };

  const handleFavorite = (eventId: string) => {
    favoriteMutation.mutate(eventId);
  };

  const formatEventDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
  };

  if (isLoadingEvents) {
    return (
      <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'} items-center justify-center`}>
        <ActivityIndicator size="large" color="#FB8B3F" />
      </View>
    );
  }

  const featuredEvents = Array.isArray(events) ? events.slice(6, 10) : [];

  return (
    <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
      {/* TopAppBar (GlassView) */}
      <GlassView 
        intensity={30}
        tint={isDark ? 'dark' : 'light'}
        borderBottomLeftRadius={32}
        borderBottomRightRadius={32}
        style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 100, 
            height: 120 
        }}
      >
        <View style={{ 
            flex: 1,
            paddingTop: 56, 
            paddingBottom: 20, 
            paddingHorizontal: 24, 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(68, 64, 60, 0.1)' : 'rgba(231, 229, 228, 0.3)'
        }}>
            <Image source={isDark ? require('../../../assets/Logo_Vibra.png') : require('../../../assets/Logo_VibraPl.png')} className="w-20 h-16" resizeMode="contain" />
            <View className={`flex-row items-center ${isDark ? 'bg-stone-900/60' : 'bg-white/60'} border border-outline-variant/10 px-4 py-2 rounded-full`}>
                <MapPin size={14} color="#FB8B3F" />
                <Text className={`text-[11px] font-plus-bold ${isDark ? 'text-stone-300' : 'text-on-surface'} ml-1 tracking-tight`}>
                    {loadingLocation ? 'Buscando localização...' : locationName}
                </Text>
            </View>
            <TouchableOpacity className="p-2 relative">
                <Bell size={24} color={isDark ? "#A8A29E" : "#625a53"} /><View className="absolute top-2 right-2 w-2 h-2 bg-[#FB8B3F] rounded-full border-2 border-background dark:border-stone-950" />
            </TouchableOpacity>
        </View>
      </GlassView>

      <ScrollView 
        className={isDark ? 'bg-stone-950' : 'bg-background'}
        showsVerticalScrollIndicator={false} 
        refreshControl={<RefreshControl refreshing={isRefetchingEvents} onRefresh={onRefresh} progressViewOffset={120} />} 
        contentContainerStyle={{ paddingTop: 130, paddingBottom: 120 }}
      >
        <View className="py-6 space-y-8">
          
          <View>
            <View className="px-6 mb-6">
              <Text className={`text-3xl font-plus-ebold ${isDark ? 'text-stone-50' : 'text-on-surface'} tracking-tighter mb-1`}>Destaque do Dia</Text>
              <Text className={`text-sm font-plus-medium ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Confira o que está rolando de melhor na Vibra.</Text>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              pagingEnabled
              snapToInterval={SCREEN_WIDTH - 48 + 16}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {featuredEvents.map((event: any) => (
                <TouchableOpacity 
                  key={event.id}
                  activeOpacity={0.9} 
                  onPress={() => handleEventPress(event.id)}
                  style={{ width: SCREEN_WIDTH - 48, borderRadius: 24, overflow: 'hidden', marginRight: 16 }}
                  className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl mr-4"
                >
                  <Image source={{ uri: event.thumbnailUrl }} className="w-full h-full" resizeMode="cover" />
                  <LinearGradient colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.2)', 'transparent']} start={{ x: 0.5, y: 1 }} end={{ x: 0.5, y: 0 }} style={StyleSheet.absoluteFill} />
                  
                  <View className="absolute top-6 left-6 flex-row items-center bg-white/20 px-3 py-1.5 rounded-full border border-white/30 backdrop-blur-md">
                    <View className="flex-row -space-x-2 mr-2">
                      {[1, 2, 3].map(i => <Image key={i} source={{ uri: `https://i.pravatar.cc/100?u=${i}` }} className="w-5 h-5 rounded-full border border-white" />)}
                    </View>
                    <Text className="text-[9px] font-plus-ebold text-white uppercase tracking-widest">MATCHING NOW</Text>
                  </View>

                  <View className="absolute bottom-0 left-0 w-full p-8 space-y-3">
                    <View className="flex-row items-center"><Calendar size={14} color="#FB8B3F" /><Text className="text-xs font-plus-bold text-[#FB8B3F] uppercase ml-2 tracking-widest">{formatEventDate(event.eventDate)} • 22:00</Text></View>
                    <Text className="text-4xl font-plus-ebold text-white tracking-tighter leading-tight">{event.title}</Text>
                    <View className="flex-row items-center opacity-90"><MapPin size={14} color="#E0D2C6" /><Text className="text-sm font-plus-medium text-[#E0D2C6] ml-2">{event.location}</Text></View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="px-6 mt-4">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className={`text-2xl font-plus-ebold ${isDark ? 'text-stone-50' : 'text-on-surface'} tracking-tight`}>Meus Interesses</Text>
                <Text className={`text-xs font-plus-medium ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Eventos que você favoritou ou vai participar</Text>
              </View>
              <Heart size={20} color="#FB8B3F" fill="#FB8B3F" />
            </View>

            {isLoadingInterests ? (
              <ActivityIndicator color="#FB8B3F" />
            ) : interests?.length > 0 ? (
              <View className="flex-row flex-wrap justify-between">
                {interests.map((event: any) => (
                  <EventCard 
                    key={event.id}
                    event={event}
                    onPress={handleEventPress}
                    onFavorite={handleFavorite}
                    isFavorite={true}
                  />
                ))}
              </View>
            ) : (
              <View className={`${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-low border-outline-variant/30'} rounded-[2rem] p-8 items-center border`}>
                <Text className={`${isDark ? 'text-stone-400' : 'text-on-surface-variant'} font-plus-medium text-center`}>Você ainda não marcou interesse em nenhum evento.</Text>
                <TouchableOpacity 
                  onPress={() => router.push('/(tabs)/explore')}
                  className="mt-4"
                >
                  <Text className="text-[#FB8B3F] font-plus-bold">Explorar Eventos</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
