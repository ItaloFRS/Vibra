import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const verifyMutation = useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      await api.post('/auth/verify-email', data);
    },
    onSuccess: () => {
      Alert.alert('Sucesso', 'E-mail verificado com sucesso! Agora você pode fazer login.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Código inválido ou expirado.';
      Alert.alert('Erro', message);
    }
  });

  const handleVerify = () => {
    if (code.length < 6) {
      Alert.alert('Atenção', 'O código deve ter 6 dígitos.');
      return;
    }
    verifyMutation.mutate({ email: email!, code });
  };

  return (
    <LinearGradient colors={isDark ? ['#0C0A09', '#1C1917'] : ['#FFF4EF', '#FFEEE2']} style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView className="flex-1">
        <View style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: isDark ? 'rgba(251, 139, 63, 0.05)' : 'rgba(251, 139, 63, 0.1)' }} />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View className="px-6 py-2">
            <TouchableOpacity onPress={() => router.back()} className={`p-2 -ml-2 active:scale-95 rounded-full ${isDark ? 'bg-stone-900' : ''}`}>
              <ArrowLeft color={isDark ? '#FB8B3F' : '#954400'} size={24} />
            </TouchableOpacity>
          </View>

          <View className="px-8 pt-10 items-center">
            <View className={`w-20 h-20 rounded-3xl items-center justify-center mb-6 ${isDark ? 'bg-stone-900' : 'bg-white shadow-sm'}`}>
              <Mail color={isDark ? '#FB8B3F' : '#954400'} size={40} />
            </View>

            <Text className={`text-4xl font-plus-ebold tracking-tighter text-center leading-tight ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>
              Verifique seu e-mail
            </Text>
            <Text className={`font-plus text-base opacity-80 mt-4 text-center ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
              Enviamos um código de 6 dígitos para {email}.
            </Text>

            <View className="w-full mt-10">
              <TextInput 
                className={`w-full rounded-3xl px-6 py-5 font-plus-bold text-3xl text-center tracking-[10px] ${isDark ? 'bg-stone-900 text-stone-100 border border-stone-800' : 'bg-white text-on-surface shadow-sm'}`}
                placeholder="000000"
                placeholderTextColor={isDark ? "rgba(168, 162, 158, 0.2)" : "rgba(125, 82, 43, 0.2)"}
                keyboardType="numeric"
                maxLength={6}
                value={code}
                onChangeText={setCode}
              />

              <View className="flex-row justify-center mt-6">
                <Text className={`font-plus text-sm ${isDark ? 'text-stone-500' : 'text-on-surface-variant'}`}>
                  O código expira em: <Text className="font-plus-bold text-primary">{formatTime(timer)}</Text>
                </Text>
              </View>

              <TouchableOpacity 
                activeOpacity={0.9}
                className="rounded-full overflow-hidden shadow-xl mt-10"
                onPress={handleVerify}
                disabled={verifyMutation.isPending}
              >
                <LinearGradient 
                  colors={['#954400', '#FB8B3F']} 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 0 }} 
                  className="py-5 items-center justify-center"
                >
                  {verifyMutation.isPending ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <View className="flex-row items-center">
                      <Text className="text-white font-plus-ebold text-lg uppercase tracking-widest mr-2">
                        Verificar Código
                      </Text>
                      <CheckCircle2 color="white" size={20} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity className="mt-8 items-center">
                <Text className={`font-plus text-base ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
                  Não recebeu o código? <Text className="font-plus-bold text-primary">Reenviar</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
