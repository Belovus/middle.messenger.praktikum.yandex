import { Block } from '../../core/block';
import LinkHTML from './link.hbs?raw';

class Link extends Block {
  static componentName = 'Link';

  protected template = LinkHTML;
}

export default Link;
