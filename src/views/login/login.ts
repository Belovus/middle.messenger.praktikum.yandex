import { Block } from '../../core/block.ts';
import LoginHTML from './login.hbs?raw';
import { formDataToJSON } from '../../utils/formDataToJSON.ts';

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

      const loginFormData = new FormData(event.target as HTMLFormElement);

      this.emit('login:auth', formDataToJSON(loginFormData));
    },
    focusout: (event: Event) => {
      this.validateOne(event);
    },
    click: (event: Event) => {
      const target = event.target as HTMLLinkElement;
      if (this.refs.registrationLink === target) {
        event.preventDefault();
        this.emit('login:go-registration');
      }
    },
  }
}
