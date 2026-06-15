import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useChat } from '../useChat';
import socketService from '../../services/socket';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('../../services/socket');
jest.mock('../../services/api');
jest.mock('../../context/AuthContext');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useChat', () => {
  const mockUser = { id: 'user1' };
  const matchId = 'match123';

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (api.get as jest.Mock).mockResolvedValue({ data: [] });
    (socketService.connect as jest.Mock).mockResolvedValue(undefined);
  });

  it('should fetch history on mount', async () => {
    const history = [{ messageId: '1', senderId: 'user2', content: 'Hi', createdAt: new Date().toISOString() }];
    (api.get as jest.Mock).mockResolvedValue({ data: history });

    const { result } = renderHook(() => useChat({ matchId }), { wrapper });

    await waitFor(() => {
      expect(result.current.messages).toEqual(history);
    });

    expect(api.get).toHaveBeenCalledWith('/social/chat/directs/match123/history');
  });

  it('should subscribe to socket topic on mount', async () => {
    renderHook(() => useChat({ matchId }), { wrapper });

    await waitFor(() => {
      expect(socketService.connect).toHaveBeenCalled();
      expect(socketService.subscribe).toHaveBeenCalledWith('directs/match123', expect.any(Function));
    });
  });

  it('should send a message', async () => {
    const { result } = renderHook(() => useChat({ matchId }), { wrapper });

    await act(async () => {
      result.current.sendMessage('Hello world');
    });

    expect(socketService.sendMessage).toHaveBeenCalledWith('directs/match123', expect.objectContaining({
      content: 'Hello world',
      type: 'CHAT'
    }));

    expect(result.current.messages).toContainEqual(expect.objectContaining({
      content: 'Hello world',
      senderId: 'user1'
    }));
  });

  it('should handle incoming messages', async () => {
    let messageHandler: (payload: any) => void = () => {};
    (socketService.subscribe as jest.Mock).mockImplementation((topic, handler) => {
      messageHandler = handler;
    });

    const { result } = renderHook(() => useChat({ matchId }), { wrapper });

    await waitFor(() => {
      expect(socketService.subscribe).toHaveBeenCalled();
    });

    act(() => {
      messageHandler({
        messageId: 'new1',
        senderId: 'user2',
        content: 'Hey there',
        createdAt: new Date().toISOString(),
        type: 'CHAT'
      });
    });

    expect(result.current.messages).toContainEqual(expect.objectContaining({
      content: 'Hey there',
      senderId: 'user2'
    }));
  });

  it('should handle typing indicator', async () => {
    let messageHandler: (payload: any) => void = () => {};
    (socketService.subscribe as jest.Mock).mockImplementation((topic, handler) => {
      messageHandler = handler;
    });

    const { result } = renderHook(() => useChat({ matchId }), { wrapper });

    await waitFor(() => {
        expect(socketService.subscribe).toHaveBeenCalled();
    });

    act(() => {
      messageHandler({
        senderId: 'user2',
        type: 'TYPING'
      });
    });

    expect(result.current.isOtherTyping).toBe(true);
  });
});
