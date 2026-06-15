import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { Heart, MapPin, Clock } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    thumbnailUrl: string;
    eventDate: string;
    location: string;
    isMatching?: boolean;
    externalTicketLink?: string;
    tickets?: any[];
  };
  variant?: 'grid' | 'list';
  onPress?: (id: string) => void;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export default function EventCard({ 
  event, 
  variant = 'grid', 
  onPress, 
  onFavorite, 
  isFavorite 
}: EventCardProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const dateObj = new Date(event.eventDate);
  const now = new Date();
  const isPast = dateObj < now;
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();

  const getMinPrice = () => {
    if (!event.tickets || event.tickets.length === 0) return 'Grátis';
    const min = Math.min(...event.tickets.map((t: any) => t.price));
    return `R$ ${min}`;
  };

  const handlePress = () => {
    if (onPress) onPress(event.id);
  };

  if (variant === 'list') {
    return (
      <TouchableOpacity 
        activeOpacity={isPast ? 1 : 0.9} 
        className={`mb-10 w-full ${isPast ? 'opacity-50' : ''}`} 
        onPress={handlePress}
      >
        <View className={`relative aspect-[16/9] w-full overflow-hidden rounded-2xl ${isPast ? (isDark ? 'bg-stone-700' : 'bg-gray-300') : (isDark ? 'bg-stone-800/50' : 'bg-[#ffd5b4]/20')} shadow-sm`}>
          <Image 
            source={{ uri: event.thumbnailUrl }} 
            className={`w-full h-full ${isPast ? 'grayscale' : ''}`}
            resizeMode="cover" 
          />
          
          {!isPast && event.isMatching && (
            <View className={`absolute top-4 left-4 ${isDark ? 'bg-stone-900/90' : 'bg-white/90'} px-3 py-1.5 rounded-full flex-row items-center shadow-sm`}>
              <View className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#FB8B3F]' : 'bg-[#954400]'}`} />
              <Text className={`text-[10px] font-plus-bold uppercase tracking-wider ml-1.5 ${isDark ? 'text-stone-200' : 'text-[#482603]'}`}>
                Matching Now
              </Text>
            </View>
          )}

          <View className={`absolute bottom-4 right-4 ${isPast ? (isDark ? 'bg-stone-600' : 'bg-gray-500') : (isDark ? 'bg-primary-container' : 'bg-[#954400]')} px-4 py-2 rounded-full shadow-md flex-row items-center`}>
            {event.externalTicketLink ? (
              <TouchableOpacity onPress={() => Linking.openURL(event.externalTicketLink!)}>
                <Text className={`font-plus-bold text-xs ${isDark ? 'text-stone-950' : 'text-white'}`}>
                  Comprar
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className={`font-plus-bold text-xs ${isDark ? 'text-stone-950' : 'text-white'}`}>
                {getMinPrice()}
              </Text>
            )}
          </View>

          {!isPast && (
            <TouchableOpacity 
              onPress={() => onFavorite?.(event.id)}
              testID="favorite-button"
              className={`absolute top-4 right-4 w-10 h-10 rounded-full items-center justify-center backdrop-blur-md border ${isDark ? 'bg-stone-900/30 border-white/10' : 'bg-white/20 border-white/30'}`}
            >
              <Heart 
                size={20} 
                color={isFavorite ? "#d23383" : "white"} 
                fill={isFavorite ? "#d23383" : "transparent"} 
              />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row mt-5 px-1">
          <View className="items-center mr-5">
            <Text className={`${isPast ? 'text-gray-500' : (isDark ? 'text-[#FB8B3F]' : 'text-[#954400]')} font-plus-extrabold text-2xl leading-none`}>{day}</Text>
            <Text className={`text-[10px] uppercase tracking-widest font-plus-bold mt-1 ${isPast ? 'text-gray-500' : (isDark ? 'text-stone-400 opacity-40' : 'text-[#482603] opacity-40')}`}>{month}</Text>
          </View>
          
          <View className="flex-1 justify-center">
            <Text className={`text-xl font-plus-bold leading-tight mb-1 ${isPast ? 'text-gray-500' : (isDark ? 'text-stone-200' : 'text-[#482603]')}`} numberOfLines={1}>
              {event.title}
            </Text>
            <View className="flex-row items-center">
              <View className="flex-row items-center mr-4 opacity-60">
                <MapPin size={12} color={isPast ? "#999" : (isDark ? "#E7E5E4" : "#482603")} />
                <Text className={`text-[11px] font-plus-medium ml-1 ${isDark ? 'text-stone-300' : 'text-[#482603]'}`}>
                  {event.location?.split(',')[0]}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Default Grid Variant
  return (
    <TouchableOpacity 
      activeOpacity={isPast ? 1 : 0.8} 
      className={`w-[48%] mb-6 ${isPast ? 'opacity-50' : ''}`} 
      onPress={handlePress}
    >
      <View className={`aspect-[3/4] rounded-2xl overflow-hidden relative shadow-md ${isDark ? 'bg-stone-900' : 'bg-[#f3e6dc]'}`}>
        <Image source={{ uri: event.thumbnailUrl }} className={`w-full h-full ${isPast ? 'grayscale' : ''}`} resizeMode="cover" />
        <View className={`absolute top-3 left-3 px-2 py-1 rounded ${isDark ? 'bg-stone-800/95' : 'bg-[#fff5ed]/95'}`}>
          <Text className={`text-[9px] font-plus-bold uppercase ${isDark ? 'text-stone-400' : 'text-[#625a53]'}`}>
            {day} {month}
          </Text>
        </View>
        {!isPast && (
          <TouchableOpacity 
            onPress={() => onFavorite?.(event.id)}
            testID="favorite-button"
            className={`absolute top-3 right-3 w-8 h-8 rounded-full items-center justify-center backdrop-blur-md ${isDark ? 'bg-stone-900/40' : 'bg-white/30'}`}
          >
            <Heart 
              size={16} 
              color={isFavorite ? "#d23383" : "white"} 
              fill={isFavorite ? "#d23383" : "transparent"} 
            />
          </TouchableOpacity>
        )}
      </View>
      <View className="mt-3 px-1">
        <Text className={`font-plus-bold text-sm leading-tight ${isPast ? 'text-gray-500' : (isDark ? 'text-stone-50' : 'text-[#342e28]')}`} numberOfLines={1}>{event.title}</Text>
        <Text className={`text-[10px] font-plus-medium mt-1 ${isDark ? 'text-stone-400' : 'text-[#625a53]'}`}>{event.location?.split(',')[0] || ''}</Text>
      </View>
    </TouchableOpacity>
  );
}
