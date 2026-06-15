import React from 'react';
import { View, Text, Dimensions, Animated } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SlideData {
  title: string;
  description: string;
  image: any;
}

interface OnboardingSlideProps {
  slide: SlideData;
  index: number;
  scrollOffset: any; 
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ 
  slide, 
  index, 
  scrollOffset 
}) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const opacity = scrollOffset.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const translateY = scrollOffset.interpolate({
    inputRange,
    outputRange: [100, 0, 100],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ width, height }}>
      <Animated.View style={{ flex: 1, opacity }}>
        <Image 
          source={slide.image} 
          contentFit="cover"
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          transition={500}
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(12, 10, 9, 0.8)', 'rgba(12, 10, 9, 1)']}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.5 }}
        />
      </Animated.View>

      <Animated.View 
        style={{ 
          position: 'absolute',
          bottom: 220,
          left: 0,
          right: 0,
          paddingHorizontal: 32,
          alignItems: 'center',
          transform: [{ translateY }],
          opacity,
        }}
      >
        <Text className="text-white font-plus-ebold text-4xl text-center mb-4 leading-tight">
          {slide.title}
        </Text>
        <Text className="text-stone-300 font-plus text-lg text-center leading-6">
          {slide.description}
        </Text>
      </Animated.View>
    </View>
  );
};
