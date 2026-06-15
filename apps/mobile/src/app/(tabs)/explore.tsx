import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin, 
  Bell, 
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react-native';
import api from '../../services/api';
import SearchBar from '../../components/SearchBar';
import EventCard from '../../components/EventCard';
import { useEventSearch } from '../../hooks/useEventSearch';
import { useDebounce } from '../../hooks/useDebounce';
import { useTheme } from '../../context/ThemeContext';

export default function ExploreScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Fetch Categorias do Backend
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await api.get('/events/categories');
        const data = response.data || [];
        return data.length > 0 ? data : ['Festa Noturna', 'São João | Forró', 'Futebol', 'Esportes', 'Cultural', 'Outros'];
      } catch (error) {
        return ['Festa Noturna', 'São João | Forró', 'Futebol', 'Esportes', 'Cultural', 'Outros'];
      }
    }
  });

  const allCategories = useMemo(() => ['Todas', ...categories], [categories]);
  
  // Datas Dinâmicas
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDay] = useState(today.getDate());
  
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
    if (newDate.getMonth() === today.getMonth() && newDate.getFullYear() === today.getFullYear()) {
      setSelectedDay(today.getDate());
    } else {
      setSelectedDay(1);
    }
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        weekday: date.toLocaleDateString('pt-BR', { weekday: 'short' }).split('.')[0],
        fullDate: date
      });
    }
    return days;
  }, [currentDate]);

  const currentMonthYear = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { 
    data: events, 
    isLoading: isLoadingEvents, 
    refetch: refetchEvents, 
    isRefetching: isRefetchingEvents 
  } = useEventSearch({ 
    query: debouncedSearch, 
    category: activeCategory === 'Todas' ? undefined : activeCategory
  });

  const { data: userInterests } = useQuery({
    queryKey: ['interests'],
    queryFn: async () => {
      const response = await api.get('/social/interests');
      return response.data || [];
    }
  });

  const favoriteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await api.post(`/social/events/${eventId}/favorite`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    }
  });

  const onRefresh = () => {
    refetchEvents();
  };

  const handleEventPress = (eventId: string) => {
    router.push({ pathname: '/events/[id]', params: { id: eventId } });
  };

  const isEventFavorite = (eventId: string) => {
    return userInterests?.some((fav: any) => (fav.id === eventId || fav.eventId === eventId));
  };

  const partitionedEvents = useMemo(() => {
    if (!events) return { selectedDay: [], upcoming: [], past: [] };

    const selectedDayEvents: any[] = [];
    const upcomingEvents: any[] = [];
    const pastEvents: any[] = [];
    const now = new Date();

    events.forEach((event: any) => {
      const eDate = new Date(event.eventDate);
      const isPast = eDate < now;
      
      const isSelectedDay = 
        eDate.getDate() === selectedDate && 
        eDate.getMonth() === currentDate.getMonth() &&
        eDate.getFullYear() === currentDate.getFullYear();

      if (isSelectedDay) {
        selectedDayEvents.push(event);
      } else if (isPast) {
        pastEvents.push(event);
      } else {
        upcomingEvents.push(event);
      }
    });

    return { 
      selectedDay: selectedDayEvents, 
      upcoming: upcomingEvents.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()),
      past: pastEvents.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    };
  }, [events, selectedDate, currentDate]);

  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const gridDays = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      gridDays.push(<View key={`empty-${i}`} className="w-[14.28%] aspect-square" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const hasEvent = events?.some((e: any) => {
        const eDate = new Date(e.eventDate);
        return eDate.getDate() === d && eDate.getMonth() === month && eDate.getFullYear() === year;
      });

      gridDays.push(
        <TouchableOpacity 
          key={`day-${d}`} 
          onPress={() => {
            setSelectedDay(d);
          }}
          className="w-[14.28%] aspect-square items-center justify-center p-1"
        >
          <View className={`w-full h-full items-center justify-center rounded-full ${isToday ? 'bg-[#fb8b3f]' : ''} ${selectedDate === d && !isToday ? 'border border-[#fb8b3f]' : ''}`}>
            <Text className={`font-plus-bold ${isToday ? 'text-white' : (isDark ? 'text-stone-300' : 'text-[#482603]')}`}>{d}</Text>
            {hasEvent && (
              <View className={`w-1 h-1 rounded-full mt-0.5 ${isToday ? 'bg-white' : 'bg-[#954400]'}`} />
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return gridDays;
  };

  const renderCategoryChip = (category: string) => {
    const isActive = activeCategory === category;
    return (
      <TouchableOpacity 
        key={category} 
        onPress={() => setActiveCategory(category)} 
        activeOpacity={0.8} 
        className="mr-2"
      >
        <View className={`px-6 py-2 rounded-full ${isActive ? (isDark ? 'bg-primary-container' : 'bg-[#954400]') : (isDark ? 'bg-stone-800' : 'bg-[#ffd5b4]')}`}>
          <Text className={`text-sm font-plus-bold ${isActive ? (isDark ? 'text-stone-950' : 'text-white') : (isDark ? 'text-stone-400' : 'text-[#482603]')}`}>
            {category}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCalendarDay = (dayObj: any) => {
    const isActive = selectedDate === dayObj.day;
    return (
      <TouchableOpacity 
        key={dayObj.day}
        onPress={() => setSelectedDay(dayObj.day)}
        className={`flex-shrink-0 w-16 h-20 items-center justify-center rounded-2xl mr-3 border ${
          isActive 
            ? 'bg-[#fb8b3f] border-transparent shadow-md' 
            : (isDark ? 'bg-stone-900 border-stone-800' : 'bg-[#ffeee2] border-[#d9a274]/20')
        }`}
      >
        <Text className={`text-[10px] uppercase tracking-widest font-plus-bold ${isActive ? 'text-[#1a0700]' : (isDark ? 'text-stone-500' : 'text-[#482603] opacity-60')}`}>
          {dayObj.weekday}
        </Text>
        <Text className={`text-lg font-plus-extrabold mt-1 ${isActive ? 'text-[#1a0700]' : (isDark ? 'text-stone-200' : 'text-[#482603]')}`}>
          {dayObj.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-stone-950' : 'bg-background'}`}>
      {/* TopAppBar */}
      <View className={`pt-14 pb-4 px-6 ${isDark ? 'bg-stone-950' : 'bg-background'} flex-row justify-between items-center`}>
        <View className="flex-row items-center">
          <CalendarIcon size={24} color={isDark ? '#FB8B3F' : '#954400'} />
          <Text className={`text-2xl font-plus-bold ${isDark ? 'text-primary-container' : 'text-primary'} ml-3 tracking-tighter`}>
            Próximos Eventos
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/profile')}
          className="w-10 h-10 rounded-full items-center justify-center overflow-hidden border-2 border-[#fb8a3f00]"
        >
          <Image 
            source={require('../../../assets/Monograma-l.png')} 
            className="w-full h-full"
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className={isDark ? 'bg-stone-950' : 'bg-background'}
        showsVerticalScrollIndicator={false} 
        refreshControl={<RefreshControl refreshing={isRefetchingEvents} onRefresh={onRefresh} tintColor="#FB8B3F" />} 
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-6 py-4 space-y-8">
          
          <SearchBar 
            placeholder="Buscar eventos, festas ou shows..." 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
          />

          {/* Calendar Section */}
          <View>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Text className={`font-plus-bold text-lg capitalize ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>{currentMonthYear}</Text>
                <View className="flex-row ml-4 space-x-2">
                  <TouchableOpacity 
                    onPress={() => changeMonth(-1)}
                    className={`p-1 ${isDark ? 'bg-stone-900' : 'bg-surface-container-low'} rounded-full`}
                  >
                    <ChevronLeft size={20} color={isDark ? '#FB8B3F' : '#954400'} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => changeMonth(1)}
                    className={`p-1 ${isDark ? 'bg-stone-900' : 'bg-surface-container-low'} rounded-full`}
                  >
                    <ChevronRight size={20} color={isDark ? '#FB8B3F' : '#954400'} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowFullCalendar(true)}>
                <Text className={`font-plus-semibold text-sm ${isDark ? 'text-primary-container' : 'text-primary'}`}>Ver tudo</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
              <View className="flex-row py-2">
                {calendarDays.map(renderCalendarDay)}
              </View>
            </ScrollView>
          </View>

          {/* Quick Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
            <View className="flex-row">
              {allCategories.map(renderCategoryChip)}
            </View>
          </ScrollView>

          {isLoadingEvents ? (
            <ActivityIndicator size="large" color="#FB8B3F" className="mt-10" />
          ) : (
            <View className="mt-4 space-y-10">
              
              <View>
                <Text className={`text-xl font-plus-ebold mb-4 px-1 ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>
                  Eventos do dia {selectedDate}
                </Text>
                {partitionedEvents.selectedDay.length > 0 ? (
                  partitionedEvents.selectedDay.map((event: any) => (
                    <EventCard 
                      key={event.id}
                      event={event}
                      variant="list"
                      onPress={handleEventPress}
                      onFavorite={(id) => favoriteMutation.mutate(id)}
                      isFavorite={isEventFavorite(event.id)}
                    />
                  ))
                ) : (
                  <View className={`rounded-2xl p-6 items-center border border-dashed ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-surface-container-low border-outline-variant/30'}`}>
                    <Text className={`font-plus-medium opacity-60 ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Nenhum evento para este dia.</Text>
                  </View>
                )}
              </View>

              {partitionedEvents.upcoming.length > 0 && (
                <View>
                  <Text className={`text-xl font-plus-ebold mb-4 px-1 ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>Próximos Eventos</Text>
                  {partitionedEvents.upcoming.map((event: any) => (
                    <EventCard 
                      key={event.id}
                      event={event}
                      variant="list"
                      onPress={handleEventPress}
                      onFavorite={(id) => favoriteMutation.mutate(id)}
                      isFavorite={isEventFavorite(event.id)}
                    />
                  ))}
                </View>
              )}

              {partitionedEvents.past.length > 0 && (
                <View>
                  <Text className={`text-xl font-plus-ebold mb-4 px-1 opacity-40 ${isDark ? 'text-stone-500' : 'text-on-surface'}`}>Já passaram</Text>
                  {partitionedEvents.past.map((event: any) => (
                    <EventCard 
                      key={event.id}
                      event={event}
                      variant="list"
                      onPress={handleEventPress}
                      onFavorite={(id) => favoriteMutation.mutate(id)}
                      isFavorite={isEventFavorite(event.id)}
                    />
                  ))}
                </View>
              )}

            </View>
          )}
        </View>
      </ScrollView>

      {/* Full Calendar Modal */}
      <Modal visible={showFullCalendar} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className={`rounded-t-[3rem] p-8 h-[75%] ${isDark ? 'bg-stone-900' : 'bg-surface'}`}>
            <View className="flex-row justify-between items-center mb-8">
              <View>
                <Text className={`text-2xl font-plus-ebold ${isDark ? 'text-stone-50' : 'text-on-surface'}`}>Calendário</Text>
                <View className="flex-row items-center mt-1">
                  <Text className={`text-sm font-plus-medium capitalize ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>{currentMonthYear}</Text>
                  <View className="flex-row ml-4 space-x-2">
                    <TouchableOpacity 
                      onPress={() => changeMonth(-1)}
                      className={`p-1 rounded-full ${isDark ? 'bg-stone-800' : 'bg-surface-container-low'}`}
                    >
                      <ChevronLeft size={16} color={isDark ? '#FB8B3F' : '#954400'} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => changeMonth(1)}
                      className={`p-1 rounded-full ${isDark ? 'bg-stone-800' : 'bg-surface-container-low'}`}
                    >
                      <ChevronRight size={16} color={isDark ? '#FB8B3F' : '#954400'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowFullCalendar(false)} className={`p-2 rounded-full ${isDark ? 'bg-stone-800' : 'bg-surface-container-low'}`}>
                <X color={isDark ? '#FB8B3F' : '#954400'} size={24} />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row mb-4">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                <Text key={i} className={`w-[14.28%] text-center text-[10px] font-plus-bold opacity-40 ${isDark ? 'text-stone-500' : 'text-on-surface-variant'}`}>{day}</Text>
              ))}
            </View>

            <View className="flex-row flex-wrap">
              {renderCalendarGrid()}
            </View>

            <View className="mt-auto">
              <View className="flex-row items-center mb-6 px-2">
                <View className={`w-2 h-2 rounded-full mr-2 ${isDark ? 'bg-primary-container' : 'bg-primary'}`} />
                <Text className={`text-[10px] font-plus-bold ${isDark ? 'text-stone-400' : 'text-on-surface-variant'}`}>Dias com eventos programados</Text>
              </View>

              <TouchableOpacity 
                className={`py-5 rounded-2xl items-center mb-4 ${isDark ? 'bg-primary-container' : 'bg-primary'}`}
                onPress={() => setShowFullCalendar(false)}
              >
                <Text className={`font-plus-ebold uppercase tracking-widest ${isDark ? 'text-stone-950' : 'text-white'}`}>Confirmar Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
