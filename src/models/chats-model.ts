import { EventBus } from '../core/event-bus.ts';
import HttpTransport from '../core/http-transport.ts';

import type { Chat, ChatUsersResponse } from '../types/api.ts';

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

  async removeChat(chatId: number) {
    return ChatsApi.delete('/chats', { data: { chatId } });
  }

  async getChatUsers(chatId: number) {
    return ChatsApi.get(`/chats/${chatId}/users`) as Promise<ChatUsersResponse[]>;
  }

  async changeAvatar(data: FormData) {
    return ChatsApi.put('/chats/avatar', { data: data });
  }

  async getToken(chatId: number) {
    return ChatsApi.post(`/chats/token/${chatId}`) as Promise<unknown>;
  }
}
