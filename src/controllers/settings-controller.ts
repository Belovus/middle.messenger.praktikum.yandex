import { router } from '../main.ts';

import type { SettingsView as SettingsViewType } from '../views/settings';
import type { SettingsModel as SettingsModelType } from '../models/settings-model.ts';
import type { UserResponse, UserUpdateRequest, ChangePasswordRequest } from '../types/api.ts';
import { getResourceLink } from "../utils/getResourceLink.ts";

export class SettingsController {
  private view: SettingsViewType;
  private model: SettingsModelType;

  constructor(model: SettingsModelType, view: SettingsViewType) {
    this.model = model;
    this.view = view;

    this.bindEvents();
  }

  bindEvents() {
    this.view.on('settings:go-chats', () => {
      router.go('/messenger');
    })

    this.view.on('settings:update', (data) => {
      this.onSettingsUpdate(data as UserUpdateRequest);
    })

    this.view.on('settings:change-password', (data) => {
      this.onChangePassword(data as ChangePasswordRequest);
    })

    this.view.on('settings:load', () => {
      this.onLoad();
    })

    this.view.on('settings:exit', () => {
      this.onExit();
    })

    this.view.on('settings:change-avatar', (data) => {
      this.onChangeAvatar(data as { avatar: File });
    })
  }

  onSettingsUpdate(data: UserUpdateRequest) {
    this.model.updateSettings(data).then(() => {
      this.view.setProps({ edit: false });
    });
  }

  onChangePassword(data: ChangePasswordRequest) {
    this.model.changePassword(data).then(() => {
      this.view.setProps({ type: 'SETTINGS', edit: false });
    });
  }

  onLoad() {
    this.model.load().then((result) => {
      (result as UserResponse).avatar = getResourceLink((result as UserResponse).avatar);
      this.view.setProps({ settings: result as UserResponse });
    });
  }

  onExit() {
    this.model.exit().then((result) => {
      if (result === 'OK') {
        router.go('/');
      }
    });
  }

  onChangeAvatar(data: { avatar: File }) {
    const formData = new FormData();
    formData.append('avatar', data.avatar);
    this.model.changeAvatar(formData).then(() => {
      this.onLoad();
    })
  }

  getModel() {
    return this.model;
  }

  getContent() {
    return this.view.element();
  }
}
