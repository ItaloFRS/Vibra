import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, CreditCard, Calendar, ChevronRight, AlertCircle, CheckCircle2, Minus, Plus, Heart, HeartOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

WebBrowser.maybeCompleteAuthSession();

const VIBES = ['Eletrônica', 'Sertanejo', 'Pop', 'Rock', 'Funk', 'Hip Hop', 'Calmo', 'Agitado', 'VIP', 'Open Bar'];
const GENDERS = ['Masculino', 'Feminino', 'Não-binário', 'Outro'];

interface InputProps {
  label: string;
  error?: string;
  isDark: boolean;
  rightIcon?: React.ReactNode;
  [key: string]: any;
}

const InputWithValidation = ({ label, error, isDark, rightIcon, ...props }: InputProps) => {
  const hasValue = props.value && props.value.length > 0;
  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center px-5 mb-2">
        <Text className={`text-[11px] font-plus-bold uppercase opacity-70 ${isDark ? 'text-primary-container' : 'text-primary'}`}>{label}</Text>
        {error ? (
           <View className="flex-row items-center">
             <AlertCircle size={12} color="#ef4444" />
             <Text className="text-[10px] font-plus-bold text-red-500 ml-1">{error}</Text>
           </View>
        ) : hasValue && (
           <CheckCircle2 size={12} color="#22c55e" />
        )}
      </View>
      <View className="relative">
        <TextInput 
          className={`w-full rounded-full px-6 py-4 font-plus text-base border-2 ${
            error ? 'border-red-500 bg-red-50/10' : (hasValue ? 'border-green-500/30 bg-green-50/10' : (isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-high/40 border-transparent'))
          } ${isDark ? 'text-stone-100' : 'text-on-surface'}`}
          placeholderTextColor={isDark ? "rgba(168, 162, 158, 0.3)" : "rgba(125, 82, 43, 0.3)"}
          {...props}
        />
        {rightIcon && <View className="absolute right-6 top-4">{rightIcon}</View>}
      </View>
    </View>
  );
};

