import { router } from '../main.ts';

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

  onAuth(data: SignInRequest) {
    this.model.auth(data).then((result) => {
      if (result === 'OK') {
        router.go('/messenger');
      }
    });
  }

  getModel() {
    return this.model;
  }

  getContent() {
    return this.view.element();
  }
}
