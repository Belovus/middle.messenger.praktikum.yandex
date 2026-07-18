import { Block } from '../../core/block';
import ModalHTML from './modal.hbs?raw';

class Modal extends Block {
  static componentName = 'Modal';

  protected template = ModalHTML;
}

export default Modal;