export default function RegisterScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    businessDocument: '',
    password: '',
    role: 'ROLE_USER',
    birthDate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    gender: '',
    vibes: [] as string[],
    wantsMatches: true,
    matchGender: 'Todos',
    matchAgeMin: 18,
    matchAgeMax: 40
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isStep1Valid, setIsStep1Valid] = useState(false);

  // Google Auth Setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "74360341775-8u5u8u8u8u8u.apps.googleusercontent.com",
    iosClientId: "74360341775-8u5u8u8u8u8u.apps.googleusercontent.com",
    expoClientId: "74360341775-8u5u8u8u8u8u.apps.googleusercontent.com",
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (idToken: string) => {
      const response = await api.post('/auth/google-login', { idToken });
      return response.data;
    },
    onSuccess: async (data) => {
      const { token, ...userData } = data;
      await signIn(token, userData);
      router.replace('/(tabs)');
    },
    onError: (error: any) => {
      Alert.alert('Erro Google', error.response?.data?.message || 'Falha ao autenticar.');
    }
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      googleLoginMutation.mutate(id_token!);
    }
  }, [response]);

  // Live Validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    if (form.fullName.length > 0 && form.fullName.length < 3) {
      newErrors.fullName = 'Nome muito curto';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email.length > 0 && !emailRegex.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    const rawCpf = form.businessDocument.replace(/\D/g, '');
    if (rawCpf.length > 0 && rawCpf.length < 11) {
      newErrors.businessDocument = 'CPF incompleto';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (form.password.length > 0 && !passwordRegex.test(form.password)) {
      newErrors.password = 'Senha fraca (8+ chars, A-z, 0-9, !@#)';
    }

    setErrors(newErrors);

    const isValid = 
      form.fullName.length >= 3 && 
      emailRegex.test(form.email) && 
      rawCpf.length === 11 && 
      passwordRegex.test(form.password);
    
    setIsStep1Valid(isValid);
  }, [form.fullName, form.email, form.businessDocument, form.password]);

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        businessDocument: data.businessDocument.replace(/\D/g, ''),
        role: data.role,
        preferences: {
          birthDate: data.birthDate.toISOString(),
          gender: data.gender,
          vibes: data.vibes,
          wantsMatches: data.wantsMatches,
          matchPreferences: data.wantsMatches ? {
            gender: data.matchGender,
            ageRange: { min: data.matchAgeMin, max: data.matchAgeMax }
          } : null
        }
      };
      const response = await api.post('/auth/register', payload);
      return response.data;
    },
    onSuccess: () => {
      Alert.alert('Sucesso', 'Verifique seu e-mail para ativar sua conta.', [
        { text: 'OK', onPress: () => router.push({ pathname: '/(auth)/verify-email', params: { email: form.email } }) }
      ]);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao criar conta. Verifique os dados.';
      Alert.alert('Erro', message);
    }
  });

  const formatCPF = (text: string) => {
    const numeric = text.replace(/\D/g, '');
    if (numeric.length <= 3) return numeric;
    if (numeric.length <= 6) return `${numeric.slice(0, 3)}.${numeric.slice(3)}`;
    if (numeric.length <= 9) return `${numeric.slice(0, 3)}.${numeric.slice(3, 6)}.${numeric.slice(6)}`;
    return `${numeric.slice(0, 3)}.${numeric.slice(3, 6)}.${numeric.slice(6, 9)}-${numeric.slice(9, 11)}`;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (isStep1Valid) {
        setStep(2);
      } else {
        Alert.alert('Atenção', 'Por favor, corrija os erros antes de prosseguir.');
      }
    } else if (step === 2) {
      if (!form.gender || form.vibes.length === 0) {
        Alert.alert('Atenção', 'Preencha suas vibes e gênero.');
        return;
      }
      if (form.wantsMatches && !form.matchGender) {
        Alert.alert('Atenção', 'Preencha suas preferências de match.');
        return;
      }
      registerMutation.mutate(form);
    }
  };

  const toggleVibe = (vibe: string) => {
    setForm(f => ({
      ...f,
      vibes: f.vibes.includes(vibe) 
        ? f.vibes.filter(v => v !== vibe) 
        : [...f.vibes, vibe]
    }));
  };

  const adjustAge = (field: 'min' | 'max', delta: number) => {
    setForm(f => {
      const newVal = field === 'min' ? f.matchAgeMin + delta : f.matchAgeMax + delta;
      if (newVal < 18 || newVal > 99) return f;
      if (field === 'min' && newVal >= f.matchAgeMax) return f;
      if (field === 'max' && newVal <= f.matchAgeMin) return f;
      return field === 'min' ? { ...f, matchAgeMin: newVal } : { ...f, matchAgeMax: newVal };
    });
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
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingBottom: 60 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-6 py-2 flex-row items-center justify-between">
              <TouchableOpacity onPress={() => step === 1 ? router.back() : setStep(1)} className={`p-2 -ml-2 active:scale-95 rounded-full ${isDark ? 'bg-stone-900' : ''}`}>
                <ArrowLeft color={isDark ? '#FB8B3F' : '#954400'} size={24} />
              </TouchableOpacity>
              <View className="flex-row gap-1">
                <View className={`w-8 h-1.5 rounded-full ${step === 1 ? 'bg-primary' : 'bg-stone-300'}`} />
                <View className={`w-8 h-1.5 rounded-full ${step === 2 ? 'bg-primary' : 'bg-stone-300'}`} />
              </View>
            </View>

            <View className="px-8 pt-2 items-center">
              <Text className={`text-4xl font-plus-ebold tracking-tighter text-center leading-tight ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>
                {step === 1 ? 'Crie sua conta' : 'Sua vibe conta'}
              </Text>
              <Text className={`font-plus text-base opacity-80 mt-2 text-center ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
                {step === 1 ? 'Faça parte do ritmo de cada experiência.' : 'Conte-nos um pouco sobre você.'}
              </Text>

              {step === 1 ? (
                <View className="w-full mt-6">
                   <TouchableOpacity 
                      onPress={() => promptAsync()}
                      className={`flex-row items-center justify-center py-4 rounded-full shadow-sm border active:scale-95 mb-6 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-outline-variant/10'}`}>
                      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} className="w-5 h-5 mr-2" />
                      <Text className={`font-plus-bold ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>Continuar com Google</Text>
                    </TouchableOpacity>

                  <InputWithValidation
                    label="Nome Completo"
                    placeholder="Como podemos te chamar?"
                    value={form.fullName}
                    onChangeText={(val: string) => setForm(f => ({ ...f, fullName: val }))}
                    error={errors.fullName}
                    isDark={isDark}
                  />

                  <InputWithValidation
                    label="E-mail"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChangeText={(val: string) => setForm(f => ({ ...f, email: val }))}
                    error={errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    isDark={isDark}
                  />

                  <InputWithValidation
                    label="CPF"
                    placeholder="000.000.000-00"
                    value={form.businessDocument}
                    onChangeText={(val: string) => setForm(f => ({ ...f, businessDocument: formatCPF(val) }))}
                    error={errors.businessDocument}
                    keyboardType="numeric"
                    maxLength={14}
                    isDark={isDark}
                  />

                  <InputWithValidation
                    label="Senha"
                    placeholder="Mínimo 8 caracteres"
                    value={form.password}
                    onChangeText={(val: string) => setForm(f => ({ ...f, password: val }))}
                    error={errors.password}
                    secureTextEntry={!showPassword}
                    isDark={isDark}
                    rightIcon={
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} color={isDark ? '#FB8B3F' : '#7d522b'} /> : <Eye size={20} color={isDark ? '#FB8B3F' : '#7d522b'} />}
                      </TouchableOpacity>
                    }
                  />
                </View>
              ) : (
                <View className="w-full mt-6 space-y-6">
                  <View>
                    <Text className={`text-[11px] font-plus-bold uppercase px-5 mb-2 opacity-70 ${isDark ? 'text-primary-container' : 'text-primary'}`}>Data de Nascimento</Text>
                    <TouchableOpacity 
                      onPress={() => setShowDatePicker(true)}
                      className={`w-full rounded-full px-6 py-4 flex-row items-center border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-high/40 border-transparent'}`}
                    >
                      <Calendar size={20} color={isDark ? '#FB8B3F' : '#7d522b'} className="mr-3" />
                      <Text className={`font-plus text-base ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>
                        {form.birthDate.toLocaleDateString('pt-BR')}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={form.birthDate}
                        mode="date"
                        display="default"
                        maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 13))}
                        onChange={(event, date) => {
                          setShowDatePicker(false);
                          if (date) setForm(f => ({ ...f, birthDate: date }));
                        }}
                      />
                    )}
                  </View>

                  <View>
                    <Text className={`text-[11px] font-plus-bold uppercase px-5 mb-2 opacity-70 ${isDark ? 'text-primary-container' : 'text-primary'}`}>Gênero</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {GENDERS.map(g => (
                        <TouchableOpacity 
                          key={g}
                          onPress={() => setForm(f => ({ ...f, gender: g }))}
                          className={`px-4 py-2 rounded-full border ${form.gender === g ? 'bg-primary border-primary' : (isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-lowest border-outline-variant/15')}`}
                        >
                          <Text className={`font-plus-bold text-xs ${form.gender === g ? 'text-white' : (isDark ? 'text-stone-400' : 'text-stone-600')}`}>{g}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View>
                    <Text className={`text-[11px] font-plus-bold uppercase px-5 mb-2 opacity-70 ${isDark ? 'text-primary-container' : 'text-primary'}`}>Suas Vibes</Text>
                    <View className="flex-row flex-wrap gap-3">
                      {VIBES.map(v => (
                        <TouchableOpacity 
                          key={v}
                          onPress={() => toggleVibe(v)}
                          className={`px-4 py-2 rounded-full border ${form.vibes.includes(v) ? 'bg-secondary border-secondary' : (isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-lowest border-outline-variant/15')}`}
                        >
                          <Text className={`font-plus-bold text-xs ${form.vibes.includes(v) ? 'text-white' : (isDark ? 'text-stone-400' : 'text-stone-600')}`}>{v}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View className={`p-6 rounded-[32px] border ${isDark ? 'bg-stone-900/50 border-stone-800' : 'bg-white shadow-sm border-stone-100'}`}>
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            {form.wantsMatches ? <Heart size={20} color="#FB8B3F" /> : <HeartOff size={20} color="#A8A29E" />}
                            <Text className={`text-sm font-plus-bold ml-2 ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Vibra Match</Text>
                        </View>
                        <Switch 
                            value={form.wantsMatches} 
                            onValueChange={(val) => setForm(f => ({ ...f, wantsMatches: val }))}
                            trackColor={{ false: '#767577', true: '#FB8B3F' }}
                            thumbColor={form.wantsMatches ? '#fff' : '#f4f3f4'}
                        />
                    </View>
                    
                    {!form.wantsMatches ? (
                        <Text className={`text-xs font-plus opacity-60 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                            Você pode ativar as sugestões de match e chat social a qualquer momento no seu perfil.
                        </Text>
                    ) : (
                        <View>
                            <Text className={`text-[10px] font-plus-bold uppercase mb-2 opacity-60 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Quem você quer conhecer?</Text>
                            <View className="flex-row flex-wrap gap-2 mb-6">
                            {['Masculino', 'Feminino', 'Todos'].map(g => (
                                <TouchableOpacity 
                                key={g}
                                onPress={() => setForm(f => ({ ...f, matchGender: g }))}
                                className={`px-4 py-2 rounded-full border ${form.matchGender === g ? 'bg-primary border-primary' : (isDark ? 'bg-stone-800 border-stone-700' : 'bg-transparent border-stone-300')}`}
                                >
                                <Text className={`font-plus-bold text-xs ${form.matchGender === g ? 'text-white' : (isDark ? 'text-stone-400' : 'text-stone-600')}`}>{g}</Text>
                                </TouchableOpacity>
                            ))}
                            </View>

                            <View className="flex-row items-center justify-between mb-4">
                            <Text className={`text-[10px] font-plus-bold uppercase opacity-60 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Faixa Etária</Text>
                            <Text className={`font-plus-bold text-primary text-xs`}>{form.matchAgeMin} - {form.matchAgeMax} anos</Text>
                            </View>
                            
                            <View className="flex-row items-center justify-between gap-4">
                                <View className="flex-1 items-center">
                                    <Text className={`text-[10px] font-plus-bold mb-1 opacity-50 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>MÍN</Text>
                                    <View className="flex-row items-center bg-stone-100 dark:bg-stone-800 rounded-full px-2 py-1">
                                        <TouchableOpacity onPress={() => adjustAge('min', -1)} className="p-1"><Minus size={16} color="#FB8B3F" /></TouchableOpacity>
                                        <Text className="mx-2 font-plus-bold dark:text-white">{form.matchAgeMin}</Text>
                                        <TouchableOpacity onPress={() => adjustAge('min', 1)} className="p-1"><Plus size={16} color="#FB8B3F" /></TouchableOpacity>
                                    </View>
                                </View>
                                <View className="flex-1 items-center">
                                    <Text className={`text-[10px] font-plus-bold mb-1 opacity-50 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>MÁX</Text>
                                    <View className="flex-row items-center bg-stone-100 dark:bg-stone-800 rounded-full px-2 py-1">
                                        <TouchableOpacity onPress={() => adjustAge('max', -1)} className="p-1"><Minus size={16} color="#FB8B3F" /></TouchableOpacity>
                                        <Text className="mx-2 font-plus-bold dark:text-white">{form.matchAgeMax}</Text>
                                        <TouchableOpacity onPress={() => adjustAge('max', 1)} className="p-1"><Plus size={16} color="#FB8B3F" /></TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                  </View>
                </View>
              )}

              <View className="w-full mt-10">
                <TouchableOpacity 
                  activeOpacity={0.9}
                  className={`rounded-full overflow-hidden shadow-xl ${(!isStep1Valid && step === 1) ? 'opacity-50' : ''}`}
                  onPress={handleNextStep}
                  disabled={registerMutation.isPending || (step === 1 && !isStep1Valid)}
                >
                  <LinearGradient 
                    colors={['#954400', '#FB8B3F']} 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 1, y: 0 }} 
                    className="py-5 items-center justify-center"
                  >
                    {registerMutation.isPending ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <View className="flex-row items-center">
                        <Text className="text-white font-plus-ebold text-lg uppercase tracking-widest mr-2">
                          {step === 1 ? 'Continuar' : 'Finalizar Cadastro'}
                        </Text>
                        <ChevronRight color="white" size={20} />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                className="mt-8 mb-10" 
                onPress={() => router.push('/(auth)/login')}
              >
                <Text className={`font-plus text-base ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
                  Já tem uma conta? <Text className={`font-plus-bold ${isDark ? 'text-primary' : 'text-primary'}`}>Entrar</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
