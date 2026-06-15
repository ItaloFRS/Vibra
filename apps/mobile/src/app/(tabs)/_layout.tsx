import { Tabs } from 'expo-router';
import { Home, Search, Ticket, User, MessageSquare } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { GlassView } from '../../components/GlassView';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function TabLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const { token } = useAuth();

  const { data: unreadData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const response = await api.get('/social/chats/unread-count');
      return response.data;
    },
    enabled: !!token,
    refetchInterval: 3000, // Atualiza a cada 3 segundos para ser dinâmico
    refetchOnWindowFocus: true,
  });

  const unreadCount = unreadData?.unreadCount || 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#FB8B3F' : '#954400',
        tabBarInactiveTintColor: isDark ? '#A8A29E' : '#9C6D43',
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <GlassView 
            intensity={30} 
            tint={isDark ? 'dark' : 'light'} 
            borderTopLeftRadius={32}
            borderTopRightRadius={32}
            style={{ flex: 1 }}
          />
        ),
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans_700Bold',
          fontSize: 10,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Mensagens',
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#954400',
            color: 'white',
            fontFamily: 'PlusJakartaSans_700Bold',
            fontSize: 10,
          }
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color }) => <Ticket size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
