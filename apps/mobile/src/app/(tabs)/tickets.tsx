import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ticket, X, Plus, Trash2, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TicketsScreen() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const router = useRouter();

  const loadTickets = async () => {
    try {
      const stored = await SecureStore.getItemAsync('user_tickets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTickets(parsed);
        } else {
          await SecureStore.deleteItemAsync('user_tickets');
          setTickets([]);
        }
      }
    } catch (error) {
      await SecureStore.deleteItemAsync('user_tickets');
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const deleteTickets = async (idsToDelete: string[]) => {
    try {
      const updatedTickets = tickets.filter(t => !idsToDelete.includes(t.id));
      await SecureStore.setItemAsync('user_tickets', JSON.stringify(updatedTickets));
      setTickets(updatedTickets);
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o(s) ingresso(s).');
    }
  };

  const confirmDeleteSelection = () => {
    Alert.alert(
      'Excluir Ingressos',
      `Deseja excluir os ${selectedIds.size} ingressos selecionados?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteTickets(Array.from(selectedIds)) }
      ]
    );
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
      if (newSelection.size === 0) setIsSelectionMode(false);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const handleLongPress = (id: string) => {
    setIsSelectionMode(true);
    toggleSelection(id);
  };

  const handlePress = (ticket: any) => {
    if (isSelectionMode) {
      toggleSelection(ticket.id);
    } else {
      setSelectedTicket(ticket);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Não identificado') return 'DATA N/I';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
    } catch {
      return 'DATA N/I';
    }
  };

  if (isLoading) {
    return (
      <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'} items-center justify-center`}>
        <ActivityIndicator size="large" color="#FB8B3F" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView edges={['top']} className={isDark ? 'bg-stone-950' : 'bg-background'}>
        <View className="px-6 py-4 flex-row justify-between items-center">
          {isSelectionMode ? (
            <>
              <TouchableOpacity onPress={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }}>
                <X color={isDark ? '#FB8B3F' : '#954400'} size={28} />
              </TouchableOpacity>
              <Text className={`text-xl font-plus-bold ${isDark ? 'text-primary-container' : 'text-primary'}`}>{selectedIds.size} selecionados</Text>
              <TouchableOpacity onPress={confirmDeleteSelection}>
                <Trash2 color="#ef4444" size={28} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text className={`text-3xl font-plus-ebold ${isDark ? 'text-primary-container' : 'text-primary'}`}>Carteira</Text>
              <TouchableOpacity 
                onPress={() => router.push('/tickets/import')}
                className="w-12 h-12 bg-primary-container rounded-2xl items-center justify-center shadow-sm"
              >
                <Plus color="#1A0700" size={24} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>

      <ScrollView className={`flex-1 px-6 ${isDark ? 'bg-stone-950' : 'bg-background'}`} showsVerticalScrollIndicator={false}>
        {!isSelectionMode && (
          <TouchableOpacity 
            onPress={() => router.push('/tickets/import')}
            activeOpacity={0.8}
            className={`w-full ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-950 border-stone-800'} border rounded-2xl p-5 flex-row items-center mb-8 mt-4 shadow-xl`}
          >
            <View className={`w-16 h-16 ${isDark ? 'bg-primary-container/10' : 'bg-primary/20'} mr-6 rounded-2xl items-center justify-center`}>
              <Ticket className={isDark ? 'text-primary-container' : 'text-primary'} size={32} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-plus-bold text-lg leading-tight mb-1">Importar Ingresso</Text>
              <Text className="text-stone-500 text-xs">O Vibra identifica os dados do seu PDF ou foto automaticamente.</Text>
            </View>
          </TouchableOpacity>
        )}

        {tickets.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
             <View className={`w-20 h-20 ${isDark ? 'bg-stone-900' : 'bg-stone-100'} rounded-full items-center justify-center mb-6`}>
                <Ticket color={isDark ? '#44403c' : '#ccc'} size={40} />
             </View>
             <Text className={`${isDark ? 'text-stone-500' : 'text-stone-400'} font-plus-bold text-center`}>Nenhum ingresso na carteira.</Text>
          </View>
        ) : (
          <>
            <Text className={`text-[10px] font-plus-bold uppercase tracking-widest mb-6 ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
              {isSelectionMode ? 'Selecione para excluir' : `Seus Ingressos (${tickets.length})`}
            </Text>

            {tickets.map((ticket) => (
              <TouchableOpacity 
                key={ticket.id}
                onLongPress={() => handleLongPress(ticket.id)}
                onPress={() => handlePress(ticket)}
                activeOpacity={0.9}
                className={`rounded-2xl border ${isDark ? 'bg-stone-900' : 'bg-white'} ${selectedIds.has(ticket.id) ? (isDark ? 'border-primary-container' : 'border-primary bg-primary/5') : (isDark ? 'border-stone-800' : 'border-outline-variant/20')} shadow-sm mb-8 overflow-hidden`}
              >
                <View className="flex-row items-center p-6">
                  <View className={`w-24 h-24 rounded-2xl items-center justify-center border mr-5 overflow-hidden ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-100'}`}>
                    <Image 
                      source={{ uri: ticket.qrCodeBase64 ? ticket.qrCodeBase64 : ticket.originalImageUri }} 
                      className="w-full h-full" 
                      resizeMode="cover"
                    />
                    {selectedIds.has(ticket.id) && (
                      <View className={`absolute inset-0 items-center justify-center ${isDark ? 'bg-primary-container/40' : 'bg-primary/40'}`}>
                        <CheckCircle2 color="white" size={40} />
                      </View>
                    )}
                  </View>

                  <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                       <Text className={`text-[9px] font-plus-bold uppercase tracking-widest ${isDark ? 'text-primary-container' : 'text-primary'}`}>{ticket.status === 'IMPORTED' ? 'Importado' : 'Oficial'}</Text>
                       <Text className={`text-[10px] font-plus-bold ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>{formatDate(ticket.eventDate)}</Text>
                    </View>
                    
                    <Text className={`text-lg font-plus-bold leading-tight mb-2 ${isDark ? 'text-stone-100' : 'text-on-surface'}`} numberOfLines={1}>
                      {ticket.eventTitle}
                    </Text>
                    
                    <View className={`py-1.5 px-3 self-start rounded-full border ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-100'}`}>
                      <Text className={`text-[9px] font-plus-bold uppercase ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>{ticket.type || 'Voucher'}</Text>
                    </View>
                  </View>
                </View>
                
                <View className={`py-3 flex-row justify-center items-center border-t ${isDark ? 'bg-primary-container/5 border-stone-800' : 'bg-primary-container/10 border-primary-container/20'}`}>
                   <Text className={`text-[10px] font-plus-bold uppercase tracking-widest ${isDark ? 'text-primary-container' : 'text-primary'}`}>
                     {isSelectionMode ? (selectedIds.has(ticket.id) ? 'Selecionado' : 'Tocar para selecionar') : 'Toque para abrir original'}
                   </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        <View className="h-20" />
      </ScrollView>

      <Modal
        visible={!!selectedTicket}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedTicket(null)}
      >
        <View className="flex-1 bg-black/95 items-center justify-center p-6">
          <TouchableOpacity 
            onPress={() => setSelectedTicket(null)}
            className="absolute top-12 right-6 w-12 h-12 bg-white/10 rounded-full items-center justify-center z-50"
          >
            <X color="white" size={28} />
          </TouchableOpacity>

          <View className={`rounded-[3.5rem] w-full h-3/4 overflow-hidden shadow-2xl ${isDark ? 'bg-stone-900' : 'bg-white'}`}>
            <View className={`p-8 items-center ${isDark ? 'bg-stone-800' : 'bg-stone-50'}`}>
              <Text className={`font-plus-bold text-[10px] uppercase tracking-widest mb-6 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Ingresso Original</Text>
              <Text className={`text-2xl font-plus-ebold text-center mb-2 ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>{selectedTicket?.eventTitle}</Text>
            </View>

            <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-stone-200'}`}>
              <ScrollView
                maximumZoomScale={5}
                minimumZoomScale={1}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
              >
                <View className={`w-full aspect-[3/4] shadow-inner m-4 ${isDark ? 'bg-stone-900' : 'bg-white'}`}>
                  <Image 
                    source={{ uri: selectedTicket?.originalImageUri }} 
                    className="w-full h-full" 
                    resizeMode="contain"
                  />
                </View>
              </ScrollView>
            </View>

            <View className={`flex-row border-t divide-x ${isDark ? 'border-stone-800 divide-stone-800' : 'border-stone-100 divide-stone-100'}`}>
              <View className="flex-1 p-6 items-center">
                <Text className={`text-[9px] font-plus-bold uppercase mb-1 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Tipo</Text>
                <Text className={`font-plus-bold text-xs ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>{selectedTicket?.type || 'Voucher'}</Text>
              </View>
              <View className="flex-1 p-6 items-center">
                <Text className={`text-[9px] font-plus-bold uppercase mb-1 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Status</Text>
                <Text className={`font-plus-bold text-xs ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>Válido</Text>
              </View>
            </View>
          </View>
          
          <View className="mt-6 px-4">
            <Text className="text-white/40 text-[10px] text-center font-plus-bold uppercase tracking-widest">
              Arraste para visualizar (Zoom ativado no iOS)
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
