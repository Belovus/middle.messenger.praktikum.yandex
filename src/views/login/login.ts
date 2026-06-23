import { Block } from '../../core/block.ts';
import LoginHTML from './login.hbs?raw';

import type { LOGIN_CONFIG } from "../../configs/login-config.ts";

interface LoginProps {
  config: typeof LOGIN_CONFIG;
}

export class LoginView extends Block<LoginProps> {
  static componentName = 'Login';

  protected template = LoginHTML;

  protected events = {
    submit: (event: Event) => {
      event.preventDefault();
      this.validateAll(event);

      console.log((this.refs.login as HTMLInputElement).value);
      console.log((this.refs.password as HTMLInputElement).value);
    },
    focusout: (event: Event) => {
      this.validateOne(event);
    }
  }
}
