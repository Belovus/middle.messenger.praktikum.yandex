import type { ChangePasswordView as ChangePasswordViewType } from '../views/change-password';
import type { ChangePasswordModel as ChangePasswordModelType } from '../models/change-password-model';

export class ChangePasswordController {
  private view: ChangePasswordViewType;
  private model: ChangePasswordModelType;

  constructor(model: ChangePasswordModelType, view: ChangePasswordViewType) {
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
