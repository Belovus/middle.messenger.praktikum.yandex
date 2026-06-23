import { Block } from '../../core/block.ts';
import ProfileHTML from './profile.hbs?raw';
import type { PROFILE_CONFIG } from '../../configs/profile-config.ts';

interface ProfileProps {
  config: typeof PROFILE_CONFIG;
  edit: boolean;
}

export class ProfileView extends Block<ProfileProps> {
  static componentName = 'Profile';

  protected template = ProfileHTML;

  protected events = {
    click: (event: Event) => {
      if (this.refs.editLink?.contains(event.target as Node)) {
        event.preventDefault();
        this.setProps({ edit: !this.props.edit });
      }
      if (this.refs.cancel?.contains(event.target as Node)) {
        event.preventDefault();
        this.setProps({ edit: false });
      }
    },
    submit: (event: Event) => {
      event.preventDefault();

      console.log((this.refs.email as HTMLInputElement).value);
      console.log((this.refs.login as HTMLInputElement).value);
      console.log((this.refs.first_name as HTMLInputElement).value);
      console.log((this.refs.second_name as HTMLInputElement).value);
      console.log((this.refs.display_name as HTMLInputElement).value);
      console.log((this.refs.phone as HTMLInputElement).value);

      if (!this.validateAll(event)) {
        this.setProps({ edit: !this.props.edit });
      }
    },
    focusout: (event: Event) => {
      this.validateOne(event);
    }
  }
}
