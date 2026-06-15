import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, ActivityIndicator, Linking, Platform, Animated as RNAnimated, LayoutChangeEvent, LayoutAnimation, UIManager, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Share2, MapPin, Check, Minus, Plus, Upload } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../services/api';
import MatchTab from '../../../components/MatchTab';
import CommunityTab from '../../../components/CommunityTab';
import VipTab from '../../../components/VipTab';
import { useTheme } from '../../../context/ThemeContext';

// Habilita animação no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TabType = 'FEED' | 'TICKETS' | 'COMMUNITY' | 'MATCH' | 'VIP';

interface InterestResponse {
  eventId: string;
  favorite: boolean;
  hasTicket: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_WIDTH = SCREEN_WIDTH - 32; // px-4
const HEIGHT_FEED = HEADER_WIDTH * (5/4);
const HEIGHT_OTHERS = HEADER_WIDTH * (9/21);

export default function EventHubScreen() {
  const { id, purchase } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>(purchase === 'confirm' ? 'TICKETS' : 'FEED');
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<any>(null);
  
  // Truncation state
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);

  const tabFadeAnim = useRef(new RNAnimated.Value(1)).current;
  const headerHeight = useRef(new RNAnimated.Value(
    purchase === 'confirm' ? HEIGHT_OTHERS : (activeTab === 'FEED' ? HEIGHT_FEED : HEIGHT_OTHERS)
  )).current;
  
  const tabIndicatorAnim = useRef(new RNAnimated.Value(purchase === 'confirm' ? 1 : 0)).current;
  const successScaleAnim = useRef(new RNAnimated.Value(0)).current;
  const successTextAnim = useRef(new RNAnimated.Value(0)).current;
  const successButtonAnim = useRef(new RNAnimated.Value(0)).current;
  
  const [tabLayouts, setTabLayouts] = useState<Record<number, { x: number, width: number }>>({});

  const tabs: { label: string, value: TabType }[] = [
    { label: 'Feed', value: 'FEED' },
    { label: 'Ingressos', value: 'TICKETS' },
    { label: 'Comunidade', value: 'COMMUNITY' },
    { label: 'Match', value: 'MATCH' },
    { label: 'VIP', value: 'VIP' },
  ];

