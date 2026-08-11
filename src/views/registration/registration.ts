import { Block } from '../../core/block.ts';
import RegistrationHTML from './registration.hbs?raw';
import { formDataToJSON } from '../../utils/formDataToJSON.ts';

import type { REGISTRATION_CONFIG } from '../../configs/registration-config.ts';

interface RegistrationProps {
  config: typeof REGISTRATION_CONFIG;
}

export class RegistrationView extends Block<RegistrationProps> {
  static componentName = 'Registration';

  protected template = RegistrationHTML;

  private isSubmitting = false;

  protected events = {
    submit: (event: Event) => {
      event.preventDefault();
      this.isSubmitting = true;
      const error = this.validateAll(event);
      this.isSubmitting = false;
      if (error) return;

      const registrationFormData = new FormData(event.target as HTMLFormElement);
      this.emit('registration:registration', formDataToJSON(registrationFormData));
    },

    focusout: (event: Event) => {
      if (this.isSubmitting) return;
      this.validateOne(event);
    },

    click: (event: Event) => {
      const target = event.target as HTMLLinkElement;
      if (this.refs.loginLink === target) {
        event.preventDefault();
        this.emit('registration:go-login');
      }
    }
  }
}
