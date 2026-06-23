import type { ChatsView as ChatsViewType } from '../views/chats';
import type { ChatsModel as ChatsModelType } from '../models/chats-model';

export class ChatsController {
  private view: ChatsViewType;
  private model: ChatsModelType;

  constructor(model: ChatsModelType, view: ChatsViewType) {
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
