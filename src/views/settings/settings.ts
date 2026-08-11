import { Block } from '../../core/block.ts';
import SettingsHTML from './settings.hbs?raw';
import { formDataToJSON } from '../../utils/formDataToJSON.ts';

import type { SETTINGS_CONFIG } from '../../configs/settings-config.ts';
import type { UserResponse } from '../../types/api.ts';

interface SettingsProps {
  type: 'SETTINGS' | 'CHANGE_PASSWORD'
  config: typeof SETTINGS_CONFIG;
  edit: boolean;
  settings?: UserResponse;
}

export class SettingsView extends Block<SettingsProps> {
  static componentName = 'Settings';

  protected template = SettingsHTML;

  private isSubmitting = false;

  protected componentDidMount() {
    if (!this.props.settings) {
      this.emit('settings:load');
    }
  }

  protected events = {
    click: (event: Event) => {
      if (this.refs.changeSettings?.contains(event.target as Node)) {
        event.preventDefault();
        this.setProps({ edit: !this.props.edit });
      }
      if (this.refs.cancel?.contains(event.target as Node)) {
        event.preventDefault();
        this.setProps({ edit: false, type: 'SETTINGS' });
      }
      if (this.refs.chatsLink?.contains(event.target as Node)) {
        event.preventDefault();
        this.emit('settings:go-chats');
      }
      if (this.refs.changePassword?.contains(event.target as Node)) {
        event.preventDefault();
        this.setProps({ edit: true, type: 'CHANGE_PASSWORD' });
      }
      if (this.refs.exit?.contains(event.target as Node)) {
        event.preventDefault();
        this.emit('settings:exit')
      }
    },
    submit: (event: Event) => {
      event.preventDefault();
      this.isSubmitting = true;
      const error = this.validateAll(event);
      this.isSubmitting = false;

      const formData = new FormData(event.target as HTMLFormElement);

      if (!error) {
        if (this.props.type === 'SETTINGS') {
          this.emit('settings:update', formDataToJSON(formData));
        }

        if (this.props.type === 'CHANGE_PASSWORD') {
          this.emit('settings:change-password', formDataToJSON(formData));
        }

        this.setProps({ edit: !this.props.edit });
      }
    },
    focusout: (event: Event) => {
      if (this.isSubmitting) return;
      this.validateOne(event);
    },
    change: (event: Event) => {
      const file = event.target as HTMLInputElement;
      if (file.files) {
        this.emit('settings:change-avatar', { avatar: file.files[0] });
      }
    }
  }
}
