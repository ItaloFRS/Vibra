import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Image,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MoreHorizontal, Plus, Smile, Send, CheckCheck, ShieldAlert, Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useChat } from '../../../hooks/useChat';
import api from '../../../services/api';

import { UserAvatar } from '../../../components/common/UserAvatar';

export default function IndividualChatScreen() {
  const { id, name, photoUrl, isRequest } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const [input, setInput] = useState('');
  const [matchId, setMatchId] = useState<string | null>(null);
  const [isFindingMatch, setIsFindingMatch] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  // First, find the matchId associated with this user
  useEffect(() => {
    const fetchMatchId = async () => {
      try {
        const response = await api.get(`/social/users/${id}/match-id`);
        if (response.data.matchId && response.data.matchId !== "00000000-0000-0000-0000-000000000000") {
          setMatchId(response.data.matchId);
        } else {
          // If no matchId exists yet (e.g. just a chat request), 
          // we might need a different logic or a placeholder matchId.
          // For now, we'll try to use the target user ID as a fallback if the backend supports it,
          // but usually individual chats MUST have a matchId.
          console.warn("No matchId found for this user interaction");
        }
      } catch (error) {
        console.error("Error fetching matchId:", error);
      } finally {
        setIsFindingMatch(false);
      }
    };

    fetchMatchId();
  }, [id]);

  const {
    messages,
    sendMessage,
    sendTyping,
    isOtherTyping,
    isLoading: isChatLoading
  } = useChat({ matchId: matchId as string });

  const handleSend = () => {
    if (!input.trim() || !matchId) return;
    sendMessage(input);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  if ((isFindingMatch || isChatLoading) && messages.length === 0) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-stone-950' : 'bg-white'}`}>
        <ActivityIndicator color="#FB8B3F" size="large" />
        <Text className={`mt-4 font-plus-medium ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Iniciando conversa segura...</Text>
      </View>
    );
  }

  const isMessageRequest = isRequest === 'true' && messages.length === 0;

  return (
    <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-[#F9F9F9]'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Modern Compact Header */}
      <SafeAreaView edges={['top']} className={`z-50 border-b ${isDark ? 'bg-stone-900/50 border-stone-800' : 'bg-white/80 border-stone-100'}`}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <ArrowLeft color={isDark ? 'white' : '#1C1917'} size={26} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push(`/user/${id}`)}
              className="flex-row items-center gap-3"
            >
              <View className="relative">
                <UserAvatar uri={photoUrl as string} size={40} />
                <View className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </View>
              <View>
                <Text className={`font-plus-bold text-base ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>{name || 'Usuário'}</Text>
                <Text className="text-[10px] font-plus-bold text-emerald-500 uppercase tracking-tighter">Online agora</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity className={`p-2 rounded-full ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}>
            <MoreHorizontal color={isDark ? 'white' : '#1C1917'} size={20} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          ref={scrollRef}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 20, gap: 16 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Match Context Header */}
          <View className="items-center my-8">
            <View className={`p-6 rounded-[3rem] items-center ${isDark ? 'bg-stone-900' : 'bg-white shadow-sm'}`}>
              <View className="flex-row items-center mb-4">
                 <UserAvatar uri={photoUrl as string} size={64} borderWidth={4} borderColor={isDark ? '#44403c' : '#F5F5F4'} />
                 <View className={`w-10 h-10 rounded-full items-center justify-center -ml-4 z-10 bg-primary shadow-lg`}>
                    <Heart color="white" size={20} fill="white" />
                 </View>
              </View>
              <Text className={`text-center font-plus-bold text-lg ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Conexão Vibra
              </Text>
              <Text className={`text-center font-plus-medium text-sm opacity-50 px-6 mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                Sua conversa com {name} é protegida e privada.
              </Text>
            </View>
          </View>

          {messages.map((msg, index) => {
            const isMine = msg.senderId === user?.id;
            const showTime = index === messages.length - 1 || messages[index+1]?.senderId !== msg.senderId;

            // Date Divider Logic
            const msgDate = new Date(msg.createdAt);
            const prevMsgDate = index > 0 ? new Date(messages[index - 1].createdAt) : null;
            const isNewDay = !prevMsgDate || msgDate.toDateString() !== prevMsgDate.toDateString();

            const formatDate = (date: Date) => {
              const today = new Date();
              const yesterday = new Date();
              yesterday.setDate(today.getDate() - 1);

              if (date.toDateString() === today.toDateString()) return 'Hoje';
              if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
              
              return date.toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'long',
                year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
              });
            };

            return (
              <React.Fragment key={msg.messageId || index}>
                {isNewDay && (
                  <View className="items-center my-6">
                    <View className={`px-4 py-1.5 rounded-full ${isDark ? 'bg-stone-800' : 'bg-stone-200/50'}`}>
                      <Text className={`text-[10px] font-plus-bold uppercase tracking-widest ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {formatDate(msgDate)}
                      </Text>
                    </View>
                  </View>
                )}
                
                <View 
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <View 
                    style={{ 
                      borderRadius: 20, 
                      borderBottomRightRadius: isMine ? 4 : 20,
                      borderBottomLeftRadius: isMine ? 20 : 4,
                      backgroundColor: isMine ? '#FB8B3F' : (isDark ? '#292524' : '#FFFFFF'),
                      maxWidth: '85%'
                    }}
                    className={`px-5 py-3.5 shadow-sm ${!isMine && !isDark ? 'border border-stone-100' : ''}`}
                  >
                    <Text className={`text-[15px] leading-relaxed font-plus-medium ${isMine ? 'text-white' : (isDark ? 'text-stone-200' : 'text-stone-800')}`}>
                      {msg.content}
                    </Text>
                  </View>
                  
                  {showTime && (
                    <View className={`flex-row items-center gap-1 mt-1.5 ${isMine ? 'mr-1' : 'ml-1'}`}>
                      <Text className="text-[9px] font-plus-bold text-stone-400 uppercase tracking-widest">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      {isMine && <CheckCheck size={12} color="#FB8B3F" />}
                    </View>
                  )}
                </View>
              </React.Fragment>
            );
          })}

          {isOtherTyping && (
            <View className="self-start ml-1 mt-2">
               <View className={`px-4 py-2 rounded-full ${isDark ? 'bg-stone-900' : 'bg-white shadow-sm'}`}>
                  <Text className="text-[10px] font-plus-bold text-primary uppercase">Digitando...</Text>
               </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className={`px-4 pb-10 pt-2 ${isDark ? 'bg-stone-950' : 'bg-[#F9F9F9]'}`}>
          {!matchId && !isFindingMatch ? (
             <View className={`p-6 rounded-[2.5rem] items-center gap-4 ${isDark ? 'bg-stone-900' : 'bg-white shadow-lg border border-stone-50'}`}>
                <ShieldAlert color="#FB8B3F" size={32} />
                <View>
                  <Text className={`text-center font-plus-bold text-base ${isDark ? 'text-white' : 'text-stone-900'}`}>Aguardando Conexão</Text>
                  <Text className={`text-center font-plus-medium text-xs opacity-50 mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    Para enviar mensagens, vocês precisam estar conectados via Match ou Solicitação aceita.
                  </Text>
                </View>
             </View>
          ) : (
            <View className={`flex-row items-center gap-2 p-2 rounded-[2rem] ${isDark ? 'bg-stone-900 border border-stone-800' : 'bg-white shadow-xl border border-stone-50'}`}>
              <TouchableOpacity className="p-3 rounded-full bg-primary/10 active:scale-90">
                <Plus color="#FB8B3F" size={22} />
              </TouchableOpacity>
              
              <TextInput 
                className={`flex-1 font-plus-medium py-3 text-[15px] ${isDark ? 'text-white' : 'text-stone-900'}`}
                placeholder="Escreva algo..."
                placeholderTextColor={isDark ? '#57534E' : '#A8A29E'}
                value={input}
                onChangeText={(t) => { setInput(t); sendTyping(); }}
                onSubmitEditing={handleSend}
                multiline
              />
              
              <TouchableOpacity className="p-2">
                <Smile color={isDark ? '#A8A29E' : '#78716C'} size={24} />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleSend}
                disabled={!input.trim() || !matchId}
                className={`w-12 h-12 rounded-full items-center justify-center active:scale-95 ${input.trim() && matchId ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-stone-200'}`}
              >
                <Send color="white" size={20} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
