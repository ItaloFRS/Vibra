import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions, Modal, Animated, PanResponder, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, X, Star, Zap, ShieldAlert, Sparkles, MessagesSquare, Send } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import { UserAvatar } from './common/UserAvatar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = 480;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const TILT_THRESHOLD = 0.5; // Threshold for accelerometer tilt

interface UserResponse {
  id: string;
  fullName: string;
  profilePhotoUrl: string;
  bio: string;
  preferences: any;
}

interface InterestResponse {
  eventId: string;
  favorite: boolean;
  hasTicket: boolean;
}

interface MatchTabProps {
  eventId: string;
  eventName: string;
}

export default function MatchTab({ eventId, eventName }: MatchTabProps) {
  const { user: currentUser } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showMatchSuccess, setShowMatchSuccess] = useState<any>(null);
  const cardRefs = useRef<Record<string, any>>({});

  const isProfileComplete = () => {
    // Para teste, vamos liberar se o switch de match estiver ligado
    return currentUser?.preferences?.wantsMatches === true;
  };

  const { data: interest, isLoading: isLoadingInterest } = useQuery<InterestResponse>({
    queryKey: ['interest', eventId],
    queryFn: async () => {
      const response = await api.get(`/social/events/${eventId}/interest`);
      return response.data?.data || response.data || { favorite: false, hasTicket: false };
    }
  });

  const { data: potentialSwipes, isLoading: isLoadingPotentials, refetch: refetchPotentials, error: potentialsError } = useQuery<UserResponse[]>({
    queryKey: ['potentials', eventId],
    queryFn: async () => {
      const response = await api.get(`/social/events/${eventId}/potential-swipes`);
      // Pega o array de usuários independentemente de estar dentro de um campo 'data' ou na raiz
      const users = response.data?.data || response.data;
      return Array.isArray(users) ? users : [];
    },
    enabled: !!interest && (interest.favorite || interest.hasTicket) && isProfileComplete(),
    retry: false
  });

  const swipeMutation = useMutation({
    mutationFn: async ({ swipedUserId, isLike }: { swipedUserId: string, isLike: boolean }) => {
      const response = await api.post('/social/swipe', { eventId, swipedUserId, isLike });
      return response.data?.data || response.data || null;
    },
    onSuccess: (match) => {
      if (match && match.matchedUserId) {
        setShowMatchSuccess(match);
        queryClient.invalidateQueries({ queryKey: ['matchCount'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['potentials', eventId] });
      }
    }
  });

  const handleCloseMatch = () => {
    setShowMatchSuccess(null);
    queryClient.invalidateQueries({ queryKey: ['potentials', eventId] });
  };

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/social/events/${eventId}/favorite`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interest', eventId] });
    }
  });

  const getIncompleteProfileMessage = () => {
    if (potentialsError) {
      const apiMessage = (potentialsError as any)?.response?.data?.message;
      if (apiMessage) return apiMessage;
    }
    return 'Para acessar o Vibra Match e encontrar pessoas com a sua vibe, você precisa completar as preferências no seu perfil e ativar os matches.';
  };

  if (isLoadingInterest || (interest && (interest.favorite || interest.hasTicket) && isProfileComplete() && isLoadingPotentials)) {
    return (
      <View style={{ height: CARD_HEIGHT }} className="items-center justify-center">
        <ActivityIndicator color="#FB8B3F" size="large" />
      </View>
    );
  }

  if (!interest?.favorite && !interest?.hasTicket) {
    return (
      <View style={{ minHeight: CARD_HEIGHT }} className={`px-6 py-12 items-center ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
        <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${isDark ? 'bg-primary-container/10' : 'bg-primary-container/20'}`}>
          <ShieldAlert color="#FB8B3F" size={40} />
        </View>
        <Text className={`text-2xl font-plus-ebold text-center mb-4 ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>Match Contextual</Text>
        <Text className={`text-center font-plus mb-10 leading-relaxed ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
          Para garantir que você encontre pessoas realmente interessadas, o Match é liberado apenas para quem favoritou o evento ou já garantiu o ingresso.
        </Text>
        <TouchableOpacity 
          className={`py-5 px-10 rounded-full shadow-lg items-center justify-center w-full ${isDark ? 'bg-primary-container' : 'bg-primary'}`}
          onPress={() => favoriteMutation.mutate()}
        >
          {favoriteMutation.isPending ? <ActivityIndicator color="#1A0700" /> : <Text className={`font-plus-ebold text-lg uppercase tracking-widest ${isDark ? 'text-stone-950' : 'text-white'}`}>Favoritar Agora</Text>}
        </TouchableOpacity>
      </View>
    );
  }

  if (!isProfileComplete() || potentialsError) {
    return (
      <View style={{ minHeight: CARD_HEIGHT }} className={`px-6 py-12 items-center ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
        <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${isDark ? 'bg-secondary-container/10' : 'bg-secondary-container/20'}`}>
          <Sparkles color="#6A37D4" size={40} />
        </View>
        <Text className={`text-2xl font-plus-ebold text-center mb-4 ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>Perfil Incompleto</Text>
        <Text className={`text-center font-plus mb-10 leading-relaxed ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
          {getIncompleteProfileMessage()}
        </Text>
        <TouchableOpacity 
          className={`py-5 px-10 rounded-full shadow-lg items-center justify-center w-full ${isDark ? 'bg-primary-container' : 'bg-primary'}`}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Text className={`font-plus-ebold text-lg uppercase tracking-widest ${isDark ? 'text-stone-950' : 'text-white'}`}>Completar Perfil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!potentialSwipes || potentialSwipes.length === 0) {
    return (
      <View style={{ height: CARD_HEIGHT }} className={`px-10 py-20 items-center ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
        <View className={`w-16 h-16 rounded-full items-center justify-center mb-6 opacity-50 ${isDark ? 'bg-stone-900' : 'bg-surface-container-high'}`}>
          <Heart color={isDark ? "#FB8B3F" : "#954400"} size={32} />
        </View>
        <Text className={`text-xl font-plus-bold text-center ${isDark ? 'text-stone-300' : 'text-on-surface-variant'}`}>Ninguém novo por aqui.</Text>
        <Text className={`text-sm text-center mt-2 font-plus ${isDark ? 'text-stone-500' : 'text-on-surface-variant/60'}`}>Volte mais tarde para ver novas pessoas!</Text>
        <TouchableOpacity className="mt-8" onPress={() => refetchPotentials()}>
          <Text className={`font-plus-bold uppercase text-xs tracking-widest ${isDark ? 'text-primary-container' : 'text-primary'}`}>Recarregar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAction = (direction: 'left' | 'right') => {
    const topCardId = potentialSwipes?.[0]?.id;
    if (topCardId && cardRefs.current[topCardId]) {
      cardRefs.current[topCardId].forceSwipe(direction);
    }
  };

  return (
    <View style={{ height: CARD_HEIGHT + 180 }} className={`px-6 pt-2 pb-10 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
      <View style={{ height: CARD_HEIGHT, position: 'relative', width: '100%' }}>
        {potentialSwipes.slice(0, 3).map((profile, index) => (
          <SwipeCard 
            key={profile.id}
            ref={(el: any) => (cardRefs.current[profile.id] = el)}
            profile={profile}
            isFirst={index === 0}
            index={index}
            isDark={isDark}
            onSwipe={(isLike: boolean) => swipeMutation.mutate({ swipedUserId: profile.id, isLike })}
          />
        )).reverse()}
      </View>

      <View style={{ marginTop: 32, marginBottom: 20 }} className="flex-row justify-center items-center gap-8">
        <TouchableOpacity onPress={() => handleAction('left')} className={`w-16 h-16 rounded-full shadow-xl items-center justify-center border active:scale-90 ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-outline-variant/10'}`}><X color={isDark ? '#A8A29E' : '#7D522B'} size={28} strokeWidth={3} /></TouchableOpacity>
        <TouchableOpacity onPress={() => handleAction('right')} className={`w-20 h-20 rounded-full items-center justify-center shadow-2xl active:scale-95 ${isDark ? 'bg-primary-container' : 'bg-primary'}`}><Heart color={isDark ? '#1C1917' : 'white'} size={36} fill="currentColor" /></TouchableOpacity>
        <TouchableOpacity className={`w-16 h-16 rounded-full shadow-xl items-center justify-center border active:scale-90 ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-outline-variant/10'}`}><Star color="#FB8B3F" size={28} fill="#FB8B3F" /></TouchableOpacity>
      </View>

      <Modal visible={!!showMatchSuccess} transparent animationType="fade">
        <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
          <LinearGradient 
            colors={isDark ? ['#0C0A09', '#1C1917'] : ['#FFF4EF', '#FFE3CF']} 
            className="flex-1 px-6 justify-center items-center"
          >
            <View className="absolute top-1/4 -right-20 w-80 h-80 bg-primary-container opacity-10 rounded-full blur-[80px]" />
            <View className="absolute bottom-1/4 -left-20 w-60 h-60 bg-secondary-container opacity-20 rounded-full blur-[60px]" />

            <TouchableOpacity 
              className={`absolute top-14 right-6 p-2 rounded-full z-50 ${isDark ? 'bg-stone-800/50' : 'bg-white/50'}`} 
              onPress={handleCloseMatch}
            >
              <X color={isDark ? '#FB8B3F' : '#954400'} size={24} />
            </TouchableOpacity>

            <View className="items-center mb-12 relative z-10">
              <Text className={`text-6xl font-plus-ebold tracking-tighter leading-none text-center ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>
                Deu <Text className={isDark ? 'text-primary-container' : 'text-primary'}>Match!</Text>
              </Text>
              <Text className={`text-lg text-center mt-4 font-plus-bold leading-tight max-w-[280px] ${isDark ? 'text-stone-300' : 'text-on-surface-variant'}`}>
                Você e {showMatchSuccess?.matchedUserName} estão na mesma vibe para o {eventName}.
              </Text>
            </View>

            <View className="relative flex-row items-center justify-center mb-16 w-full h-64">
              <View className="absolute inset-0 flex items-center justify-center">
                <View className={`w-full h-1 rotate-[-15deg] blur-[2px] ${isDark ? 'bg-primary-container/10' : 'bg-primary/20'}`} />
              </View>

              <View className="relative z-20 -mr-6 shadow-2xl">
                <UserAvatar 
                  uri={currentUser?.profilePhotoUrl} 
                  size={144} 
                  borderWidth={8} 
                  borderColor={isDark ? '#292524' : 'white'} 
                />
                <View className="absolute bottom-2 right-2 bg-secondary-container p-2 rounded-full shadow-lg">
                  <Zap color="#503987" size={16} fill="#503987" />
                </View>
              </View>

              <View className="relative z-10 mt-12 shadow-2xl">
                <UserAvatar 
                  uri={showMatchSuccess?.matchedUserPhotoUrl} 
                  size={144} 
                  borderWidth={8} 
                  borderColor={isDark ? '#292524' : 'white'} 
                />
                <View className="absolute top-2 left-2 bg-primary-container p-2 rounded-full shadow-lg">
                  <Heart color="#1A0700" size={16} fill="#1A0700" />
                </View>
              </View>
            </View>

            <View className="w-full max-w-sm gap-4 relative z-20">
              <TouchableOpacity 
                activeOpacity={0.9}
                className="rounded-full overflow-hidden shadow-xl"
                onPress={() => {
                  handleCloseMatch();
                  router.push({
                    pathname: `/chat/individual/${showMatchSuccess?.matchedUserId}`,
                    params: {
                      name: showMatchSuccess?.matchedUserName,
                      photoUrl: showMatchSuccess?.matchedUserPhotoUrl
                    }
                  });
                }}
              >
                <LinearGradient colors={['#954400', '#FB8B3F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="py-5 px-8 flex-row items-center justify-center">
                  <MessagesSquare color="#1A0700" size={24} />
                  <Text className="text-on-primary-fixed font-plus-ebold text-lg uppercase tracking-widest ml-3">Enviar Mensagem</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                className={`py-5 px-8 rounded-full items-center justify-center active:bg-surface-container-high ${isDark ? 'bg-stone-800' : 'bg-surface-container-low'}`}
                onPress={handleCloseMatch}
              >
                <Text className={`font-plus-bold text-lg uppercase tracking-widest ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Continuar no Match</Text>
              </TouchableOpacity>
            </View>

            <View className={`mt-12 p-5 backdrop-blur-xl rounded-2xl max-w-sm w-full shadow-sm border flex-row items-center ${isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-white/60 border-white/20'}`}>
              <View className={`w-12 h-12 rounded-xl overflow-hidden mr-4 ${isDark ? 'bg-stone-800' : 'bg-surface-container-highest'}`}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=200' }} className="w-full h-full" />
              </View>
              <View className="flex-1">
                <Text className={`text-[10px] font-plus-ebold uppercase tracking-widest mb-1 ${isDark ? 'text-primary-container' : 'text-primary'}`}>Dica de Encontro</Text>
                <Text className={`text-xs font-plus-bold leading-tight ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>
                  Que tal se encontrarem perto do palco principal às 22h?
                </Text>
              </View>
            </View>

            <View className="absolute bottom-8 items-center">
              <Text className={`text-[10px] font-plus-ebold uppercase tracking-widest ${isDark ? 'text-stone-500' : 'text-on-surface-variant/40'}`}>Vibra Social Experience</Text>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const SwipeCard = forwardRef(({ profile, isFirst, index, onSwipe, isDark }: any, ref) => {
  const { user: currentUser } = useAuth();
  const position = useRef(new Animated.ValueXY()).current;
  const tiltCount = useRef(0);
  const lastTiltDir = useRef<'left' | 'right' | null>(null);
  const isCenteredRef = useRef(true);
  const isFirstRef = useRef(isFirst);
  isFirstRef.current = isFirst;

  useEffect(() => {
    let subscription: any;
    if (isFirstRef.current && currentUser?.preferences?.enableTiltMatches !== false) {
        Accelerometer.setUpdateInterval(80);
        subscription = Accelerometer.addListener(data => {
            // Direction Check: Inverted per user feedback (Negative X is RIGHT/LIKE, Positive X is LEFT/NOPE)
            const currentTilt = data.x > TILT_THRESHOLD ? 'left' : (data.x < -TILT_THRESHOLD ? 'right' : null);
            
            if (currentTilt) {
                if (isCenteredRef.current) {
                    handleTilt(currentTilt);
                    isCenteredRef.current = false;
                }
            } else if (Math.abs(data.x) < 0.2) {
                isCenteredRef.current = true;
            }
        });
    }
    return () => {
        subscription?.remove();
        tiltCount.current = 0;
        lastTiltDir.current = null;
    };
  }, [isFirst, currentUser?.preferences?.enableTiltMatches]);

  const handleTilt = (direction: 'left' | 'right') => {
      if (lastTiltDir.current !== direction) {
          tiltCount.current = 1;
          lastTiltDir.current = direction;
          animatePeek(direction);
      } else {
          if (tiltCount.current === 1) {
            tiltCount.current = 0;
            lastTiltDir.current = null;
            forceSwipe(direction);
          }
      }
  };

  const animatePeek = (direction: 'left' | 'right') => {
      const x = direction === 'right' ? 100 : -100;
      Animated.spring(position, {
          toValue: { x, y: -20 },
          friction: 6,
          tension: 40,
          useNativeDriver: true
      }).start();
      
      setTimeout(() => {
          if (tiltCount.current === 1 && lastTiltDir.current === direction) {
              tiltCount.current = 0;
              lastTiltDir.current = null;
              resetPosition();
          }
      }, 2500);
  };

  useImperativeHandle(ref, () => ({
    forceSwipe: (direction: 'right' | 'left') => {
      forceSwipe(direction);
    }
  }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isFirstRef.current,
      onPanResponderMove: (event, gesture) => {
        if (isFirstRef.current) {
          position.setValue({ x: gesture.dx, y: gesture.dy });
          tiltCount.current = 0;
          lastTiltDir.current = null;
        }
      },
      onPanResponderRelease: (event, gesture) => {
        if (!isFirstRef.current) return;
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 350,
      useNativeDriver: true
    }).start(() => onSwipe(direction === 'right'));
  };

  const resetPosition = () => {
    Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 4, useNativeDriver: true }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-60deg', '0deg', '60deg']
    });

    const scale = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [1, 1 - (index * 0.05), 1],
      extrapolate: 'clamp'
    });

    const translateY = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [0, index * 10, 0],
      extrapolate: 'clamp'
    });

    return {
      transform: [
        { translateX: position.x },
        { translateY: Animated.add(position.y, translateY) },
        { rotate },
        { scale }
      ],
      width: SCREEN_WIDTH - 48,
      height: CARD_HEIGHT,
      position: 'absolute' as 'absolute',
      zIndex: 100 - index,
    };
  };

  const likeOpacity = position.x.interpolate({ 
    inputRange: [0, 100, SCREEN_WIDTH / 2], 
    outputRange: [0, 0.7, 0.98], 
    extrapolate: 'clamp' 
  });
  
  const nopeOpacity = position.x.interpolate({ 
    inputRange: [-SCREEN_WIDTH / 2, -100, 0], 
    outputRange: [0.98, 0.7, 0], 
    extrapolate: 'clamp' 
  });

  const overlayScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [1.3, 1, 1.3],
    extrapolate: 'clamp'
  });

  const profileVibes = (profile.preferences?.vibes as string[])?.slice(0, 2) || [];

  return (
    <Animated.View {...panResponder.panHandlers} style={[getCardStyle() as any]} className={`rounded-3xl overflow-hidden shadow-2xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-outline-variant/10'}`}>
      <UserAvatar 
        uri={profile.profilePhotoUrl} 
        size={SCREEN_WIDTH - 48} 
        shape="rect"
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />
      
      <LinearGradient 
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,1)']} 
        locations={[0.3, 0.6, 0.95]}
        className="absolute inset-0" 
      />

      {/* LIKE Overlay (Smoke Effect) */}
      <Animated.View 
        pointerEvents="none"
        style={{ 
          opacity: likeOpacity,
          zIndex: 60
        }} 
        className="absolute inset-0 w-full h-full"
      >
          <LinearGradient 
            colors={['rgba(34,197,94,0.1)', 'rgba(34,197,94,0.75)', 'rgba(22,163,74,1)']}
            className="absolute inset-0"
          />
          <View className="flex-1 items-center justify-center">
            <Animated.View style={{ transform: [{ scale: overlayScale }] }} className=" px-14 py-8 rotate-[-12deg] bg-green-500 w-full h-full shadow-2xl">
                <Text className="text-white text-xs font-plus-ebold uppercase tracking-tighter" style={{ textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 20 }}>LIKE</Text>
            </Animated.View>
          </View>
      </Animated.View>

      {/* NOPE Overlay (Smoke Effect) */}
      <Animated.View 
        pointerEvents="none"
        style={{ 
          opacity: nopeOpacity,
          zIndex: 60
        }} 
        className="absolute inset-0 w-full h-full"
      >
          <LinearGradient 
            colors={['rgba(239,68,68,0.1)', 'rgba(239,68,68,0.75)', 'rgba(220,38,38,1)']}
            className="absolute inset-0"
          />
          <View className="flex-1 items-center justify-center">
            <Animated.View style={{ transform: [{ scale: overlayScale }] }} className=" px-14 py-8 rotate-[12deg] bg-red-500 w-full h-full shadow-2xl">
                <Text className="text-white text-xs font-plus-ebold uppercase tracking-tighter" style={{ textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 20 }}>NOPE</Text>
            </Animated.View>
          </View>
      </Animated.View>
      
      <View className="absolute bottom-8 left-8 right-8 z-10">
        <View className="flex-row gap-2 mb-4 w-full">
          {profileVibes.map((vibe, i) => (
            <View key={i} className="bg-primary-container px-6 py-3 rounded-full flex-row items-center shadow-2xl border border-white/20">
              <Sparkles color="#1A0700" size={16} fill="#1A0700" />
              <Text className="text-stone-950 text-xs font-plus-ebold uppercase ml-2">{vibe}</Text>
            </View>
          ))}
        </View>
        <Text style={{ textShadowColor: 'rgba(0, 0, 0, 1)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 15 }} className="text-white text-5xl font-plus-ebold mb-2 tracking-tighter">
          {profile.fullName?.split(' ')[0] || 'User'}, {profile.preferences?.age || '22'}
        </Text>
        <Text style={{ textShadowColor: 'rgba(0, 0, 0, 1)', textShadowRadius: 10 }} className="text-white font-plus-bold text-lg leading-tight mb-2 opacity-100" numberOfLines={2}>
          {profile.bio || "Buscando conexões reais no evento!"}
        </Text>
      </View>
    </Animated.View>
  );
});
