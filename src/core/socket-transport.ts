import { EventBus } from './event-bus.ts';

import type { ChatMessage } from '../types/api.ts';

const WS_URL = 'wss://ya-praktikum.tech/ws/chats';
const PING_INTERVAL = 30000;

export interface SocketOptions {
  userId: number;
  chatId: number;
  token: string;
}

export type WSSendType = 'message' | 'file' | 'sticker';

interface WSRequest {
  content?: string;
  type: WSSendType | 'get old' | 'ping';
}

class SocketTransport extends EventBus {
  private socket: WebSocket | null = null;
  private readonly userId: number;
  private readonly chatId: number;
  private readonly token: string;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private pending: WSRequest[] = [];

  constructor({ userId, chatId, token }: SocketOptions) {
    super();
    this.userId = userId;
    this.chatId = chatId;
    this.token = token;
  }

  connect() {
    if (this.socket) {
      return this;
    }

    this.socket = new WebSocket(`${WS_URL}/${this.userId}/${this.chatId}/${this.token}`);

    this.socket.addEventListener('open', () => {
      this.flushPending();
      this.emit('open');
      this.startPing();
    });

    this.socket.addEventListener('close', () => {
      this.pending = [];
      this.stopPing();
      this.emit('close');
    });

    this.socket.addEventListener('error', () => {
      this.emit('error', { message: `WebSocket error in chat ${this.chatId}` });
    });

    this.socket.addEventListener('message', (event) => this.handleMessage(event));

    return this;
  }

  sendMessage(content: string) {
    return this.send({ content, type: 'message' });
  }

  requestOldMessages(offset = 0) {
    return this.send({ content: String(offset), type: 'get old' });
  }

  close() {
    this.stopPing();
    this.pending = [];
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private handleMessage(event: MessageEvent) {
    let data;

    try {
      data = JSON.parse(event.data);
    } catch {
      return;
    }

    if (data.type === 'pong' || data.type === 'user connected') {
      return;
    }

    if (Array.isArray(data)) {
      this.emit('list', data);
      return;
    }

    this.emit('message', data as ChatMessage);
  }

  private send(payload: WSRequest) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
      return true;
    }

    if (this.socket?.readyState === WebSocket.CONNECTING) {
      this.pending.push(payload);
      return true;
    }

    console.warn('Socket not open, message dropped', payload);
    return false;
  }

  private flushPending() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const queued = this.pending;
    this.pending = [];
    queued.forEach((payload) => this.socket!.send(JSON.stringify(payload)));
  }

  private startPing() {
    if (this.pingInterval) {
      return;
    }

    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, PING_INTERVAL);
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

export default SocketTransport;
