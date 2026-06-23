import { Block } from '../../core/block';
import ButtonHTML from './button.hbs?raw'

class Button extends Block {
  static componentName = 'Button';

  protected template = ButtonHTML
}

export default Button;
