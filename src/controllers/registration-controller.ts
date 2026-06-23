import type { RegistrationView as RegistrationViewType } from '../views/registration';
import type { RegistrationModel as RegistrationModelType } from '../models/registration-model';

export class RegistrationController {
  private view: RegistrationViewType;
  private model: RegistrationModelType;

  constructor(model: RegistrationModelType, view: RegistrationViewType) {
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
