import { router } from '../main.ts';

import type { ChatsView as ChatsViewType } from '../views/chats';
import type { ChatsModel as ChatsModelType } from '../models/chats-model';
import type { Chat, ChatLastMessage, ChatListItem } from '../types/api.ts';
import { formatTime } from '../utils/formatTime.ts';
import { getResourceLink } from '../utils/getResourceLink.ts';

export class ChatsController {
  private view: ChatsViewType;
  private model: ChatsModelType;

  constructor(model: ChatsModelType, view: ChatsViewType) {
    this.model = model;
    this.view = view;

    this.bindEvents();
  }

  bindEvents() {
    this.view.on('chats:load', () => {
      this.loadChats();
    });

    this.view.on('chats:go-settings', () => {
      router.go('/settings');
    });

    this.view.on('chats:create-chat', (data) => {
      this.onCreateChat(data as { title: string });
    });

    this.view.on('chats:add-user', (data) => {
      this.onAddUser(data as { login: string });
    });

    this.view.on('chats:remove-user', (data) => {
      this.onRemoveUser(data as { login: string });
    });

    this.view.on('chats:select-chat', (chatId) => {
      this.onSelectChat(chatId as number);
    });

    this.view.on('chats:remove-chat', (chatId) => {
      this.onRemoveChat(chatId as number);
    })
  }

  loadChats() {
    this.model.getChats()
      .then((chats) => {
        this.updateChatsList(chats);
      })
      .catch((error) => {
        console.error('Failed to load chats:', error);
      });
  }

  onSelectChat(chatId: number) {
    const chats = this.view.getChats().map((chat) => ({
      ...chat,
      selected: chat.id === chatId,
    }));

    this.view.setProps({
      selectedChatId: chatId,
      chats,
    });
  }

  onCreateChat(data: { title: string }) {
    this.model.createChat(data).then(() => {
      this.view.setProps({ activeModal: null });
      this.loadChats();
    });
  }

  onAddUser(data: { login: string }) {
    const chatId = this.view.getSelectedChatId();

    if (!chatId) {
      return;
    }

    this.model.searchUser({ login: data.login })
      .then((users) => {
        const userId = (users as { id: number }[])[0]?.id;

        if (!userId) {
          throw new Error('User not found');
        }

        return this.model.addUsersToChat({ users: [userId], chatId });
      })
      .then(() => {
        this.view.setProps({ activeModal: null });
      });
  }

  onRemoveUser(data: { login: string }) {
    const chatId = this.view.getSelectedChatId();

    if (!chatId) {
      return;
    }

    this.model.searchUser({ login: data.login })
      .then((users) => {
        const userId = (users as { id: number }[])[0]?.id;

        if (!userId) {
          throw new Error('User not found');
        }

        return this.model.removeUsersFromChat({ users: [userId], chatId });
      })
      .then(() => {
        this.view.setProps({ activeModal: null });
      });
  }

  onRemoveChat(chatId: number) {
    this.model.removeChat(chatId).then(() => {
      this.loadChats();
    })
  }

  private updateChatsList(chats: Chat[]) {
    const currentSelectedId = this.view.getSelectedChatId();
    const selectedChatId = chats.some(chat => chat.id === currentSelectedId)
      ? currentSelectedId
      : (chats[0]?.id ?? null);
    const chatList = chats.map((chat) => this.mapChatToListItem(chat, selectedChatId));

    this.view.setProps({
      chats: chatList,
      selectedChatId: selectedChatId,
    });
  }

  private mapChatToListItem(chat: Chat, selectedChatId: number | null): ChatListItem {
    return {
      id: chat.id,
      title: chat.title,
      avatar: getResourceLink(chat.avatar),
      message: this.getLastMessagePreview(chat.last_message),
      time: formatTime(chat.last_message?.time),
      unreadCount: chat.unread_count,
      selected: chat.id === selectedChatId,
    };
  }

  private getLastMessagePreview(lastMessage?: ChatLastMessage): string {
    if (!lastMessage?.content) {
      return '';
    }

    return lastMessage.content;
  }

  getModel() {
    return this.model;
  }

  getContent() {
    return this.view.element();
  }
}
