import { Block } from '../../core/block.ts';
import ChatsHTML from './chats.hbs?raw';

export class ChatsView extends Block {
  static componentName = 'Chats';

  protected template = ChatsHTML;

  protected events = {
    submit: (event: Event): void => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      if (formData.get('message')) {
        console.log(formData.get('message'));
      }
    }
  };
}
