import { Block } from '../../core/block.ts';
import ChangePasswordHTML from './change-password.hbs?raw';
import type { CHANGE_PASSWORD_CONFIG } from '../../configs/change-password-config.ts';

interface ChangePasswordProps {
  config: typeof CHANGE_PASSWORD_CONFIG;
  edit: boolean;
}

export class ChangePasswordView extends Block<ChangePasswordProps> {
  static componentName = 'ChangePassword';

  protected template = ChangePasswordHTML;

  protected events = {
    submit: (event: Event) => {
      event.preventDefault();
      console.log((this.refs.old_password as HTMLInputElement).value);
      console.log((this.refs.new_password as HTMLInputElement).value);
      console.log((this.refs.confirm_password as HTMLInputElement).value);
    }
  }
}
