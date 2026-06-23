import { Block } from '../../core/block';
import MessageHTML from './message.hbs?raw';

class Message extends Block {
  static componentName = 'Message';

  protected template = MessageHTML;
}

export default Message;
