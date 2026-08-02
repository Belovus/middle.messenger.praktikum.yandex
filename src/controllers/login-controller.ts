import { router } from '../main.ts';
import AuthController from './auth-controller.ts';

import type { LoginView as LoginViewType } from '../views/login';
import type { LoginModel as LoginModelType } from '../models/login-model';

import type { SignInRequest } from '../types/api.ts';

export class LoginController {
  private view: LoginViewType;
  private model: LoginModelType;

  constructor(model: LoginModelType, view: LoginViewType) {
    this.model = model;
    this.view = view;

    this.bindEvents()
  }

  private bindEvents() {
    this.view.on('login:go-registration', () => router.go('/sign-up'));
    this.view.on('login:auth', (data) => this.onAuth(data as SignInRequest));
  }

  async onAuth(data: SignInRequest) {
    try {
      const result = await this.model.auth(data);
      if (result === 'OK') {
        await AuthController.checkAuth();
        router.go('/messenger');
      }
    } catch (error) {
      const err = error as { response?: { reason?: string } };
      if (err.response?.reason === 'User already in system') {
        router.go('/messenger');
      }
    }
  }

  getModel() {
    return this.model;
  }

  getContent() {
    return this.view.element();
  }
}
