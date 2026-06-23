import { Block } from '../../core/block';
import HintHTML from './hint.hbs?raw';

class Hint extends Block {
  static componentName = 'Hint';

  protected template = HintHTML;
}

export default Hint;
