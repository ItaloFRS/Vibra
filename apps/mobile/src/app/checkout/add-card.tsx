import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function AddCardScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const matched = cleaned.match(/.{1,4}/g);
    return matched ? matched.join(' ') : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleSave = () => {
    router.back();
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView className={`z-50 flex-row items-center px-6 py-4 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
        <TouchableOpacity onPress={() => router.back()} className={`mr-4 p-2 rounded-full ${isDark ? 'bg-stone-900' : ''}`}>
          <ArrowLeft color={isDark ? '#FB8B3F' : '#954400'} size={24} />
        </TouchableOpacity>
        <Text className={`font-plus-bold text-lg ${isDark ? 'text-primary-container' : 'text-primary'}`}>Novo Cartão</Text>
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className={`px-6 pt-4 ${isDark ? 'bg-stone-950' : 'bg-background'}`} showsVerticalScrollIndicator={false}>
          
          <View className="mb-10 items-center">
            <View className="w-full aspect-[1.586/1] max-w-[350px]">
              {!isFlipped ? (
                <LinearGradient 
                  colors={isDark ? ['#1C1917', '#0C0A09'] : ['#1A0700', '#482603']} 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 1 }}
                  className="w-full h-full rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                >
                  <View className="flex-row justify-between items-start mb-10">
                    <View className="w-12 h-10 bg-white/10 rounded-lg" />
                    <View className="w-12 h-8 flex-row -space-x-4">
                       <View className="w-8 h-8 rounded-full bg-red-500 opacity-80" />
                       <View className="w-8 h-8 rounded-full bg-orange-400 opacity-80" />
                    </View>
                  </View>

                  <Text className="text-white font-plus-bold text-2xl tracking-widest mb-8">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </Text>

                  <View className="flex-row justify-between items-end">
                    <View className="flex-1 mr-4">
                      <Text className="text-white/40 text-[10px] font-plus-bold uppercase tracking-widest mb-1">Titular</Text>
                      <Text className="text-white font-plus-bold text-sm uppercase" numberOfLines={1}>
                        {cardName || 'NOME NO CARTÃO'}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white/40 text-[10px] font-plus-bold uppercase tracking-widest mb-1">Validade</Text>
                      <Text className="text-white font-plus-bold text-sm">
                        {expiry || 'MM/AA'}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
                </LinearGradient>
              ) : (
                <LinearGradient 
                  colors={isDark ? ['#1C1917', '#0C0A09'] : ['#482603', '#1A0700']} 
                  className="w-full h-full rounded-[2rem] py-8 shadow-2xl relative"
                >
                  <View className="w-full h-12 bg-black/40 mt-4 mb-6" />
                  <View className="px-8">
                    <View className="w-full h-10 bg-white/10 rounded flex-row items-center justify-end px-4">
                       <Text className="text-white font-plus-bold tracking-widest">{cvv || '•••'}</Text>
                    </View>
                    <Text className="text-white/40 text-[8px] mt-2 italic font-plus">Este cartão é pessoal e intransferível. O uso indevido é crime.</Text>
                  </View>
                </LinearGradient>
              )}
            </View>
          </View>

          <View className="space-y-6">
            <View>
              <Text className={`font-plus-bold text-[10px] uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Número do Cartão</Text>
              <TextInput 
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={isDark ? '#57534E' : '#b5aba3'}
                keyboardType="numeric"
                maxLength={19}
                value={cardNumber}
                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                onFocus={() => setIsFlipped(false)}
                className={`rounded-2xl px-6 py-4 font-plus-bold text-lg border ${isDark ? 'bg-stone-900 text-stone-100 border-stone-800' : 'bg-surface-container-low text-on-surface border-outline-variant/10'}`}
              />
            </View>

            <View>
              <Text className={`font-plus-bold text-[10px] uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Nome no Cartão</Text>
              <TextInput 
                placeholder="Ex: JOÃO DA SILVA"
                placeholderTextColor={isDark ? '#57534E' : '#b5aba3'}
                autoCapitalize="characters"
                value={cardName}
                onChangeText={setCardName}
                onFocus={() => setIsFlipped(false)}
                className={`rounded-2xl px-6 py-4 font-plus-bold text-lg border ${isDark ? 'bg-stone-900 text-stone-100 border-stone-800' : 'bg-surface-container-low text-on-surface border-outline-variant/10'}`}
              />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className={`font-plus-bold text-[10px] uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Validade</Text>
                <TextInput 
                  placeholder="MM/AA"
                  placeholderTextColor={isDark ? '#57534E' : '#b5aba3'}
                  keyboardType="numeric"
                  maxLength={5}
                  value={expiry}
                  onChangeText={(t) => setExpiry(formatExpiry(t))}
                  onFocus={() => setIsFlipped(false)}
                  className={`rounded-2xl px-6 py-4 font-plus-bold text-lg border ${isDark ? 'bg-stone-900 text-stone-100 border-stone-800' : 'bg-surface-container-low text-on-surface border-outline-variant/10'}`}
                />
              </View>
              <View className="flex-1">
                <Text className={`font-plus-bold text-[10px] uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>CVV</Text>
                <TextInput 
                  placeholder="000"
                  placeholderTextColor={isDark ? '#57534E' : '#b5aba3'}
                  keyboardType="numeric"
                  maxLength={4}
                  value={cvv}
                  onChangeText={setCvv}
                  onFocus={() => setIsFlipped(true)}
                  className={`rounded-2xl px-6 py-4 font-plus-bold text-lg border ${isDark ? 'bg-stone-900 text-stone-100 border-stone-800' : 'bg-surface-container-low text-on-surface border-outline-variant/10'}`}
                />
              </View>
            </View>

            <View className={`flex-row items-center p-4 rounded-2xl border mt-4 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-lowest border-outline-variant/5'}`}>
               <Info size={16} color={isDark ? '#FB8B3F' : '#954400'} />
               <Text className={`text-[10px] font-plus-medium ml-3 flex-1 ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
                 Suas informações de pagamento são criptografadas e nunca ficam salvas em nossos servidores.
               </Text>
            </View>
          </View>

          <View className="h-40" />
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="absolute bottom-10 left-0 w-full px-6">
        <TouchableOpacity 
          onPress={handleSave}
          className={`py-5 rounded-2xl items-center justify-center shadow-lg ${isDark ? 'bg-primary-container' : 'bg-primary'}`}
        >
          <Text className={`font-plus-ebold text-lg uppercase tracking-widest ${isDark ? 'text-stone-950' : 'text-white'}`}>Salvar Cartão</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
