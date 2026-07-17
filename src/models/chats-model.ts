import { EventBus } from '../core/event-bus.ts';
import HttpTransport from '../core/http-transport.ts';

import type { Chat } from '../types/api.ts';

const ChatsApi = new HttpTransport();

export class ChatsModel extends EventBus {
  async getChats() {
    return ChatsApi.get('/chats') as Promise<Chat[]>;
  }

  async createChat(data: { title: string }) {
    return ChatsApi.post('/chats', { data: data as Record<string, unknown> });
  }

  async searchUser(data: { login: string }) {
    return ChatsApi.post('/user/search', { data: data as Record<string, unknown> });
  }

  async addUsersToChat(data: { users: number[]; chatId: number }) {
    return ChatsApi.put('/chats/users', { data: data as Record<string, unknown> });
  }

  async removeUsersFromChat(data: { users: number[]; chatId: number }) {
    return ChatsApi.delete('/chats/users', { data: data as Record<string, unknown> });
  }
}