  const handleTabChange = (newTab: TabType, index: number) => {
    if (newTab === activeTab) return;

    let targetHeight = HEIGHT_OTHERS;
    if (newTab === 'FEED') targetHeight = HEIGHT_FEED;
    if (newTab === 'VIP') targetHeight = 0;

    RNAnimated.parallel([
      RNAnimated.timing(tabFadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      RNAnimated.spring(tabIndicatorAnim, { toValue: index, useNativeDriver: false, friction: 9, tension: 40 }),
      RNAnimated.timing(headerHeight, { toValue: targetHeight, duration: 350, useNativeDriver: false })
    ]).start(() => {
      setActiveTab(newTab);
      RNAnimated.timing(tabFadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const onTabLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => ({ ...prev, [index]: { x, width } }));
  };

  const hasLayouts = Object.keys(tabLayouts).length === tabs.length;
  
  const indicatorTranslateX = hasLayouts 
    ? tabIndicatorAnim.interpolate({
        inputRange: tabs.map((_, i) => i),
        outputRange: tabs.map((_, i) => (tabLayouts[i]?.x || 0))
      })
    : 24;

  const indicatorWidth = hasLayouts
    ? tabIndicatorAnim.interpolate({
        inputRange: tabs.map((_, i) => i),
        outputRange: tabs.map((_, i) => (tabLayouts[i]?.width || 0))
      })
    : 40;

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: interest, isLoading: isLoadingInterest } = useQuery<InterestResponse>({
    queryKey: ['interest', id],
    queryFn: async () => {
      const response = await api.get(`/social/events/${id}/interest`);
      return response.data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (purchase === 'confirm') {
      setActiveTab('TICKETS');
      tabIndicatorAnim.setValue(1);
    }
  }, [purchase]);

  const purchaseMutation = useMutation({
    mutationFn: async (ticketTypeId: string) => {
      const payload = {
        ticketTypeId,
        payment: {
          paymentMethodId: 'pix', installments: 1, payerEmail: 'usuario@exemplo.com',
          firstName: 'Usuario', lastName: 'Teste', identificationNumber: '12345678909'
        }
      };
      const response = await api.post('/tickets/purchase', payload);
      return response.data;
    },
    onSuccess: (data) => {
      setPurchaseSuccess(data);
      setIsPurchasing(false);
      RNAnimated.stagger(150, [
        RNAnimated.spring(successScaleAnim, { toValue: 1, useNativeDriver: true, tension: 40, friction: 5 }),
        RNAnimated.timing(successTextAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        RNAnimated.timing(successButtonAnim, { toValue: 1, duration: 400, useNativeDriver: true })
      ]).start();
    }
  });

  const formatEventDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' }) + ' • ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const openMap = () => {
    if (!event) return;
    const { location, latitude, longitude } = event;
    const query = encodeURIComponent(location);
    const url = Platform.select({
      ios: latitude && longitude ? `maps:0,0?q=${query}&ll=${latitude},${longitude}` : `maps:0,0?q=${query}`,
      android: latitude && longitude ? `geo:${latitude},${longitude}?q=${query}` : `geo:0,0?q=${query}`,
    });
    if (url) Linking.openURL(url);
  };

  const totalPrice = useMemo(() => {
    if (!event?.ticketTypes) return 0;
    return event.ticketTypes.reduce((acc: number, tt: any) => acc + ((selectedTickets[tt.id] || 0) * tt.price), 0);
  }, [event, selectedTickets]);

  const totalQty = useMemo(() => Object.values(selectedTickets).reduce((acc, qty) => acc + qty, 0), [selectedTickets]);

  const handleGoToPayment = () => {
    const ticketTypeId = Object.keys(selectedTickets).find(id => selectedTickets[id] > 0);
    if (ticketTypeId) {
      router.push({
        pathname: '/checkout/methods',
        params: { eventId: id as string, ticketTypeId, quantity: selectedTickets[ticketTypeId] }
      });
    }
  };

  const handleFinalConfirm = () => {
    const ticketTypeId = Object.keys(selectedTickets).find(id => selectedTickets[id] > 0);
    if (ticketTypeId) {
      setIsPurchasing(true);
      purchaseMutation.mutate(ticketTypeId);
    }
  };

  if (isLoading) return <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'} items-center justify-center`}><ActivityIndicator size="large" color="#FB8B3F" /></View>;
  if (!event) return null;

  if (purchaseSuccess) {
    return (
      <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <SafeAreaView className={`${isDark ? 'bg-stone-950' : 'bg-background'} flex-row justify-between items-center px-6 py-4`}>
          <TouchableOpacity onPress={() => setPurchaseSuccess(null)}><ArrowLeft color={isDark ? '#FB8B3F' : '#954400'} size={24} /></TouchableOpacity>
          <Text className={`font-plus-bold text-lg ${isDark ? 'text-primary-container' : 'text-primary'}`}>Confirmação</Text>
          <View className="w-6" />
        </SafeAreaView>
        <ScrollView className="px-6 pt-8" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-12">
            <RNAnimated.View style={{ transform: [{ scale: successScaleAnim }] }} className="w-24 h-24 rounded-full bg-primary-container items-center justify-center shadow-lg mb-6">
              <Check color="#1A0700" size={48} strokeWidth={3} />
            </RNAnimated.View>
            <RNAnimated.View style={{ opacity: successTextAnim, transform: [{ translateY: successTextAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
              <Text className={`text-5xl font-plus-ebold text-center leading-tight ${isDark ? 'text-primary-container' : 'text-primary'}`}>Ingresso{'\n'}Garantido!</Text>
            </RNAnimated.View>
          </View>
          <RNAnimated.View style={{ opacity: successButtonAnim, transform: [{ translateY: successButtonAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>
            <TouchableOpacity className="bg-primary-container py-5 rounded-full shadow-lg items-center justify-center mt-10" onPress={() => router.replace('/(tabs)/tickets')}>
              <Text className="text-on-primary-fixed font-plus-ebold text-lg uppercase">Ver Meus Ingressos</Text>
            </TouchableOpacity>
          </RNAnimated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView edges={['top']} className={`z-50 border-b ${isDark ? 'bg-stone-950/60 border-stone-800' : 'bg-background/60 border-outline-variant/10'}`}>
        <View className="flex-row justify-between items-center px-6 py-4">
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity onPress={() => router.back()} className="active:scale-95"><ArrowLeft color={isDark ? '#FB8B3F' : '#954400'} size={24} /></TouchableOpacity>
            <Text className={`font-plus-bold text-xl ${isDark ? 'text-primary-container' : 'text-primary'}`}>{activeTab === 'TICKETS' ? 'Ingressos' : 'Vibra'}</Text>
          </View>
          <TouchableOpacity className="active:scale-95"><Share2 color={isDark ? '#FB8B3F' : '#954400'} size={24} /></TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView 
        className={isDark ? 'bg-stone-950' : 'bg-background'}
        stickyHeaderIndices={[1]} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {activeTab !== 'VIP' ? (
          <View className="px-4 pt-4">
            <RNAnimated.View 
              style={{ height: headerHeight }}
              className="relative w-full rounded-[2.5rem] overflow-hidden shadow-lg"
            >
              <Image source={{ uri: event.thumbnailUrl }} className="w-full h-full rounded-3xl" resizeMode="cover" />
              <View className="absolute inset-0 bg-black/40" />
              <View className="absolute bottom-6 left-8">
                <Text className="text-white text-3xl font-plus-ebold leading-tight mb-1">{event.title}</Text>
                <Text className="text-white/80 font-plus-bold text-sm">{formatEventDate(event.eventDate)}</Text>
              </View>
            </RNAnimated.View>
          </View>
        ) : (
          <RNAnimated.View 
            style={{ height: headerHeight, overflow: 'hidden' }}
          >
            <View className="px-6 pt-10 pb-4">
              <View className="inline-flex self-start items-center px-4 py-1.5 rounded-full bg-[#fb8b3f] mb-6">
                <Text className="text-[#1a0700] font-plus-bold text-[10px] uppercase tracking-widest">Exclusive Access</Text>
              </View>
              <Text className={`text-5xl font-plus-ebold tracking-tighter leading-[0.9] mb-4 ${isDark ? 'text-stone-50' : '#482603'}`}>
                {event.title.split(' ')[0]} {'\n'}
                <Text className="text-[#fb8b3f]">VIP Lounge</Text>
              </Text>
              <Text className={`text-sm font-plus-medium max-w-xs leading-relaxed ${isDark ? 'text-stone-400' : '#7d522b'}`}>
                Connect with the festival's elite. Exclusive matching and discussions curated for our premium members.
              </Text>
            </View>
          </RNAnimated.View>
        )}

        <View className={`border-b ${isDark ? 'bg-stone-950 border-stone-800' : 'bg-background border-outline-variant/10'}`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 py-4">
            {tabs.map((tab, index) => (
              <TouchableOpacity 
                key={tab.value} 
                onPress={() => handleTabChange(tab.value, index)} 
                onLayout={(e) => onTabLayout(index, e)}
                className="mr-8 relative pb-3"
              >
                <Text className={`font-plus-bold text-sm uppercase tracking-widest ${activeTab === tab.value ? (isDark ? 'text-primary-container' : 'text-primary') : (isDark ? 'text-stone-500' : 'text-on-surface-variant opacity-60')}`}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
            <RNAnimated.View 
              style={{
                position: 'absolute',
                bottom: 0,
                height: 4,
                backgroundColor: isDark ? '#FB8B3F' : '#954400',
                borderRadius: 2,
                width: indicatorWidth,
                transform: [{ translateX: indicatorTranslateX }]
              }}
            />
          </ScrollView>
        </View>

        <RNAnimated.View style={{ opacity: tabFadeAnim }}>
          {activeTab === 'FEED' && (
            <View className="mt-8 px-6 pb-20">
              <Text className={`font-plus-bold uppercase tracking-widest text-[10px] mb-4 ${isDark ? 'text-stone-500' : 'text-on-surface-variant'}`}>Sobre o Evento</Text>
              
              <View>
                <Text
                  testID="event-description-measure"
                  style={{ position: 'absolute', opacity: 0, zIndex: -1 }}
                  onTextLayout={(e) => {
                    if (e.nativeEvent.lines.length > 4 && !showMoreButton) {
                      setShowMoreButton(true);
                    }
                  }}
                >
                  {event.description}
                </Text>

                <TouchableOpacity 
                  activeOpacity={1} 
                  onPress={() => showMoreButton && setIsExpanded(!isExpanded)}
                >
                  <Text 
                    testID="event-description-visible"
                    className={`text-xl leading-relaxed font-plus-bold ${isDark ? 'text-stone-100' : 'text-on-surface'}`}
                    numberOfLines={isExpanded ? undefined : 4}
                  >
                    {event.description}
                  </Text>
                </TouchableOpacity>
              </View>

              {showMoreButton && (
                <TouchableOpacity 
                  onPress={() => setIsExpanded(!isExpanded)} 
                  className="mt-3"
                  activeOpacity={0.7}
                >
                  <Text className={`font-plus-bold ${isDark ? 'text-primary-container' : 'text-primary'}`}>
                    {isExpanded ? 'Ver menos' : 'Ver mais'}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity onPress={openMap} activeOpacity={0.8} className={`mt-8 p-4 rounded-xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-low border-outline-variant/10'}`}>
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1 mr-4">
                    <Text className={`font-plus-bold text-lg ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>{event.location}</Text>
                    <Text className={`text-xs ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Toque para ver no mapa</Text>
                  </View>
                  <MapPin color={isDark ? '#FB8B3F' : '#954400'} size={24} />
                </View>
                <View className="w-full aspect-video rounded-lg overflow-hidden relative">
                  <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeePrLfeLCpzvD3V3pc8s1aTt2c9wmyn6yG6F2DgOsMyZCmmgXNAKJWTyKfZFwcypsZ2PXI4FDse8itBSjmyP4j_AgIetYmipyF30V00OEDidqaNYLvOfWjRHd3I35hc5atlqD-I60O2kuZk2af7m5OPNIzznxux3SnKoBCI2VeZgSHowf1ENFcCMJr8lfHqq-ZS8C1LJQL4aGY4cyPPyb7VnPcpl3N-pi63g29JYGU2Y0Zb2AuS1je_W5WsAD5ts0XuGIBq8HqHo" }} className="w-full h-full" resizeMode="cover" />
                  <View className="absolute inset-0 bg-primary/10 items-center justify-center"><View className={`p-3 rounded-full shadow-lg ${isDark ? 'bg-stone-900' : 'bg-white/90'}`}><MapPin color={isDark ? '#FB8B3F' : '#954400'} size={32} /></View></View>
                </View>
              </TouchableOpacity>

              {event.lineup?.length > 0 && (
                <View className="mt-12">
                  <Text className={`text-2xl font-plus-ebold tracking-tight mb-6 ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>Full Lineup</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row -mx-6 px-6">
                    {event.lineup.map((artist: any, idx: number) => (
                      <View key={idx} className="w-40 mr-6 items-center">
                        <View className="aspect-square w-full rounded-full overflow-hidden mb-4 border-4 border-transparent">
                          <Image source={{ uri: artist.artistImageUrl || 'https://via.placeholder.com/150' }} className="w-full h-full" resizeMode="cover" />
                        </View>
                        <Text className={`text-center font-plus-bold ${isDark ? 'text-stone-200' : 'text-on-surface'}`} numberOfLines={1}>{artist.artistName}</Text>
                        <Text className={`text-center text-[10px] uppercase tracking-widest ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Artist</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {activeTab === 'TICKETS' && (
            <View className="mt-8 px-6 pb-40">
              <Text className={`text-3xl font-plus-ebold tracking-tighter mb-8 ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>Garanta seu Ingresso</Text>
              
              <View className={`rounded-2xl p-8 border shadow-sm mb-8 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-low border-outline-variant/10'}`}>
                <View className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-primary-container/10' : 'bg-primary-container/20'}`}>
                  <Share2 className={isDark ? 'text-primary-container' : 'text-primary'} size={32} />
                </View>
                <Text className={`text-2xl font-plus-ebold mb-4 ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>Venda Externa</Text>
                <Text className={`${isDark ? 'text-stone-400' : 'text-stone-500'} font-plus-medium leading-relaxed mb-8`}>
                  Este evento utiliza uma plataforma externa para a venda de ingressos. Toque no botão abaixo para ser redirecionado e garantir sua entrada.
                </Text>
                
                <TouchableOpacity 
                  disabled={!event.externalTicketLink}
                  onPress={() => event.externalTicketLink && Linking.openURL(event.externalTicketLink)}
                  className={`py-5 rounded-full items-center justify-center ${event.externalTicketLink ? 'bg-primary-container shadow-lg' : (isDark ? 'bg-stone-800 opacity-50' : 'bg-stone-800 opacity-50')}`}
                >
                  <Text className="text-on-primary-fixed font-plus-ebold text-base uppercase tracking-widest">
                    {event.externalTicketLink ? 'Ir para o Site de Vendas' : 'Vendas em Breve'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className={`p-6 rounded-2xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-900 border-stone-700'}`}>
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-2 h-2 rounded-full bg-primary" />
                  <Text className="text-[10px] font-plus-bold text-primary uppercase tracking-widest">Novidade</Text>
                </View>
                <Text className="text-stone-300 font-plus-bold text-sm leading-relaxed mb-6">
                  A venda direta dentro do Vibra será lançada no <Text className="text-primary">3º trimestre de 2026</Text>. 
                  Por enquanto, você pode comprar no link externo e <Text className="text-primary">importar seu ingresso</Text> manualmente para sua carteira.
                </Text>

                <TouchableOpacity 
                  onPress={() => router.push({
                    pathname: '/tickets/import',
                    params: { eventId: event.id, eventTitle: event.title }
                  })}
                  className={`flex-row items-center justify-center gap-1 py-4 rounded-2xl border ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-stone-800 border-stone-700'}`}
                >
                  <Upload className="text-stone-400" size={18} />
                  <Text className="text-stone-300 font-plus-bold text-sm uppercase tracking-widest">Importar Ingresso</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'MATCH' && <MatchTab eventId={id as string} eventName={event.title} />}
          {activeTab === 'COMMUNITY' && <CommunityTab eventId={id as string} eventName={event.title} />}
          {activeTab === 'VIP' && <VipTab eventId={id as string} eventName={event.title} hasAccess={!!interest?.hasTicket} isLoading={isLoadingInterest} />}
          {!['FEED', 'TICKETS', 'MATCH', 'COMMUNITY', 'VIP'].includes(activeTab) && <View className="items-center justify-center py-20"><Text className={`font-plus-bold uppercase tracking-widest ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>{activeTab} EM BREVE</Text></View>}
        </RNAnimated.View>
      </ScrollView>
    </View>
  );
}
