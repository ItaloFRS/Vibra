import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface UserAvatarProps {
  uri?: string;
  size?: number;
  style?: ViewStyle | any;
  borderWidth?: number;
  borderColor?: string;
  shape?: 'circle' | 'rect';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  uri, 
  size = 40, 
  style,
  borderWidth = 0,
  borderColor = 'transparent',
  shape = 'circle'
}) => {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: shape === 'circle' ? size / 2 : 0,
    overflow: 'hidden' as const,
    borderWidth,
    borderColor,
    ...style
  };

  if (!uri || uri.includes('placeholder.com')) {
    return (
      <View style={containerStyle}>
        <LinearGradient
          colors={['#5C5C5C', '#D66000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, alignItems: 'center', justifyCenter: 'center' } as any}
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
             <User color="white" size={size * 0.6} strokeWidth={2.5} />
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={300}
      />
    </View>
  );
};
