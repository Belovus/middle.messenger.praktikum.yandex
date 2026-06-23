import { Block } from '../../core/block';
import ChatItemHTML from './chat-item.hbs?raw';

class ChatItem extends Block {
  static componentName = 'ChatItem';

  protected template = ChatItemHTML;
}

export default ChatItem;
