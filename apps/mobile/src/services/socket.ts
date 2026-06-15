import { Client, IStompSocket } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import * as SecureStore from 'expo-secure-store';

// Essential Polyfills for React Native + SockJS + STOMP
import { TextEncoder, TextDecoder } from 'text-encoding';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  (global as any).TextDecoder = TextDecoder;
}

// SockJS often looks for window.location
if (typeof window === 'undefined') {
  (global as any).window = global;
}
if (typeof window.location === 'undefined') {
  (window as any).location = { protocol: 'http:', host: '10.5.0.152:8080' };
}

const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'http://10.5.0.152:8080/ws'; 

export interface MessagePayload {
  channelId?: string;
  eventId?: string;
  senderId: string;
  content: string;
  matchId?: string;
  type?: 'CHAT' | 'TYPING' | 'READ_RECEIPT';
}

class SocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, any> = new Map();
  private connectionPromise: Promise<void> | null = null;

  /**
   * For testing purposes only
   */
  __reset() {
    this.disconnect();
    this.client = null;
    this.connectionPromise = null;
    this.subscriptions.clear();
  }

  async connect(): Promise<void> {
    if (this.client?.connected) {
      return Promise.resolve();
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise(async (resolve, reject) => {
      const token = await SecureStore.getItemAsync('token');

      this.client = new Client({
        webSocketFactory: () => new SockJS(WS_URL) as IStompSocket,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: (str) => {
          if (__DEV__) console.log('STOMP DEBUG:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = (frame) => {
        console.log('WebSocket Connected');
        this.connectionPromise = null;
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP error', frame.headers['message']);
        this.connectionPromise = null;
        reject(frame);
      };

      this.client.onWebSocketClose = () => {
        console.log('WebSocket Connection Closed');
        this.connectionPromise = null;
      };

      this.client.activate();
    });

    return this.connectionPromise;
  }

  async subscribe(topic: string, onMessageReceived: (msg: any) => void) {
    await this.connect();

    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic).unsubscribe();
    }

    console.log(`Subscribing to /topic/${topic}`);
    const subscription = this.client?.subscribe(`/topic/${topic}`, (message) => {
      onMessageReceived(JSON.parse(message.body));
    });

    this.subscriptions.set(topic, subscription);
  }

  unsubscribe(topic: string) {
    if (this.subscriptions.has(topic)) {
      console.log(`Unsubscribing from /topic/${topic}`);
      this.subscriptions.get(topic).unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  sendMessage(destination: string, payload: MessagePayload) {
    if (this.client?.connected) {
      this.client.publish({
        destination: `/app/chat/${destination}`,
        body: JSON.stringify(payload)
      });
    } else {
      console.error('Socket not connected. Attempting to reconnect...');
      this.connect().then(() => this.sendMessage(destination, payload));
    }
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.forEach((sub) => {
        if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe();
        }
      });
      this.subscriptions.clear();
      this.client.deactivate();
      this.client = null;
      this.connectionPromise = null;
      console.log('WebSocket Disconnected');
    }
  }
}

export default new SocketService();
