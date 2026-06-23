import { Block } from '../../core/block';
import BackBarHTML from './back-bar.hbs?raw';

class BackBar extends Block {
  static componentName = 'BackBar';

  protected template = BackBarHTML;
}

export default BackBar;
