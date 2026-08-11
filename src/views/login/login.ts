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

  // для уменьшения числа перерисовок
  private isSubmitting = false;

  protected events = {
    submit: (event: Event) => {
      event.preventDefault();
      this.isSubmitting = true;
      const error = this.validateAll(event);
      this.isSubmitting = false;
      if (error) return;

      const loginFormData = new FormData(event.target as HTMLFormElement);

      this.emit('login:auth', formDataToJSON(loginFormData));
    },
    click: (event: Event) => {
      const target = event.target as HTMLLinkElement;
      if (this.refs.registrationLink === target) {
        event.preventDefault();
        this.emit('login:go-registration');
      }
    },
    focusout: (event: Event) => {
      if (this.isSubmitting) return;
      this.validateOne(event);
    }
  }
}
