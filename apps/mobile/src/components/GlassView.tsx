import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  borderRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
}

/**
 * A Premium Glassmorphism component using Expo Blur.
 */
export const GlassView: React.FC<GlassViewProps> = ({ 
  children, 
  style, 
  intensity = 60, 
  tint = 'dark',
  borderRadius = 0,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderTopLeftRadius,
  borderTopRightRadius
}) => {
  const isDark = tint === 'dark';
  
  const shapeStyles = {
    borderRadius,
    borderBottomLeftRadius: borderBottomLeftRadius ?? borderRadius,
    borderBottomRightRadius: borderBottomRightRadius ?? borderRadius,
    borderTopLeftRadius: borderTopLeftRadius ?? borderRadius,
    borderTopRightRadius: borderTopRightRadius ?? borderRadius,
    overflow: 'hidden' as 'hidden',
  };

  return (
    <View style={[style, shapeStyles]}>
      <View style={StyleSheet.absoluteFill}>
        {/* Base layer for density */}
        <View style={[
          StyleSheet.absoluteFill, 
          { backgroundColor: isDark ? 'rgba(28, 25, 23, 0.65)' : 'rgba(255, 255, 255, 0.65)' }
        ]} />
        <BlurView 
          intensity={intensity} 
          tint={tint} 
          style={StyleSheet.absoluteFill} 
          //experimentalBlurMethod="dimezisBlurView"
        />
      </View>
      {children}
    </View>
  );
};
