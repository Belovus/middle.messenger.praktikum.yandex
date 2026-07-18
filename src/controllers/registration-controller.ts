import { router } from '../main.ts';

import type { RegistrationView as RegistrationViewType } from '../views/registration';
import type { RegistrationModel as RegistrationModelType } from '../models/registration-model';

export class RegistrationController {
  private view: RegistrationViewType;
  private model: RegistrationModelType;

  constructor(model: RegistrationModelType, view: RegistrationViewType) {
    this.model = model;
    this.view = view;

    this.bindEvents();
  }

  bindEvents() {
    this.view.on('registration:go-login', () => {
      router.go('/')
    })

    this.view.on('registration:registration', (data) => this.onRegistration(data as Record<string, unknown>))
  }

  onRegistration(data: Record<string, unknown>) {
    this.model.registration(data).then((result) => console.log(result));
  }

  getModel() {
    return this.model;
  }

  getContent() {
    return this.view.element();
  }
}
