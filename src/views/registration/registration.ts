import { Block } from '../../core/block.ts';
import RegistrationHTML from './registration.hbs?raw';
import type { REGISTRATION_CONFIG } from '../../configs/registration-config.ts';

interface RegistrationProps {
  config: typeof REGISTRATION_CONFIG;
}

export class RegistrationView extends Block<RegistrationProps> {
  static componentName = 'Registration';

  protected template = RegistrationHTML;

  protected events = {
    submit: (event: Event) => {
      event.preventDefault();
      console.log((this.refs.email as HTMLInputElement).value);
      console.log((this.refs.login as HTMLInputElement).value);
      console.log((this.refs.first_name as HTMLInputElement).value);
      console.log((this.refs.second_name as HTMLInputElement).value);
      console.log((this.refs.phone as HTMLInputElement).value);
      console.log((this.refs.password as HTMLInputElement).value);
      console.log((this.refs.confirm_password as HTMLInputElement).value);

      this.validateAll(event);
    },

    focusout: (event: Event) => {
      this.validateOne(event);
    }
  }
}
