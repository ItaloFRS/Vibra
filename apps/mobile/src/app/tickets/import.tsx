import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, StatusBar as RNStatusBar } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Upload, FileText, CheckCircle2, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

import * as SecureStore from 'expo-secure-store';

export default function TicketImportScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleImport = async () => {
    if (!image) {
      Alert.alert('Erro', 'Por favor, selecione uma imagem do seu ingresso.');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;

      // @ts-ignore
      formData.append('file', { uri: image, name: filename, type });

      const response = await api.post('/tickets/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.qrCodes && response.data.qrCodes.length > 0) {
        const qrData = response.data.qrCodes[0]; 

        const newTicket = {
          id: Date.now().toString(),
          eventTitle: response.data.eventTitle,
          eventDate: response.data.eventDate,
          location: response.data.location,
          type: response.data.type,
          qrCodeBase64: qrData.image, 
          originalImageUri: image, 
          status: 'IMPORTED'
        };

        const stored = await SecureStore.getItemAsync('user_tickets');
        const tickets = stored ? JSON.parse(stored) : [];
        tickets.push(newTicket);
        await SecureStore.setItemAsync('user_tickets', JSON.stringify(tickets));

        setImportedData(newTicket);
        setIsSuccess(true);
      } else {
        Alert.alert('Nenhum QR Code', 'Não conseguimos detectar um QR Code nesta imagem/PDF.');
      }
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Erro', 'Não foi possível processar seu ingresso. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <View className={`flex-1 items-center justify-center px-10 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <CheckCircle2 size={100} color={isDark ? '#FB8B3F' : '#954400'} strokeWidth={1.5} />
        <Text className={`text-3xl font-plus-ebold text-center mt-8 mb-4 ${isDark ? 'text-primary-container' : 'text-primary'}`}>Ingresso Importado!</Text>
        <Text className={`${isDark ? 'text-stone-400' : 'text-stone-500'} font-plus-medium text-center leading-relaxed mb-12`}>
          Seu ingresso para o evento <Text className={`font-plus-bold ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>{importedData?.eventTitle || 'selecionado'}</Text> foi processado e já está disponível na sua carteira.
        </Text>
        <TouchableOpacity 
          className="bg-primary-container w-full py-5 rounded-full items-center shadow-lg"
          onPress={() => router.replace('/(tabs)/tickets')}
        >
          <Text className="text-on-primary-fixed font-plus-ebold text-lg uppercase tracking-widest">Ir para Carteira</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView className={`${isDark ? 'bg-stone-950' : 'bg-background'} flex-row items-center px-6 py-4 border-b border-outline-variant/10`}>
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft color={isDark ? '#FB8B3F' : '#954400'} size={24} />
        </TouchableOpacity>
        <Text className={`font-plus-bold text-xl ${isDark ? 'text-primary-container' : 'text-primary'}`}>Importar Ingresso</Text>
      </SafeAreaView>

      <ScrollView className={`flex-1 px-6 pt-8 ${isDark ? 'bg-stone-950' : 'bg-background'}`} showsVerticalScrollIndicator={false}>
        <Text className={`text-[10px] font-plus-bold uppercase tracking-widest mb-2 ${isDark ? 'text-primary-container' : 'text-primary'}`}>Passo Único</Text>
        <Text className={`text-3xl font-plus-ebold mb-4 ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>Anexe seu comprovante</Text>
        <Text className={`${isDark ? 'text-stone-400' : 'text-stone-500'} font-plus-medium leading-relaxed mb-10`}>
          Tire um print do QR Code ou anexe o PDF enviado pela ticketeira. Nosso sistema irá processar os dados automaticamente.
        </Text>

        {!image ? (
          <TouchableOpacity 
            onPress={pickImage}
            className={`w-full aspect-[4/3] border-2 border-dashed rounded-[2.5rem] items-center justify-center space-y-4 ${isDark ? 'bg-stone-900 border-stone-700' : 'bg-stone-100 border-stone-300'}`}
          >
            <View className={`w-16 h-16 rounded-full items-center justify-center shadow-sm ${isDark ? 'bg-stone-800' : 'bg-white'}`}>
              <Upload color={isDark ? '#FB8B3F' : '#954400'} size={28} />
            </View>
            <Text className={`font-plus-bold ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>Toque para selecionar</Text>
            <Text className={`text-[10px] font-plus-medium ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>JPG, PNG ou PDF (máx. 10MB)</Text>
          </TouchableOpacity>
        ) : (
          <View className={`relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden border shadow-md ${isDark ? 'border-stone-800' : 'border-outline-variant/20'}`}>
            <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
            <TouchableOpacity 
              onPress={() => setImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/60 rounded-full items-center justify-center"
            >
              <X color="white" size={20} />
            </TouchableOpacity>
            <View className="absolute bottom-0 left-0 right-0 bg-black/60 py-3 items-center">
              <Text className="text-white font-plus-bold text-xs">Ingresso selecionado</Text>
            </View>
          </View>
        )}

        <View className={`mt-12 p-6 rounded-3xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-900/5 border-stone-200'}`}>
          <View className="flex-row items-center gap-3 mb-2">
            <FileText color={isDark ? '#FB8B3F' : '#954400'} size={18} />
            <Text className={`font-plus-bold text-xs uppercase tracking-widest ${isDark ? 'text-primary-container' : 'text-primary'}`}>Informações</Text>
          </View>
          <Text className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            Ao importar, você confirma que o ingresso é autêntico e pertence a você. O Vibra não se responsabiliza pela validade de ingressos externos na portaria.
          </Text>
        </View>

        <View className="h-20" />
      </ScrollView>

      <View className={`p-6 pb-10 border-t ${isDark ? 'bg-stone-950 border-stone-800' : 'bg-background border-outline-variant/10'}`}>
        <TouchableOpacity 
          disabled={!image || isUploading}
          onPress={handleImport}
          className={`w-full py-5 rounded-full items-center justify-center ${(!image || isUploading) ? (isDark ? 'bg-stone-800 opacity-60' : 'bg-stone-200 opacity-60') : 'bg-primary-container shadow-lg'}`}
        >
          {isUploading ? (
            <ActivityIndicator color="#1A0700" />
          ) : (
            <Text className="text-on-primary-fixed font-plus-ebold text-lg uppercase tracking-widest">Concluir Importação</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
