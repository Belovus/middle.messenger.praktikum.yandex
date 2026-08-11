import { Block } from '../../core/block.ts';
import ChatsHTML from './chats.hbs?raw';
import { formDataToJSON } from '../../utils/formDataToJSON.ts';

import type { ChatListItem, ChatMessage, ChatUsersResponse } from '../../types/api.ts';

export type ActiveModal = 'createChat' | 'addUser' | null;

interface ChatsViewProps {
  activeModal: ActiveModal;
  selectedChatId: number | null;
  selectedChat: ChatListItem | [];
  chats: ChatListItem[];
  chatUsers: ChatUsersResponse[];
  chatUsersCount: number;
  messages: ChatMessage[];
}

export class ChatsView extends Block<Partial<ChatsViewProps>> {
  static componentName = 'Chats';

  protected template = ChatsHTML;

  private searchChatQuery = '';

  // private searchUsersQuery = '';

  protected componentDidMount() {
    if (!this.props.chats) {
      this.emit('chats:load');
    }

    if (this.refs.messagesList) {
      this.refs.messagesList.scrollTop = this.refs.messagesList.scrollHeight;
    }

    if (this.refs.chatSearchInput) {
      (this.refs.chatSearchInput as HTMLInputElement).value = this.searchChatQuery;
    }
  }

  getSelectedChatId() {
    return this.props.selectedChatId ?? null;
  }

  getChats() {
    return this.props.chats ?? [];
  }

  getSelectedChat() {
    return this.props.selectedChat ?? null;
  }

  protected events = {
    submit: (event: Event): void => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = formDataToJSON(new FormData(form));

      if (form === this.refs.createChatForm) {
        this.emit('chats:create-chat', formData);
        return;
      }

      if (form === this.refs.addUserForm) {
        this.emit('chats:add-user', formData);
        return;
      }

      if (formData.message) {
        this.emit('chats:send-message', { content: String(formData.message) });
        form.reset();
      }
    },
    click: (event: Event): void => {
      const target = event.target as HTMLElement;

      const chatItem = target.closest('[data-chat-id]');
      if (chatItem) {
        const chatId = Number(chatItem.getAttribute('data-chat-id'));

        if (!Number.isNaN(chatId)) {
          this.emit('chats:select-chat', chatId);
        }

        return;
      }

      const userOptionsItem = target.closest('[data-user-login]');
      if (userOptionsItem) {
        const userLogin = String(userOptionsItem.getAttribute('data-user-login'));
        this.emit('chats:remove-user', { login: userLogin });
      }

      if (this.refs.addUserOption?.contains(target)) {
        this.setProps({ activeModal: 'addUser' });
        return;
      }

      if (this.refs.removeChatOption?.contains(target)) {
        this.emit('chats:remove-chat', this.props.selectedChatId)
      }

      if (this.refs.headerOptionsToggle?.contains(target)) {
        this.refs.headerOptionsToggleBlock.classList.toggle('chat__header-options-list--open');
        return;
      }

      if (this.refs.bottomOptionsToggle?.contains(target)) {
        this.refs.bottomOptionsToggleBlock.classList.toggle('chat__footer-options-list--open');
        return;
      }

      if (this.refs.infoOptionsList?.contains(target)) {
        this.refs.infoOptionsListBlock.classList.toggle('chat__header-info-options-list--open');
        return;
      }

      if (this.refs.createChatButton?.contains(target)) {
        this.setProps({ activeModal: 'createChat' });
        return;
      }

      if (this.isModalCloseClick(target)) {
        this.setProps({ activeModal: null });
        return;
      }

      if (this.refs.settingsLink?.contains(target)) {
        this.emit('chats:go-settings');
        return;
      }

      this.refs.infoOptionsListBlock.classList.remove('chat__header-info-options-list--open');
      this.refs.bottomOptionsToggleBlock.classList.remove('chat__footer-options-list--open');
      this.refs.headerOptionsToggleBlock.classList.remove('chat__header-options-list--open');
    },
    change: (event: Event): void => {
      const file = event.target as HTMLInputElement;
      if (file.files) {
        this.emit('chats:change-avatar', { chatId: this.props.selectedChatId, avatar: file.files[0] });
      }
    },
    input: (event: Event): void => {
      const target = event.target as HTMLInputElement;

      if (this.refs.chatSearchInput?.contains(target)) {
        this.searchChatQuery = String(target.value);
        this.emit('chats:search-chat', target.value);
      }

      // if (this.refs.login.contains(target)) {
      //   this.searchUsersQuery = String(target.value);
      //   this.emit('chats:search-users', target.value);
      // }
    }
  };

  private isModalCloseClick(target: HTMLElement) {
    const closeRefs = [
      this.refs.createChatCross,
      this.refs.addUserCross,
    ];

    return closeRefs.some((ref) => ref?.contains(target));
  }
}
