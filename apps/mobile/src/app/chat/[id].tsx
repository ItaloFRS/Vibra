import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Keyboard,
  Modal
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send, PlusCircle, CheckCheck, Smile, Users, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useChat } from '../../hooks/useChat';

export default function ChatScreen() {
  const { id, eventId, channelName, eventName } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const [input, setInput] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isParticipantsModalVisible, setIsParticipantsModalVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const {
    messages,
    sendMessage,
    sendTyping,
    onlineUsers,
    typingUsers,
    isLoading
  } = useChat({ channelId: id as string, eventId: eventId as string });

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
    return () => showSubscription.remove();
  }, []);

  const handleInputChange = (text: string) => {
    setInput(text);
    sendTyping();
  };

  const handleSend = () => {
    if (!input.trim() || !user || !user.id) return;
    sendMessage(input);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
    setShowScrollButton(!isCloseToBottom);
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const typingText = useMemo(() => {
    const names = Object.values(typingUsers).map(u => u.name.split(' ')[0]);
    if (names.length === 0) return null;
    if (names.length === 1) return `${names[0]} está digitando...`;
    if (names.length === 2) return `${names[0]} e ${names[1]} estão digitando...`;
    return 'Várias pessoas estão digitando...';
  }, [typingUsers]);

  if (isLoading && messages.length === 0) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
        <ActivityIndicator color="#FB8B3F" />
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'}`} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Participants Modal */}
      <Modal
        visible={isParticipantsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsParticipantsModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View 
            style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
            className={`h-[70%] w-full ${isDark ? 'bg-stone-900' : 'bg-white'} p-8 shadow-2xl`}
          >
            <View className="flex-row items-center justify-between mb-8">
              <View>
                <Text className={`text-2xl font-plus-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>Participantes</Text>
                <Text className={`text-sm font-plus-medium opacity-60 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {onlineUsers.length} usuários online agora
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setIsParticipantsModalVisible(false)}
                className={`p-3 rounded-full ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}
              >
                <X color={isDark ? 'white' : 'black'} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-4">
                {onlineUsers.map((u) => (
                  <TouchableOpacity 
                    key={u.id}
                    onPress={() => {
                      setIsParticipantsModalVisible(false);
                      router.push(`/user/${u.id}`);
                    }}
                    className={`flex-row items-center gap-4 p-4 rounded-3xl ${isDark ? 'bg-stone-800/50' : 'bg-stone-50'}`}
                  >
                    <View className="relative">
                      <Image 
                        source={{ uri: u.photoUrl || 'https://via.placeholder.com/100' }} 
                        className="w-12 h-12 rounded-full border-2 border-primary/20"
                      />
                      <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-stone-900 rounded-full" />
                    </View>
                    <View className="flex-1">
                      <Text className={`font-plus-bold text-base ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                        {u.fullName} {u.id === user?.id ? '(você)' : ''}
                      </Text>
                      <Text className={`text-xs font-plus-medium opacity-50 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {u.id === user?.id ? 'Online agora' : 'No canal agora'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View className={`shadow-sm z-50 border-b ${isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-background/80 border-outline-variant/10'}`}>
          <TouchableOpacity 
            onPress={() => setIsParticipantsModalVisible(true)}
            activeOpacity={0.7}
            className="flex-row items-center px-6 py-4 gap-4"
          >
            <TouchableOpacity onPress={() => router.back()} className={`p-2 rounded-full ${isDark ? 'bg-stone-900' : 'bg-surface-container-low'}`}>
              <ArrowLeft color={isDark ? '#FB8B3F' : '#954400'} size={24} />
            </TouchableOpacity>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className={`font-plus-bold text-lg leading-tight ${isDark ? 'text-stone-100' : 'text-on-surface'}`}>{channelName || 'Chat'}</Text>
                <View className="flex-row items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <Text className="text-[9px] font-plus-bold text-emerald-500 uppercase">{onlineUsers.length}</Text>
                </View>
              </View>
              <Text className={`text-[10px] font-plus-bold uppercase tracking-widest opacity-80 ${isDark ? 'text-primary-container' : 'text-primary'}`}>{eventName}</Text>
            </View>
            <TouchableOpacity className={`p-2 rounded-full ${isDark ? 'bg-stone-900' : 'bg-surface-container-low'}`}>
              <Users color={isDark ? '#FB8B3F' : '#954400'} size={24} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollRef}
          className={`flex-1 px-6 ${isDark ? 'bg-stone-950' : 'bg-background'}`}
          contentContainerStyle={{ paddingVertical: 32, gap: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={() => {
             scrollRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {messages.map((msg, index) => {
            if (msg.isSystem) {
              return (
                <View key={msg.messageId || index} className="items-center my-2">
                  <View className={`px-4 py-1.5 rounded-full ${isDark ? 'bg-stone-900/50' : 'bg-stone-100/50'}`}>
                    <Text className={`text-[10px] font-plus-bold uppercase tracking-widest text-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                      {msg.content}
                    </Text>
                  </View>
                </View>
              );
            }

            const isMine = msg.senderId === user?.id;
            return (
              <View key={msg.messageId || index} className={`flex-row ${isMine ? 'justify-end' : 'items-end'} gap-3 max-w-[85%] ${isMine ? 'ml-auto' : ''}`}>
                {!isMine && (
                  <TouchableOpacity onPress={() => router.push(`/user/${msg.senderId}`)}>
                    <Image 
                      className={`w-10 h-10 rounded-full border ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-surface-container-low border-outline-variant/10'}`} 
                      source={{ uri: msg.senderPhotoUrl || 'https://via.placeholder.com/100' }} 
                    />
                  </TouchableOpacity>
                )}
                <View className={`flex flex-col gap-1 ${isMine ? 'items-end' : ''}`}>
                  {!isMine && (
                    <TouchableOpacity onPress={() => router.push(`/user/${msg.senderId}`)}>
                      <Text className={`text-[11px] font-plus-bold ml-2 mb-1 ${isDark ? 'text-primary-container' : 'text-primary'}`}>{msg.senderName}</Text>
                    </TouchableOpacity>
                  )}
                  {isMine ? (
                    <View 
                      style={{ borderRadius: 24, borderTopRightRadius: 4 }}
                      className="bg-primary px-6 py-4 shadow-md"
                    >
                      <Text className="text-white text-[15px] leading-relaxed font-plus-medium">{msg.content}</Text>
                    </View>
                  ) : (
                    <View 
                      style={{ borderRadius: 24, borderTopLeftRadius: 4 }}
                      className={`px-6 py-4 shadow-sm border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-lowest border-outline-variant/10'}`}
                    >
                      <Text className={`text-[15px] leading-relaxed font-plus ${isDark ? 'text-stone-200' : 'text-on-surface'}`}>{msg.content}</Text>
                    </View>
                  )}

                  <View className={`flex-row items-center gap-1.5 mt-2 ${isMine ? 'mr-2' : 'ml-2'}`}>
                     <Text className={`text-[10px] font-plus-bold opacity-40 uppercase tracking-widest ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>
                       {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                     </Text>
                     {isMine && <CheckCheck size={14} color="#FB8B3F" />}
                  </View>
                </View>
              </View>
            );
          })}

          {typingText && (
            <View className="flex-row items-center gap-2 self-start ml-2 mb-4">
              <View className={`flex-row gap-1 px-6 py-3 rounded-full rounded-tl-sm border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-lowest border-outline-variant/10'}`}>
                <View className="flex-row gap-1 items-center mr-2">
                    <View className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    <View className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                 </View>
                <Text className={`text-xs font-plus-bold ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>{typingText}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {showScrollButton && (
          <TouchableOpacity 
            onPress={scrollToBottom}
            className={`absolute bottom-32 right-6 w-12 h-12 rounded-full items-center justify-center shadow-xl border ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-outline-variant/10'}`}
          >
            <View style={{ transform: [{ rotate: '90deg' }] }}>
               <ArrowLeft color={isDark ? '#FB8B3F' : '#954400'} size={24} />
            </View>
          </TouchableOpacity>
        )}

        <View className={`px-4 pb-10 pt-4 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
          <View className={`max-w-screen-md mx-auto flex-row items-center gap-3 p-2 pl-6 rounded-full shadow-2xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-lowest border-outline-variant/10'}`}>
             <TouchableOpacity className={`p-1 active:scale-90`}>
               <PlusCircle color={isDark ? '#FB8B3F' : '#954400'} size={28} />
             </TouchableOpacity>
             <View className="flex-1">
               <TextInput 
                 value={input}
                 onChangeText={handleInputChange}
                 className={`w-full bg-transparent px-2 py-4 text-base font-plus-medium ${isDark ? 'text-stone-100' : 'text-on-surface'}`}
                 placeholder="Digite no canal..."
                 placeholderTextColor={isDark ? '#57534E' : '#7D522B80'}
                 onSubmitEditing={handleSend}
                 multiline={false}
               />
             </View>
             
             <View className="flex-row items-center gap-1 pr-1">
                <TouchableOpacity className="p-2 active:scale-90">
                  <Smile color={isDark ? '#A8A29E' : '#7D522B'} size={24} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSend}
                  className={`w-14 h-14 items-center justify-center rounded-full shadow-lg active:scale-95 ${isDark ? 'bg-primary-container' : 'bg-primary'}`}
                >
                  <Send color={isDark ? '#1A0700' : 'white'} size={24} />
                </TouchableOpacity>
             </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
