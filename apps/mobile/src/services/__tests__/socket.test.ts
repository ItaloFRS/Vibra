import socketService from '../socket';
import { Client } from '@stomp/stompjs';
import * as SecureStore from 'expo-secure-store';

const mockClient = {
  activate: jest.fn(),
  deactivate: jest.fn(),
  subscribe: jest.fn(),
  publish: jest.fn(),
  connected: false,
  onConnect: null as any,
  onStompError: null as any,
  onWebSocketClose: null as any,
};

jest.mock('@stomp/stompjs', () => ({
  Client: jest.fn(() => mockClient),
}));

jest.mock('sockjs-client', () => jest.fn());
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue('fake-token'),
}));

describe('SocketService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    socketService.__reset();
    mockClient.connected = false;
    mockClient.onConnect = null;
  });

  it('should attempt to connect with correct headers', async () => {
    const connectPromise = socketService.connect();
    
    // Wait a bit for the internal promise to reach new Client(...)
    await new Promise(resolve => setTimeout(resolve, 0));

    // Simulate connection success
    if (mockClient.onConnect) {
      mockClient.onConnect({});
    }
    
    await connectPromise;

    expect(Client).toHaveBeenCalledWith(expect.objectContaining({
      connectHeaders: {
        Authorization: 'Bearer fake-token'
      }
    }));
    expect(mockClient.activate).toHaveBeenCalled();
  });

  it('should subscribe to a topic', async () => {
    const onMessage = jest.fn();
    
    const connectPromise = socketService.connect();
    await new Promise(resolve => setTimeout(resolve, 0));
    if (mockClient.onConnect) {
      mockClient.onConnect({});
    }
    await connectPromise;

    mockClient.connected = true;
    await socketService.subscribe('test-topic', onMessage);

    expect(mockClient.subscribe).toHaveBeenCalledWith(
      '/topic/test-topic',
      expect.any(Function)
    );
  });

  it('should send a message when connected', async () => {
    const connectPromise = socketService.connect();
    await new Promise(resolve => setTimeout(resolve, 0));
    if (mockClient.onConnect) {
      mockClient.onConnect({});
    }
    await connectPromise;

    mockClient.connected = true;
    
    const payload = {
      senderId: 'user1',
      content: 'Hello',
    };

    socketService.sendMessage('event/123', payload);

    expect(mockClient.publish).toHaveBeenCalledWith({
      destination: '/app/chat/event/123',
      body: JSON.stringify(payload)
    });
  });
});
