import React from 'react';
import { Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

interface PaginationDotProps {
  index: number;
  scrollOffset: any; // Using standard Animated.Value
}

export const PaginationDot: React.FC<PaginationDotProps> = ({ 
  index, 
  scrollOffset 
}) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const dotWidth = scrollOffset.interpolate({
    inputRange,
    outputRange: [10, 24, 10],
    extrapolate: 'clamp',
  });

  const opacity = scrollOffset.interpolate({
    inputRange,
    outputRange: [0.4, 1, 0.4],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      className="h-2.5 rounded-full bg-primary mx-1"
      style={{
        width: dotWidth,
        opacity,
      }}
    />
  );
};
