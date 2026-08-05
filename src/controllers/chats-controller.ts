import { router } from '../main.ts';
import AuthController from './auth-controller.ts';
import SocketTransport from '../core/socket-transport.ts';

import type { ChatsView as ChatsViewType } from '../views/chats';
import type { ChatsModel as ChatsModelType } from '../models/chats-model';
import type { Chat, ChatLastMessage, ChatListItem, ChatMessage, ChatTokenResponse } from '../types/api.ts';
import { formatTime } from '../utils/formatTime.ts';
import { getResourceLink } from '../utils/getResourceLink.ts';

export class ChatsController {
  private view: ChatsViewType;
  private model: ChatsModelType;
  private currentSocket: SocketTransport | null = null;
  private messages: ChatMessage[] = [];

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

    this.view.on('chats:change-avatar', (data) => {
      this.onChangeAvatar(data as { chatId: number, avatar: File });
    })

    this.view.on('chats:send-message', (data) => {
      this.onSendMessage(data as { content: string });
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

    this.model.getChatUsers(chatId).then((users) => {
      this.view.setProps({ chatUsers: users, chatUsersCount: users.length });
    })

    this.view.setProps({
      selectedChatId: chatId,
      chatTitle: chats.find((chat) => chat.id === chatId)?.title,
      chatAvatar: chats.find((chat) => chat.id === chatId)?.avatar,
      chats,
    });

    this.connectToChat(chatId);
  }

  private connectToChat(chatId: number) {
    this.disconnectFromChat();
    this.messages = [];

    const user = AuthController.getUser() as { id: number } | null;

    if (!user) {
      return;
    }

    this.model.getToken(chatId)
      .then((data) => {
        const token = (data as ChatTokenResponse[])[0]?.token ?? (data as ChatTokenResponse).token;

        if (!token) {
          throw new Error('Failed to get chat token');
        }

        this.currentSocket = new SocketTransport({ userId: user.id, chatId, token });
        this.bindSocketEvents();
        this.currentSocket.connect();
        this.currentSocket.requestOldMessages(0);
      })
      .catch((error) => {
        console.error('Failed to connect to chat:', error);
      });
  }

  private bindSocketEvents() {
    const socket = this.currentSocket;

    if (!socket) {
      return;
    }

    socket.on('message', (message) => {
      this.onNewMessage(message as ChatMessage);
    });

    socket.on('list', (list) => {
      this.onHistory(list as ChatMessage[]);
    });
  }

  private onNewMessage(message: ChatMessage) {
    const user = AuthController.getUser() as { id: number } | null;
    const isOwn = user?.id === message.user_id;

    const enriched = { ...message, isOwn };
    const existing = this.messages.find((msg) => msg.id === enriched.id);

    if (existing) {
      return;
    }

    this.messages.push(enriched);
    this.updateMessages();
  }

  private onHistory(messages: ChatMessage[]) {
    const user = AuthController.getUser() as { id: number } | null;
    const normalized = messages
      .slice()
      .reverse()
      .map((message) => ({ ...message, isOwn: user?.id === message.user_id }));

    this.messages = normalized;
    this.updateMessages();
  }

  private updateMessages() {
    this.view.setProps({ messages: this.messages });
  }

  private disconnectFromChat() {
    if (this.currentSocket) {
      this.currentSocket.close();
      this.currentSocket = null;
    }
  }

  private onSendMessage(data: { content: string }) {
    const content = data.content?.trim();

    if (!content || !this.currentSocket) {
      return;
    }

    this.currentSocket.sendMessage(content);
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
        this.loadChats();
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
        this.loadChats();
        this.view.setProps({ activeModal: null });
      });
  }

  onRemoveChat(chatId: number) {
    this.model.removeChat(chatId).then(() => {
      this.loadChats();
    })
  }

  onChangeAvatar({ chatId, avatar }: { chatId: number, avatar: File }) {
    const formData = new FormData();
    formData.append('chatId', String(chatId))
    formData.append('avatar', avatar);
    this.model.changeAvatar(formData).then((chat) => {
      const avatar = (chat as Chat).avatar;
      this.view.setProps({ chatAvatar: getResourceLink(avatar) });
      this.loadChats();
    })
  }

  private updateChatsList(chats: Chat[]) {
    const currentSelectedId = this.view.getSelectedChatId();
    const selectedChatId = chats.some(chat => chat.id === currentSelectedId)
      ? currentSelectedId
      : (chats[0]?.id ?? null);
    const chatList = chats.map((chat) => this.mapChatToListItem(chat, selectedChatId));

    if (selectedChatId) {
      this.onSelectChat(selectedChatId);
    }

    this.view.setProps({
      chats: chatList,
      selectedChatId: selectedChatId,
      chatTitle: chatList.find((chat) => chat.id === selectedChatId)?.title,
      chatAvatar: chatList.find((chat) => chat.id === selectedChatId)?.avatar,
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
