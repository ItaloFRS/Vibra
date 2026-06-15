import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, Camera, MapPin, Ticket, Edit2, ChevronRight, CreditCard, Shield, Bell, Lock, Check, X, Plus, Minus, Sun, Moon, Monitor, Sparkles, RefreshCw } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as SecureStore from 'expo-secure-store';
import { useQuery } from '@tanstack/react-query';
import { mediaService } from '../../services/media';
import { profileService } from '../../services/profile';
import { socialService } from '../../services/social';

const blurhash = '|rF?hV%2WCj[ayWDWvUCfP8{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay;9fQp{B#Rjsk_S+uV@j[ay';

const AVAILABLE_INTERESTS = [
  'Techno', 'Rock Indie', 'VIP Lounge', 'Festivais', 'Lollapalooza', 
  'Sertanejo', 'Pop', 'Eletrônico', 'Forró', 'São João', 
  'Xand Avião', 'Mari Fernandez', 'Nattanzinho'
];

import { UserAvatar } from '../../components/common/UserAvatar';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, updateUser } = useAuth();
  const { theme, setTheme, colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [customInterest, setCustomInterest] = useState('');
  
  const { data: matchCount = 0 } = useQuery({
    queryKey: ['matchCount'],
    queryFn: socialService.getMatchCount,
    enabled: !!user,
  });
  
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: '',
    vibes: [] as string[],
    gender: '',
    age: 18
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName || '',
        bio: user.bio || '',
        vibes: user.preferences?.vibes || [],
        gender: user.preferences?.gender || '',
        age: user.preferences?.age || 18
      });
    }
  }, [user, isEditing]);

  const handlePickImage = async () => {
    try {
      const asset = await mediaService.pickImage();
      if (!asset) return;

      setIsUploading(true);
      const uploadResult = await mediaService.uploadImage(asset.uri);
      
      const response = await profileService.updateProfile({ profilePhotoUrl: uploadResult.url });
      await updateUser(response);
      
      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Erro', 'Não foi possível atualizar sua foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const updatedPreferences = { 
        ...user?.preferences, 
        vibes: editForm.vibes,
        gender: editForm.gender,
        age: editForm.age // Garante que a idade do form seja salva
      };
      
      const updatedData = {
        fullName: editForm.fullName,
        bio: editForm.bio,
        preferences: updatedPreferences
      };

      const response = await profileService.updateProfile(updatedData);
      await updateUser(response || { ...updatedData, id: user?.id });

      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateMatchPreference = async (key: string, value: any) => {
      if (!user) return;
      
      try {
          setIsSaving(true);
          const currentPreferences = user.preferences || {};
          const updatedPreferences = {
              ...currentPreferences,
              age: currentPreferences.age || 18, // Garante que a idade atual não seja perdida
              [key]: value
          };
          
          const response = await profileService.updateProfile({ preferences: updatedPreferences });
          
          await updateUser(response || { preferences: updatedPreferences });
          
      } catch (error) {
          console.error('Error updating match preference:', error);
          Alert.alert('Erro', 'Não foi possível atualizar sua preferência.');
      } finally {
          setIsSaving(false);
      }
  };

  const toggleVibe = (vibe: string) => {
    setEditForm(prev => {
      const vibes = prev.vibes.includes(vibe)
        ? prev.vibes.filter(v => v !== vibe)
        : [...prev.vibes, vibe];
      return { ...prev, vibes };
    });
  };

  const addCustomVibe = () => {
    const vibe = customInterest.trim();
    if (!vibe) return;
    
    if (!editForm.vibes.includes(vibe)) {
      setEditForm(prev => ({
        ...prev,
        vibes: [...prev.vibes, vibe]
      }));
    }
    setCustomInterest('');
  };

  const allVibesToDisplay = Array.from(new Set([...AVAILABLE_INTERESTS, ...editForm.vibes]));
  const userCurrentVibes = (user?.preferences?.vibes as string[]) || [];

  return (
    <ScrollView 
      className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'}`} 
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className={`px-6 pt-16 pb-4 flex-row justify-between items-center ${isDark ? 'bg-stone-900' : 'bg-surface-container-low'}`}>
        {isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(false)} className="p-2 rounded-full">
            <X size={24} color={isDark ? '#FB8B3F' : '#954400'} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
        
        <Text className={`text-xl font-plus-bold ${isDark ? 'text-primary-container' : 'text-primary'}`}>Perfil</Text>
        
        {isEditing ? (
          <TouchableOpacity 
            onPress={handleSaveProfile}
            disabled={isSaving}
            className="p-2 rounded-full bg-primary-container"
          >
            {isSaving ? <ActivityIndicator size="small" color="#1A0700" /> : <Check size={24} color="#1A0700" />}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)} className="p-2 rounded-full">
            <Edit2 size={24} color={isDark ? '#FB8B3F' : '#954400'} />
          </TouchableOpacity>
        )}
      </View>

      <View className="px-6 pt-8">
        <View className="items-center mb-10">
          <TouchableOpacity 
            onPress={handlePickImage}
            disabled={isUploading}
            className="relative mb-6"
          >
            <UserAvatar 
              uri={user?.profilePhotoUrl} 
              size={160} 
              borderWidth={4} 
              borderColor={isDark ? '#0C0A09' : '#FFF4EF'} 
              style={{ padding: 1 }}
            />
            <View className="absolute bottom-1 right-1 bg-primary-container p-2 rounded-full shadow-lg">
              {isUploading ? (
                <ActivityIndicator size="small" color="#1A0700" />
              ) : (
                <Camera size={20} color="#1A0700" />
              )}
            </View>
          </TouchableOpacity>

          {isEditing ? (
            <View className="w-full items-center">
              <TextInput
                value={editForm.fullName}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, fullName: text }))}
                placeholder="Seu nome completo"
                placeholderTextColor={isDark ? '#A8A29E' : '#7D522B'}
                className={`text-2xl font-plus-bold ${isDark ? 'text-stone-200' : 'text-on-surface'} mb-2 text-center w-full border-b ${isDark ? 'border-stone-800' : 'border-outline-variant'} pb-1`}
              />
              <TextInput
                value={editForm.bio}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, bio: text }))}
                placeholder="Sua bio"
                placeholderTextColor={isDark ? '#A8A29E' : '#7D522B'}
                multiline
                className={`text-lg ${isDark ? 'text-stone-300/80' : 'text-on-surface/80'} text-center w-full italic font-plus border-b ${isDark ? 'border-stone-800' : 'border-outline-variant'} pb-1`}
              />
            </View>
          ) : (
            <View className="items-center">
              <Text className={`text-4xl font-plus-ebold ${isDark ? 'text-stone-50' : 'text-on-surface'} mb-1 text-center`}>
                {user?.fullName || 'Usuário Vibra'}
              </Text>
              <View className="flex-row items-center mb-4">
                <MapPin size={18} color={isDark ? '#A8A29E' : '#7D522B'} />
                <Text className={`${isDark ? 'text-stone-400' : 'text-on-surface-variant'} font-plus-medium ml-1`}>Campina Grande, PB</Text>
              </View>
              <Text className={`text-lg ${isDark ? 'text-stone-300/80' : 'text-on-surface/80'} max-w-sm text-center italic font-plus`}>
                {user?.bio || '“Vivendo cada show como se fosse o único! 🎸”'}
              </Text>
            </View>
          )}
        </View>

        {!isEditing && (
          <View className="flex-row gap-4 mb-12">
            <TouchableOpacity className="flex-1 bg-primary-container flex-row items-center justify-center py-4 rounded-full shadow-md">
              <Ticket size={20} color="#1A0700" />
              <Text className="text-on-primary-fixed font-plus-bold ml-2 text-stone-950">Meus Ingressos</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isEditing && (
          <View className={`${isDark ? 'bg-stone-900 border-stone-800/50' : 'bg-surface-container-low border-outline-variant/5'} rounded-2xl p-8 mb-12 flex-row justify-around items-center border`}>
            <View className="items-center">
              <Text className={`text-3xl font-plus-ebold ${isDark ? 'text-primary-container' : 'text-primary'}`}>0</Text>
              <Text className={`text-[10px] uppercase font-plus-bold opacity-60 ${isDark ? 'text-stone-400' : 'text-on-surface'}`}>Eventos</Text>
            </View>
            <View className={`w-[1px] h-8 ${isDark ? 'bg-stone-800' : 'bg-outline-variant/20'}`} />
            <View className="items-center">
              <Text className={`text-3xl font-plus-ebold ${isDark ? 'text-primary-container' : 'text-primary'}`}>{matchCount}</Text>
              <Text className={`text-[10px] uppercase font-plus-bold opacity-60 ${isDark ? 'text-stone-400' : 'text-on-surface'}`}>Matches</Text>
            </View>
            <View className={`w-[1px] h-8 ${isDark ? 'bg-stone-800' : 'bg-outline-variant/20'}`} />
            <View className="items-center">
              <Text className={`text-3xl font-plus-ebold ${isDark ? 'text-primary-container' : 'text-primary'}`}>{matchCount}</Text>
              <Text className={`text-[10px] uppercase font-plus-bold opacity-60 ${isDark ? 'text-stone-400' : 'text-on-surface'}`}>Conexões</Text>
            </View>
          </View>
        )}

        <View className="mb-12">
          <View className="flex-row items-center mb-6">
            <Text className={`text-xl font-plus-ebold mr-2 ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Minha Vibe</Text>
            <View className="h-1 w-12 bg-primary-container rounded-full" />
          </View>

          {isEditing && (
            <View className={`flex-row items-center mb-4 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-lowest border-outline-variant/10'} border rounded-full px-4 py-2`}>
              <TextInput
                value={customInterest}
                onChangeText={setCustomInterest}
                placeholder="Adicione uma vibe personalizada..."
                placeholderTextColor={isDark ? '#A8A29E' : '#7D522B'}
                className={`flex-1 font-plus ${isDark ? 'text-stone-200' : 'text-on-surface'} mr-2`}
                onSubmitEditing={addCustomVibe}
              />
              <TouchableOpacity onPress={addCustomVibe} className={`p-1 rounded-full ${isDark ? 'bg-primary-container' : 'bg-primary'}`}>
                <Plus size={20} color={isDark ? '#1A0700' : '#FFFFFF'} />
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-row flex-wrap gap-3">
            {isEditing ? (
              allVibesToDisplay.map(vibe => (
                <TouchableOpacity
                  key={vibe}
                  onPress={() => toggleVibe(vibe)}
                  className={`px-6 py-2 rounded-full border ${
                    editForm.vibes.includes(vibe)
                      ? (isDark ? 'bg-primary-container border-primary-container' : 'bg-primary border-primary')
                      : (isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-lowest border-outline-variant/15')
                  }`}
                >
                  <Text className={`text-sm font-plus-bold ${
                    editForm.vibes.includes(vibe) 
                      ? (isDark ? 'text-stone-950' : 'text-white')
                      : (isDark ? 'text-stone-300' : 'text-on-surface')
                  }`}>
                    {vibe}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              userCurrentVibes.length > 0 ? (
                userCurrentVibes.map(vibe => (
                  <View key={vibe} className={`px-6 py-2 rounded-full shadow-sm ${isDark ? 'bg-primary-container' : 'bg-primary'}`}>
                    <Text className={`text-sm font-plus-bold ${isDark ? 'text-stone-950' : 'text-white'}`}>{vibe}</Text>
                  </View>
                ))
              ) : (
                <Text className={`italic font-plus ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Adicione suas vibes na edição de perfil.</Text>
              )
            )}
          </View>
        </View>

        {!isEditing && (
            <View className="mb-12">
                <View className="flex-row items-center justify-between mb-6">
                    <View className="flex-row items-center">
                        <Text className={`text-xl font-plus-ebold mr-2 ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Vibra Match</Text>
                        <View className="h-1 w-12 bg-primary-container rounded-full" />
                    </View>
                    <Switch 
                        value={user?.preferences?.wantsMatches !== false} 
                        onValueChange={(val) => handleUpdateMatchPreference('wantsMatches', val)}
                        trackColor={{ false: '#767577', true: '#FB8B3F' }}
                        thumbColor={user?.preferences?.wantsMatches !== false ? '#fff' : '#f4f3f4'}
                    />
                </View>

                {user?.preferences?.wantsMatches !== false && (
                    <View className={`p-6 rounded-[32px] ${isDark ? 'bg-stone-900/50' : 'bg-white shadow-sm border border-outline-variant/5'}`}>
                        <View className="flex-row items-center justify-between mb-6">
                            <View>
                                <Text className={`font-plus-bold ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Navegação por Gestos</Text>
                                <Text className={`text-[10px] font-plus text-stone-500`}>Usar giroscópio para LIKE/NOPE</Text>
                            </View>
                            <Switch 
                                value={user?.preferences?.enableTiltMatches !== false} 
                                onValueChange={(val) => handleUpdateMatchPreference('enableTiltMatches', val)}
                                trackColor={{ false: '#767577', true: '#FB8B3F' }}
                                thumbColor={user?.preferences?.enableTiltMatches !== false ? '#fff' : '#f4f3f4'}
                            />
                        </View>

                        <Text className={`text-[10px] font-plus-bold uppercase mb-2 opacity-60 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Quem você quer conhecer?</Text>
                        <View className="flex-row flex-wrap gap-2 mb-6">
                            {['Masculino', 'Feminino', 'Todos'].map(g => (
                                <TouchableOpacity 
                                    key={g}
                                    onPress={() => handleUpdateMatchPreference('matchGender', g)}
                                    className={`px-4 py-2 rounded-full border ${user?.preferences?.matchGender === g ? 'bg-primary border-primary' : (isDark ? 'bg-stone-800 border-stone-700' : 'bg-transparent border-stone-300')}`}
                                >
                                    <Text className={`font-plus-bold text-xs ${user?.preferences?.matchGender === g ? 'text-white' : (isDark ? 'text-stone-400' : 'text-stone-600')}`}>{g}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="flex-row items-center justify-between mb-4">
                            <Text className={`text-[10px] font-plus-bold uppercase opacity-60 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Faixa Etária</Text>
                            <Text className={`font-plus-bold text-primary text-xs`}>{user?.preferences?.matchAgeMin || 18} - {user?.preferences?.matchAgeMax || 50} anos</Text>
                        </View>
                        
                        <View className="flex-row items-center justify-between gap-4">
                            <View className="flex-1 items-center">
                                <Text className={`text-[10px] font-plus-bold mb-1 opacity-50 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>MÍN</Text>
                                <View className="flex-row items-center bg-stone-100 dark:bg-stone-800 rounded-full px-2 py-1">
                                    <TouchableOpacity onPress={() => handleUpdateMatchPreference('matchAgeMin', Math.max(18, (user?.preferences?.matchAgeMin || 18) - 1))} className="p-1"><Minus size={16} color="#FB8B3F" /></TouchableOpacity>
                                    <Text className="mx-2 font-plus-bold dark:text-white">{user?.preferences?.matchAgeMin || 18}</Text>
                                    <TouchableOpacity onPress={() => handleUpdateMatchPreference('matchAgeMin', Math.min((user?.preferences?.matchAgeMax || 50) - 1, (user?.preferences?.matchAgeMin || 18) + 1))} className="p-1"><Plus size={16} color="#FB8B3F" /></TouchableOpacity>
                                </View>
                            </View>
                            <View className="flex-1 items-center">
                                <Text className={`text-[10px] font-plus-bold mb-1 opacity-50 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>MÁX</Text>
                                <View className="flex-row items-center bg-stone-100 dark:bg-stone-800 rounded-full px-2 py-1">
                                    <TouchableOpacity onPress={() => handleUpdateMatchPreference('matchAgeMax', Math.max((user?.preferences?.matchAgeMin || 18) + 1, (user?.preferences?.matchAgeMax || 50) - 1))} className="p-1"><Minus size={16} color="#FB8B3F" /></TouchableOpacity>
                                    <Text className="mx-2 font-plus-bold dark:text-white">{user?.preferences?.matchAgeMax || 50}</Text>
                                    <TouchableOpacity onPress={() => handleUpdateMatchPreference('matchAgeMax', Math.min(99, (user?.preferences?.matchAgeMax || 50) + 1))} className="p-1"><Plus size={16} color="#FB8B3F" /></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        )}

        {isEditing && (
            <View className="mb-12">
              <View className="flex-row items-center mb-6">
                <Text className={`text-xl font-plus-ebold mr-2 ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Identidade</Text>
                <View className="h-1 w-12 bg-primary-container rounded-full" />
              </View>

              <Text className={`text-[10px] font-plus-bold uppercase mb-2 opacity-60 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Gênero</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {['Masculino', 'Feminino', 'Não-binário', 'Outro'].map(g => (
                  <TouchableOpacity 
                    key={g}
                    onPress={() => setEditForm(f => ({ ...f, gender: g }))}
                    className={`px-6 py-2 rounded-full border ${editForm.gender === g ? 'bg-primary border-primary' : (isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-lowest border-outline-variant/15')}`}
                  >
                    <Text className={`font-plus-bold text-sm ${editForm.gender === g ? 'text-white' : (isDark ? 'text-stone-400' : 'text-stone-600')}`}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className={`text-[10px] font-plus-bold uppercase mb-2 opacity-60 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Sua Idade</Text>
              <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center bg-stone-100 dark:bg-stone-800 rounded-full px-4 py-2">
                      <TouchableOpacity onPress={() => setEditForm(f => ({ ...f, age: Math.max(18, f.age - 1) }))} className="p-1"><Minus size={20} color="#FB8B3F" /></TouchableOpacity>
                      <Text className="mx-6 text-lg font-plus-bold dark:text-white">{editForm.age}</Text>
                      <TouchableOpacity onPress={() => setEditForm(f => ({ ...f, age: Math.min(99, f.age + 1) }))} className="p-1"><Plus size={20} color="#FB8B3F" /></TouchableOpacity>
                  </View>
              </View>
            </View>
        )}

        {!isEditing && (
          <>
            <View className="mb-12">
              <View className="flex-row items-center mb-6">
                <Text className={`text-xl font-plus-ebold mr-2 ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Tema</Text>
                <View className="h-1 w-12 bg-primary-container rounded-full" />
              </View>
              <View className={`flex-row gap-2 p-2 rounded-full border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-lowest border-outline-variant/10'}`}>
                <TouchableOpacity
                  onPress={() => setTheme('light')}
                  className={`flex-1 flex-row py-3 rounded-full items-center justify-center ${
                    theme === 'light' ? (isDark ? 'bg-primary-container' : 'bg-primary') : 'transparent'
                  }`}
                >
                  <Sun size={18} color={theme === 'light' ? (isDark ? '#1A0700' : '#FFFFFF') : (isDark ? '#FB8B3F' : '#954400')} />
                  <Text className={`font-plus-bold ml-2 ${theme === 'light' ? (isDark ? 'text-stone-950' : 'text-white') : (isDark ? 'text-stone-300' : 'text-on-surface')}`}>
                    Claro
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setTheme('dark')}
                  className={`flex-1 flex-row py-3 rounded-full items-center justify-center ${
                    theme === 'dark' ? (isDark ? 'bg-primary-container' : 'bg-primary') : 'transparent'
                  }`}
                >
                  <Moon size={18} color={theme === 'dark' ? (isDark ? '#1A0700' : '#FFFFFF') : (isDark ? '#FB8B3F' : '#954400')} />
                  <Text className={`font-plus-bold ml-2 ${theme === 'dark' ? (isDark ? 'text-stone-950' : 'text-white') : (isDark ? 'text-stone-300' : 'text-on-surface')}`}>
                    Escuro
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setTheme('system')}
                  className={`flex-1 flex-row py-3 rounded-full items-center justify-center ${
                    theme === 'system' ? (isDark ? 'bg-primary-container' : 'bg-primary') : 'transparent'
                  }`}
                >
                  <Monitor size={18} color={theme === 'system' ? (isDark ? '#1A0700' : '#FFFFFF') : (isDark ? '#FB8B3F' : '#954400')} />
                  <Text className={`font-plus-bold ml-2 ${theme === 'system' ? (isDark ? 'text-stone-950' : 'text-white') : (isDark ? 'text-stone-300' : 'text-on-surface')}`}>
                    Sistema
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-12">
              <View className="flex-row items-center mb-6">
                <Text className={`text-xl font-plus-ebold mr-2 ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>Configurações</Text>
                <View className="h-1 w-12 bg-primary-container rounded-full" />
              </View>

              <View>
                <SettingItem icon={<CreditCard size={20} color={isDark ? '#FB8B3F' : '#954400'} />} label="Métodos de Pagamento" isDark={isDark} />
                <SettingItem icon={<Shield size={20} color={isDark ? '#FB8B3F' : '#954400'} />} label="Segurança da Conta" isDark={isDark} />
                <SettingItem icon={<Bell size={20} color={isDark ? '#FB8B3F' : '#954400'} />} label="Notificações" isDark={isDark} />
                <SettingItem icon={<Lock size={20} color={isDark ? '#FB8B3F' : '#954400'} />} label="Privacidade" isDark={isDark} />
              </View>
            </View>

            <TouchableOpacity 
              onPress={signOut}
              activeOpacity={0.7}
              className={`flex-row items-center justify-center py-5 rounded-full border mb-10 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-low border-outline-variant/20'}`}
            >
              <LogOut color="#B02500" size={24} />
              <Text className={`${isDark ? 'text-stone-200' : 'text-on-surface'} font-plus-bold text-lg ml-3 uppercase`}>Sair da Conta</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function SettingItem({ icon, label, isDark }: { icon: React.ReactNode, label: string, isDark?: boolean }) {
  return (
    <TouchableOpacity className={`w-full flex-row items-center justify-between p-5 rounded-full mb-3 border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-lowest border-outline-variant/10'}`}>
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-primary-container/10' : 'bg-primary-container/20'}`}>
          {icon}
        </View>
        <Text className={`font-plus-bold ml-4 ${isDark ? 'text-stone-300' : 'text-on-surface'}`}>{label}</Text>
      </View>
      <ChevronRight size={20} color={isDark ? '#A8A29E' : '#9C6D43'} />
    </TouchableOpacity>
  );
}
