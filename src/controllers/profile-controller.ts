import type { ProfileView as ProfileViewType } from '../views/profile';
import type { ProfileModel as ProfileModelType } from '../models/profile-model';

export class ProfileController {
  private view: ProfileViewType;
  private model: ProfileModelType;

  constructor(model: ProfileModelType, view: ProfileViewType) {
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
