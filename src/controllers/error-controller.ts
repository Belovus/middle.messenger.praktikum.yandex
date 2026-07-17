import { router } from '../main.ts';

import type { ErrorView as ErrorViewType } from '../views/error';
import type { ErrorModel as ErrorModelType } from '../models/error-model';

export class ErrorController {
  private view: ErrorViewType;
  private model: ErrorModelType;

  constructor(model: ErrorModelType, view: ErrorViewType) {
    this.model = model;
    this.view = view;

    this.view.on('error:go-chats', () => {
      router.go('/messenger');
    })
  }

  getModel() {
    return this.model;
  }

  getContent() {
    return this.view.element();
  }
}
