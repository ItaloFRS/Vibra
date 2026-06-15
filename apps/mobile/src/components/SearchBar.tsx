import React from 'react';
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ placeholder, value, onChangeText }: SearchBarProps) {
  const { theme } = useTheme();
  
  return (
    <View className="relative">
      <View className="absolute left-5 top-4 z-10">
        <Search size={20} color={theme === 'dark' ? '#A8A29E' : '#7e756e'} />
      </View>
      <TextInput 
        placeholder={placeholder} 
        className="w-full bg-[#fbefe5] dark:bg-stone-900 rounded-full pl-14 pr-6 py-4 font-plus text-sm text-[#342e28] dark:text-stone-100" 
        placeholderTextColor={theme === 'dark' ? '#57534E' : '#b5aba3'} 
        value={value} 
        onChangeText={onChangeText} 
      />
    </View>
  );
}
