import React, { useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Text, Animated, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { OnboardingSlide } from '../components/Onboarding/OnboardingSlide';
import { PaginationDot } from '../components/Onboarding/PaginationDot';
import { useOnboarding } from '../hooks/useOnboarding';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: 'Descoberta de Eventos',
    description: 'Encontre as melhores festas, shows e eventos culturais na palma da sua mão.',
    image: require('../../assets/Onboarding/Exploar_Evento-Orbita.png'), 
  },
  {
    id: 2,
    title: 'Networking & Match',
    description: 'Conecte-se com pessoas que compartilham seus interesses antes mesmo do evento começar.',
    image: require('../../assets/Onboarding/Match-Orbita.png'),
  },
  {
    id: 3,
    title: 'Ingressos Digitais',
    description: 'Sua carteira de ingressos segura e prática. Diga adeus ao papel e filas desnecessárias.',
    image: require('../../assets/Onboarding/Ingressos-orbita.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { markAsSeen } = useOnboarding();
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleFinish = async () => {
    await markAsSeen();
    router.push('/(auth)/login');
  };

  const handleRegister = async () => {
    await markAsSeen();
    router.push('/(auth)/register');
  };

  const handleSkip = async () => {
    await markAsSeen();
    router.push('/(auth)/login');
  };

  const skipOpacity = scrollOffset.interpolate({
    inputRange: [0, (SLIDES.length - 2) * width, (SLIDES.length - 1) * width],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const footerOpacity = scrollOffset.interpolate({
    inputRange: [(SLIDES.length - 2) * width, (SLIDES.length - 1) * width],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nextOpacity = scrollOffset.interpolate({
    inputRange: [(SLIDES.length - 2) * width, (SLIDES.length - 1) * width],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      
      <Animated.View style={{ opacity: skipOpacity, zIndex: 20 }} className="absolute top-12 right-6">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-white font-plus-bold text-base">Pular</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollOffset } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide, index) => (
          <OnboardingSlide 
            key={slide.id} 
            slide={slide} 
            index={index} 
            scrollOffset={scrollOffset} 
          />
        ))}
      </Animated.ScrollView>

      <View className="absolute bottom-12 left-0 right-0 items-center">
        <View className="flex-row mb-8">
          {SLIDES.map((_, index) => (
            <PaginationDot 
              key={index} 
              index={index} 
              scrollOffset={scrollOffset} 
            />
          ))}
        </View>

        <View className="w-full px-8 h-14">
          <Animated.View 
            style={{ 
              opacity: footerOpacity, 
              zIndex: 15,
              position: 'absolute',
              left: 32,
              right: 32,
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity 
              className="flex-1 bg-surface-container border border-outline h-14 rounded-full items-center justify-center mr-2"
              onPress={handleFinish}
            >
              <Text className="text-on-surface font-plus-bold text-base">Entrar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-primary h-14 rounded-full items-center justify-center ml-2"
              onPress={handleRegister}
            >
              <Text className="text-white font-plus-bold text-base">Criar Conta</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View 
            style={{ 
              opacity: nextOpacity, 
              zIndex: 10,
              position: 'absolute', 
              left: 32, 
              right: 32 
            }}
          >
            <TouchableOpacity 
              className="w-full bg-primary h-14 rounded-full items-center justify-center"
              onPress={() => {
                // @ts-ignore
                const currentOffset = scrollOffset._value || 0;
                const nextIndex = Math.floor(currentOffset / width) + 1;
                scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
              }}
            >
              <Text className="text-white font-plus-bold text-base">Próximo</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
