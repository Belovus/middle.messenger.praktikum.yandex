import { Block } from '../../core/block.ts';
import ChatsHTML from './chats.hbs?raw';
import { formDataToJSON } from '../../utils/formDataToJSON.ts';

import type { ChatListItem } from '../../types/api.ts';

export type ActiveModal = 'createChat' | 'addUser' | 'removeUser' | null;

interface ChatsViewProps {
  activeModal?: ActiveModal;
  selectedChatId?: number | null;
  isHeaderOptionsListOpen?: boolean;
  isBottomOptionsListOpen?: boolean;
  chats?: ChatListItem[];
}

export class ChatsView extends Block<ChatsViewProps> {
  static componentName = 'Chats';

  protected template = ChatsHTML;

  protected componentDidMount() {
    if (this.props.chats?.length === 0) {
      this.emit('chats:load');
    }
  }

  getSelectedChatId() {
    return this.props.selectedChatId ?? null;
  }

  getChats() {
    return this.props.chats ?? [];
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

      if (form === this.refs.removeUserForm) {
        this.emit('chats:remove-user', formData);
        return;
      }

      if (formData.message) {
        console.log(formData.message);
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

      if (this.refs.addUserOption?.contains(target)) {
        this.setProps({ activeModal: 'addUser', isHeaderOptionsListOpen: false });
        return;
      }

      if (this.refs.removeUserOption?.contains(target)) {
        this.setProps({ activeModal: 'removeUser', isHeaderOptionsListOpen: false });
        return;
      }

      if (this.refs.headerOptionsToggle?.contains(target)) {
        this.setProps({ isHeaderOptionsListOpen: !this.props.isHeaderOptionsListOpen });
        return;
      }

      if (this.refs.bottomOptionsToggle?.contains(target)) {
        this.setProps({ isBottomOptionsListOpen: !this.props.isBottomOptionsListOpen });
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

      if (this.props.isHeaderOptionsListOpen) {
        this.setProps({ isHeaderOptionsListOpen: false });
      }

      if (this.props.isBottomOptionsListOpen) {
        this.setProps({ isBottomOptionsListOpen: false });
      }
    },
  };

  private isModalCloseClick(target: HTMLElement) {
    const closeRefs = [
      this.refs.createChatCross,
      this.refs.addUserCross,
      this.refs.removeUserCross,
    ];

    return closeRefs.some((ref) => ref?.contains(target));
  }
}
