import { EventBus } from '../core/event-bus.ts';
import HttpTransport from '../core/http-transport.ts';

import type { ChangePasswordRequest, UserUpdateRequest } from '../types/api.ts';

const SettingsApi = new HttpTransport();

export class SettingsModel extends EventBus {
  async updateSettings(data: UserUpdateRequest) {
    return SettingsApi.put('/user/profile', { data: { ...data } });
  }

  async changePassword(data: ChangePasswordRequest) {
    return SettingsApi.post('/user/password', { data: { ...data } });
  }

  async load() {
    return await SettingsApi.get('/auth/user');
  }

  async exit() {
    return await SettingsApi.post('/auth/logout');
  }
}
