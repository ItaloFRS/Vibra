import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  Dimensions,
  Image,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </Svg>
);

const AppleIcon = (isDark: boolean) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill={isDark ? "black" : "white"}>
    <Path d="M17.05 20.28c-.96.95-2.04 1.72-3.3 1.72-1.2 0-1.6-.74-3.1-.74-1.46 0-1.95.72-3.14.72-1.18 0-2.28-.78-3.35-1.9-2.3-2.34-3.5-6.17-3.5-8.5 0-3.66 2.4-5.63 4.7-5.63 1.22 0 2.22.65 3.08.65.82 0 1.95-.7 3.3-.7 1.44 0 3.9.52 5.37 2.58-3.08 1.6-2.58 5.75.54 7.22-.67 1.74-1.6 3.6-2.6 4.58zM12.03 5.07c-.12-2.3 1.93-4.32 4.1-4.47.26 2.44-2.15 4.55-4.1 4.47z" />
  </Svg>
);

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      await signIn(token, userData);
    } catch (error: any) {
      Alert.alert('Erro no Login', error.response?.data?.message || 'E-mail ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={isDark ? ['#0C0A09', '#1C1917'] : ['#FFF4EF', '#FFEEE2']} style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: isDark ? 'rgba(251, 139, 63, 0.05)' : 'rgba(251, 139, 63, 0.1)' }} />
        <View style={{ position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: isDark ? 'rgba(100, 78, 157, 0.05)' : 'rgba(100, 78, 157, 0.1)' }} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
          <View className="items-center mb-12">
            <Image source={isDark ? require('../../../assets/Logo_Vibra.png') : require('../../../assets/Logo_VibraPl.png')} className="w-40 h-32" resizeMode="contain" />
            <Text className={`font-plus text-base opacity-80 text-center ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Sinta o ritmo de cada experiência.</Text>
          </View>

          <View className="w-full space-y-3 mb-10">
            <TouchableOpacity className={`w-full flex-row items-center justify-center py-4 rounded-full shadow-sm border active:scale-95 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-outline-variant/10'}`} activeOpacity={0.8}>
              <GoogleIcon /><Text className={`font-plus-bold ml-3 ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>Continuar com Google</Text>
            </TouchableOpacity>
            <TouchableOpacity className={`w-full flex-row items-center justify-center py-4 rounded-full shadow-lg active:scale-95 ${isDark ? 'bg-stone-100' : 'bg-stone-900'}`} activeOpacity={0.8}>
              {AppleIcon(isDark)}<Text className={`font-plus-bold ml-3 ${isDark ? 'text-stone-950' : 'text-white'}`}>Continuar com Apple</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-10 px-4">
            <View className={`flex-1 h-[1px] ${isDark ? 'bg-stone-800' : 'bg-outline-variant/20'}`} />
            <Text className={`mx-4 text-[10px] font-plus-bold uppercase tracking-widest ${isDark ? 'text-stone-500' : 'text-on-surface-variant/60'}`}>Ou com e-mail</Text>
            <View className={`flex-1 h-[1px] ${isDark ? 'bg-stone-800' : 'bg-outline-variant/20'}`} />
          </View>

          <View className="space-y-6">
            <View>
              <Text className={`text-[11px] font-plus-bold uppercase px-5 mb-2 opacity-70 ${isDark ? 'text-primary-container' : 'text-primary'}`}>E-mail</Text>
              <View className="relative">
                <View className="absolute left-6 top-4 z-10"><Mail size={20} color={isDark ? '#FB8B3F' : '#7d522b'} opacity={0.5} /></View>
                <TextInput 
                  value={email} 
                  onChangeText={setEmail} 
                  className={`w-full rounded-full pl-14 pr-6 py-4 font-plus text-base ${isDark ? 'bg-stone-900 text-stone-100' : 'bg-surface-container-high/40 text-on-surface'}`} 
                  placeholder="seu@email.com" 
                  placeholderTextColor={isDark ? "rgba(168, 162, 158, 0.3)" : "rgba(125, 82, 43, 0.3)"} 
                  keyboardType="email-address" 
                  autoCapitalize="none" 
                />
              </View>
            </View>

            <View>
              <Text className={`text-[11px] font-plus-bold uppercase px-5 mb-2 opacity-70 ${isDark ? 'text-primary-container' : 'text-primary'}`}>Senha</Text>
              <View className="relative">
                <View className="absolute left-6 top-4 z-10"><Lock size={20} color={isDark ? '#FB8B3F' : '#7d522b'} opacity={0.5} /></View>
                <TextInput 
                  value={password} 
                  onChangeText={setPassword} 
                  className={`w-full rounded-full pl-14 pr-16 py-4 font-plus text-base ${isDark ? 'bg-stone-900 text-stone-100' : 'bg-surface-container-high/40 text-on-surface'}`} 
                  placeholder="••••••••" 
                  placeholderTextColor={isDark ? "rgba(168, 162, 158, 0.3)" : "rgba(125, 82, 43, 0.3)"} 
                  secureTextEntry={!showPassword} 
                />
                <TouchableOpacity 
                  className="absolute right-6 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} color={isDark ? '#FB8B3F' : '#7d522b'} /> : <Eye size={20} color={isDark ? '#FB8B3F' : '#7d522b'} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={handleLogin} disabled={isLoading} activeOpacity={0.9} className="mt-4">
              <LinearGradient 
                colors={['#954400', '#FB8B3F']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }} 
                className="w-full py-5 rounded-full items-center justify-center flex-row shadow-xl"
              >
                {isLoading ? <ActivityIndicator size={20} color="#FFF" /> : <Text className="text-white font-plus-ebold text-lg uppercase tracking-widest">Entrar na Vibra</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View className="mt-12 items-center">
            <View className="flex-row justify-center">
              <Text className={`font-plus ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Não tem uma conta?</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text className={`font-plus-bold ml-1 ${isDark ? 'text-primary-container' : 'text-primary'}`}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="mt-8">
              <Text className={`text-[11px] font-plus-bold uppercase tracking-widest ${isDark ? 'text-stone-500' : 'text-on-surface-variant/40'}`}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
