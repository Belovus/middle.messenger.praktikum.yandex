import type { LoginView as LoginViewType } from '../views/login';
import type { LoginModel as LoginModelType } from '../models/login-model';

export class LoginController {
  private view: LoginViewType;
  private model: LoginModelType;

  constructor(model: LoginModelType, view: LoginViewType) {
    this.model = model;
    this.view = view;
  }

  getModel() {
    return this.model;
  }

  getContent() {
    return this.view.element();
  }
}
