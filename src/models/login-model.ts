import { EventBus } from '../core/event-bus.ts';
import HttpTransport from '../core/http-transport.ts';

import type { SignInRequest } from '../types/api.ts';

const AuthApi = new HttpTransport();

export class LoginModel extends EventBus {
  async auth(data: SignInRequest) {
    return AuthApi.post('/auth/signin', { data: { ...data } });
  }
}
