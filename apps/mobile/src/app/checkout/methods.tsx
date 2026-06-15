import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CreditCard, Landmark, Wallet, ChevronRight, CheckCircle2, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { eventId, ticketTypeId, quantity } = useLocalSearchParams();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const savedCards = [
    { id: '1', brand: 'Visa', last4: '4590', label: 'Nubank Pessoal' },
    { id: '2', brand: 'Mastercard', last4: '8821', label: 'Vibra Business' },
  ];

  const handleMethodSelect = (id: string) => {
    setSelectedMethod(id);
  };

  const handleContinue = () => {
    if (!selectedMethod) return;
    
    if (selectedMethod === 'pix') {
    } else {
       router.push({
         pathname: '/events/[id]',
         params: { id: eventId as string, tab: 'TICKETS', purchase: 'confirm' }
       });
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView className={`z-50 flex-row items-center px-6 py-4 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
        <TouchableOpacity onPress={() => router.back()} className={`mr-4 p-2 rounded-full ${isDark ? 'bg-stone-900' : ''}`}>
          <ArrowLeft color={isDark ? '#FB8B3F' : '#954400'} size={24} />
        </TouchableOpacity>
        <Text className={`font-plus-bold text-lg ${isDark ? 'text-primary-container' : 'text-primary'}`}>Formas de Pagamento</Text>
      </SafeAreaView>

      <ScrollView className={`px-6 pt-4 ${isDark ? 'bg-stone-950' : 'bg-background'}`} showsVerticalScrollIndicator={false}>
        <View className="mb-10">
          <View className={`relative h-40 rounded-3xl overflow-hidden mb-6 ${isDark ? 'bg-stone-900' : 'bg-surface-container-low'}`}>
             <Image 
               source={{ uri: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=400" }} 
               className="w-full h-full opacity-20 grayscale"
               resizeMode="cover"
             />
             <View className="absolute inset-0 justify-end p-6">
                <Text className={`font-plus-bold text-[10px] uppercase tracking-widest mb-1 ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Gerenciamento</Text>
                <Text className={`text-3xl font-plus-ebold tracking-tighter ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>Suas Carteiras.</Text>
             </View>
          </View>
        </View>

        <View className="mb-10">
          <View className="flex-row items-baseline justify-between mb-6">
            <Text className={`text-xl font-plus-bold ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Cartões Salvos</Text>
            <View className={`${isDark ? 'bg-primary-container/20' : 'bg-primary-container/10'} px-3 py-1 rounded-full`}>
              <Text className={`text-[10px] font-plus-bold ${isDark ? 'text-primary-container' : 'text-primary'}`}>2 ATIVOS</Text>
            </View>
          </View>

          <View className="space-y-4">
            {savedCards.map((card) => (
              <TouchableOpacity 
                key={card.id}
                onPress={() => handleMethodSelect(card.id)}
                className={`relative rounded-2xl p-6 flex-row items-center justify-between border-2 ${isDark ? 'bg-stone-900' : 'bg-surface-container-lowest'} ${selectedMethod === card.id ? (isDark ? 'border-primary-container' : 'border-primary') : 'border-transparent shadow-sm'}`}
              >
                <View className="flex-row items-center">
                  <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isDark ? 'bg-stone-800' : 'bg-surface-container'}`}>
                    <CreditCard color={isDark ? '#FB8B3F' : '#954400'} size={24} />
                  </View>
                  <View>
                    <Text className={`font-plus-bold ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>{card.label}</Text>
                    <Text className={`text-sm font-plus-medium tracking-widest ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>•••• {card.last4}</Text>
                  </View>
                </View>
                {selectedMethod === card.id && <CheckCircle2 color={isDark ? '#1A0700' : '#954400'} size={24} fill={isDark ? '#FB8B3F' : '#fb8b3f'} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-12">
          <Text className={`text-xl font-plus-bold mb-6 ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Adicionar Novo</Text>
          <View className="space-y-3">
            <TouchableOpacity 
              onPress={() => router.push('/checkout/add-card')}
              className={`flex-row items-center justify-between p-5 rounded-2xl ${isDark ? 'bg-stone-900' : 'bg-surface-container-low'}`}
            >
              <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isDark ? 'bg-stone-800' : 'bg-surface-container-highest'}`}>
                  <CreditCard color={isDark ? '#FB8B3F' : '#954400'} size={20} />
                </View>
                <Text className={`font-plus-bold ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>Novo Cartão de Crédito</Text>
              </View>
              <ChevronRight color={isDark ? '#A8A29E' : '#7d522b'} size={20} />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleMethodSelect('pix')}
              className={`flex-row items-center justify-between p-5 rounded-2xl border-2 ${isDark ? 'bg-stone-900' : 'bg-surface-container-low'} ${selectedMethod === 'pix' ? (isDark ? 'border-primary-container' : 'border-primary') : 'border-transparent'}`}
            >
              <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isDark ? 'bg-stone-800' : 'bg-surface-container-highest'}`}>
                  <Landmark color={isDark ? '#FB8B3F' : '#954400'} size={20} />
                </View>
                <Text className={`font-plus-bold ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>Pix</Text>
              </View>
              {selectedMethod === 'pix' ? <CheckCircle2 color={isDark ? '#1A0700' : '#954400'} size={20} fill={isDark ? '#FB8B3F' : '#fb8b3f'} /> : <ChevronRight color={isDark ? '#A8A29E' : '#7d522b'} size={20} />}
            </TouchableOpacity>
          </View>
        </View>

        <View className={`items-center justify-center py-8 border-t mb-20 ${isDark ? 'border-stone-800' : 'border-outline-variant/10'}`}>
          <View className="flex-row items-center opacity-60 mb-2">
            <Lock size={12} color={isDark ? '#FB8B3F' : '#482603'} />
            <Text className={`text-[10px] font-plus-bold tracking-widest uppercase ml-2 ${isDark ? 'text-stone-400' : ''}`}>Ambiente Seguro e Criptografado</Text>
          </View>
          <Text className={`text-[10px] font-plus-medium ${isDark ? 'text-stone-500' : 'text-on-surface-variant'}`}>© 2024 Vibra Energia S.A.</Text>
        </View>
      </ScrollView>

      <View className={`absolute bottom-10 left-0 w-full px-6 ${isDark ? 'bg-transparent' : ''}`}>
        <TouchableOpacity 
          onPress={handleContinue}
          disabled={!selectedMethod}
          className={`py-5 rounded-2xl items-center justify-center shadow-lg ${selectedMethod ? (isDark ? 'bg-primary-container' : 'bg-primary') : (isDark ? 'bg-stone-800 opacity-50' : 'bg-surface-container-highest opacity-50')}`}
        >
          <Text className={`font-plus-ebold text-lg uppercase tracking-widest ${isDark ? 'text-stone-950' : 'text-white'}`}>Confirmar Método</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
