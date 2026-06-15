import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stars, X, Heart, MessageSquare, ArrowRight, Sparkles, Zap, Star, Plus } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VipTabProps {
  eventId: string;
  eventName: string;
  hasAccess: boolean;
  isLoading: boolean;
}

export default function VipTab({ eventId, eventName, hasAccess, isLoading }: VipTabProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  if (isLoading) {
    return (
      <View className={`flex-1 items-center justify-center py-20 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
        <ActivityIndicator color="#FB8B3F" size="large" />
      </View>
    );
  }

  if (!hasAccess) {
    return (
      <View className={`flex-1 px-6 py-16 items-center ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
        <View className={`w-24 h-24 rounded-full items-center justify-center mb-8 ${isDark ? 'bg-primary-container/10' : 'bg-primary-container/20'}`}>
          <Sparkles color="#FB8B3F" size={48} />
        </View>
        <Text className={`text-3xl font-plus-ebold text-center mb-4 tracking-tighter ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>
          Acesso Exclusivo <Text className={isDark ? 'text-primary-container' : 'text-primary'}>VIP</Text>
        </Text>
        <Text className={`text-center font-plus text-lg mb-12 leading-relaxed ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
          O VIP Lounge é um espaço reservado para quem já garantiu presença no evento. Garanta seu ingresso para liberar o VIP Match e conversas exclusivas.
        </Text>
        
        <View className={`w-full p-6 rounded-3xl border mb-10 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-low border-outline-variant/20'}`}>
          <Text className={`text-xs font-plus-bold uppercase tracking-widest mb-4 ${isDark ? 'text-primary-container' : 'text-primary'}`}>Vantagens VIP</Text>
          <View className="gap-4">
            <BenefitItem icon={<Zap size={18} color="#FB8B3F" />} text="Conexões prioritárias" isDark={isDark} />
            <BenefitItem icon={<MessageSquare size={18} color="#FB8B3F" />} text="Canais de discussão exclusivos" isDark={isDark} />
            <BenefitItem icon={<Star size={18} color="#FB8B3F" />} text="Dicas e segredos do festival" isDark={isDark} />
          </View>
        </View>

        <TouchableOpacity 
          className={`py-5 rounded-full shadow-lg items-center justify-center w-full active:scale-[0.98] ${isDark ? 'bg-primary-container' : 'bg-primary'}`}
        >
          <Text className={`font-plus-ebold text-lg uppercase tracking-widest ${isDark ? 'text-stone-950' : 'text-white'}`}>Garantir Ingresso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 px-6 pt-12 pb-32 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
      <View className="mb-12">
        <View className="px-4 py-1.5 rounded-full bg-primary-container mb-6 self-start">
          <Text className="text-stone-950 font-plus-bold text-[10px] uppercase tracking-widest">Exclusive Access</Text>
        </View>
        <Text className={`text-5xl font-plus-ebold tracking-tighter leading-[0.9] mb-4 ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>
          {eventName.split(' ')[0]} {'\n'}
          <Text className={isDark ? 'text-primary-container' : 'text-primary'}>VIP Lounge</Text>
        </Text>
        <Text className={`font-plus text-lg leading-relaxed ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
          Conecte-se com a elite do festival. Matching exclusivo e discussões curadas para nossos membros premium.
        </Text>
      </View>

      <View className="mb-12">
        <View className="flex-row justify-between items-end mb-6">
          <Text className={`text-2xl font-plus-bold tracking-tight ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>VIP Match</Text>
          <Text className={isDark ? 'text-primary-container font-plus-bold text-sm' : 'text-primary font-plus-bold text-sm'}>Descubra sua vibe</Text>
        </View>

        <View className={`overflow-hidden rounded-[2.5rem] shadow-xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-outline-variant/10'}`}>
          <View className="aspect-[4/5] relative">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiIPXOUkXLBosBZXRTbztyGGbrBGNax1Rph8tzW7SIdSqe8H1Fu_frc1LG6cErhwOFBSPIUx6OxsZhbB2WH3nedNIf3MDl0JbrngAvdCCRYO4Vij4p_KrL0k6BVszss089wcQWbZaHbNwYcnZ04Yq6iI-EfPO8yz_a2CkmDDK0gQRMgnkJODgn7eL5cs_KDXI_VEUbWiu1nI_x-t5ouIoT8nm-TX2nygjrdaD19SqEot4H4VsDAPKCYOn3p2iEBXqFaZ8PG9UyMKY' }}
              className="w-full h-full"
            />
            <LinearGradient 
              colors={['#954400', '#FB8B3F']} 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 1}}
              className="absolute top-6 left-6 px-4 py-1.5 rounded-full flex-row items-center shadow-lg"
            >
              <Stars color="#1A0700" size={14} fill="#1A0700" />
              <Text className="text-on-primary-fixed text-[10px] font-plus-ebold uppercase tracking-widest ml-2">VIP Member</Text>
            </LinearGradient>

            <LinearGradient
              colors={['transparent', 'rgba(26,7,0,0.8)']}
              className="absolute bottom-0 left-0 w-full p-8"
            >
              <Text className="text-white text-3xl font-plus-ebold mb-1">Ricardo, 28</Text>
              <Text className="text-white/80 font-plus text-sm mb-4 leading-relaxed" numberOfLines={2}>
                Procurando entusiastas de techno para curtir o palco principal na primeira fila. Amante de arquitetura e veterano de festivais.
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <Tag text="Deep House" />
                <Tag text="Urban Art" />
                <Tag text="Mixology" />
              </View>
            </LinearGradient>
          </View>

          <View className={`flex-row items-center justify-center gap-6 py-6 ${isDark ? 'bg-stone-800' : 'bg-white'}`}>
            <RoundButton icon={<X size={28} color={isDark ? "#A8A29E" : "#7D522B"} />} isDark={isDark} />
            <RoundButton 
              icon={<Heart size={36} color={isDark ? "#1C1917" : "#1A0700"} fill="currentColor" />} 
              isPrimary 
              isDark={isDark}
            />
            <RoundButton icon={<Star size={28} color="#FB8B3F" fill="#FB8B3F" />} isDark={isDark} />
          </View>
        </View>
      </View>

      <View className="mb-12">
        <View className="flex-row justify-between items-end mb-6">
          <Text className={`text-2xl font-plus-bold tracking-tight ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>VIP Lounge Discussions</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className={`font-plus-bold text-sm mr-1 ${isDark ? 'text-primary-container' : 'text-primary'}`}>Ver Tudo</Text>
            <ArrowRight size={14} color={isDark ? "#FB8B3F" : "#954400"} />
          </TouchableOpacity>
        </View>

        <View className="gap-4">
          <DiscussionPost 
            author="Marina Veras"
            time="5 min atrás"
            content="Alguém já conferiu o bar VIP no segundo nível? O coquetel assinatura 'Neon Sunset' é incrível. Adoraria pagar uma rodada para alguém! 🍸"
            likes={24}
            comments={8}
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuB4Isl7Fym_aAzzhGkKuvV4bJOxWjYXivyiWHAWXVAcIID_FeYWdLVC3emyECe_a5J0m9-afhD23NsyRQksxhYorVlXfR7ve2tFhzT4-dHBEHf3aCTW6oNjcExEngxQzWu_WkBcSZ30OicB4A776j5kfyUl3mnz4-lJdIvA3CXb-_qfXsOrSousTlSvMyTdXvpsnHwYklsh9DWxf2Zl60r_wwBq8yG_rSfl48evTm-5BRc3n03fiSnJnnGFMRojacoUei6YGAaiGV4"
            isFeatured
            isDark={isDark}
          />
          <DiscussionPost 
            author="Daniel Rocha"
            time="42 min atrás"
            content="Reservei uma mesa para a after-party no Sky Terrace. Tenho 2 vagas extras para colegas VIPs. Me chamem no DM se quiserem vir! 🌃✨"
            likes={56}
            comments={15}
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuB9BRtVjlL-xi3UXdjl3WuSZdhC3g4eyATrSybcBR_Gz50cK28T6lS2VyVz5Ta9Bv83t7_PpRe1vm2R0anzMnFUlQiAe1HEmKVM5uWHw877wZGoKlcZhTPrln6VepcSLKf5GU8cd-UqXgrr9MYNzT1FKvXRj9xDNrvShsCqaaU1yodPBAdgvea1hXUlpMsXan_9RMmOHIN_AeavUM3_TIIL3mguVQ7ibQL4WEmOzzUEnVd3lbTPMfqGIto5uHFQ_6wg0YFJc6Cre3Q"
            isDark={isDark}
          />

          <TouchableOpacity className={`w-full py-5 rounded-2xl border-2 border-dashed flex-row items-center justify-center gap-2 active:scale-[0.99] ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-low border-outline-variant'}`}>
            <Plus size={20} color={isDark ? "#A8A29E" : "#7D522B"} />
            <Text className={`font-plus-bold ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Compartilhar um VIP Pulse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function BenefitItem({ icon, text, isDark }: { icon: React.ReactNode, text: string, isDark: boolean }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className={`w-8 h-8 rounded-full items-center justify-center shadow-sm ${isDark ? 'bg-stone-800' : 'bg-white'}`}>{icon}</View>
      <Text className={`font-plus-medium ${isDark ? 'text-stone-300' : 'text-on-surface'}`}>{text}</Text>
    </View>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <View className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
      <Text className="text-white text-[10px] font-plus-bold uppercase tracking-wider">{text}</Text>
    </View>
  );
}

function RoundButton({ icon, isPrimary, isDark }: { icon: React.ReactNode, isPrimary?: boolean, isDark?: boolean }) {
  return (
    <TouchableOpacity 
      className={`rounded-full items-center justify-center active:scale-90 shadow-md ${isPrimary ? (isDark ? 'bg-primary-container w-20 h-20' : 'bg-primary w-20 h-20') : (isDark ? 'bg-stone-700 border border-stone-600 w-16 h-16' : 'bg-white border border-outline-variant/20 w-16 h-16')}`}
    >
      {icon}
    </TouchableOpacity>
  );
}

function DiscussionPost({ author, time, content, likes, comments, image, isFeatured, isDark }: any) {
  return (
    <View className={`p-6 rounded-3xl shadow-sm mb-2 border-l-4 ${isFeatured ? (isDark ? 'bg-stone-800 border-primary-container' : 'bg-surface-container-lowest border-primary') : (isDark ? 'bg-stone-900 border-transparent' : 'bg-surface-container-low border-transparent')}`}>
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <View className="relative">
            <Image source={{ uri: image }} className="w-12 h-12 rounded-full bg-surface-variant" />
            <View className={`absolute -bottom-1 -right-1 rounded-full p-0.5 border-2 ${isDark ? 'bg-primary-container border-stone-800' : 'bg-primary border-white'}`}>
              <Stars color={isDark ? "#1A0700" : "white"} size={8} fill="currentColor" />
            </View>
          </View>
          <View>
            <Text className={`font-plus-bold text-sm ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>{author}</Text>
            <Text className={`text-[10px] uppercase tracking-widest font-plus-bold ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>{time}</Text>
          </View>
        </View>
      </View>
      <Text className={`text-base mb-6 leading-relaxed font-plus ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>
        {content}
      </Text>
      <View className="flex-row items-center gap-6">
        <View className="flex-row items-center gap-1.5">
          <Heart size={18} color={isFeatured ? "#FB8B3F" : (isDark ? "#A8A29E" : "#7D522B")} fill={isFeatured ? "#FB8B3F" : "transparent"} />
          <Text className={`text-xs font-plus-bold ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>{likes}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <MessageSquare size={18} color={isDark ? "#A8A29E" : "#7D522B"} />
          <Text className={`text-xs font-plus-bold ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>{comments}</Text>
        </View>
      </View>
    </View>
  );
}
