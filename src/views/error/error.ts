import { Block } from '../../core/block.ts';
import ErrorHTML from './error.hbs?raw';

interface ErrorProps {
  code: number;
  text: string;
  link_text: string;
}

export class ErrorView extends Block<ErrorProps> {
  static componentName = 'Error';

  protected template = ErrorHTML;
}
