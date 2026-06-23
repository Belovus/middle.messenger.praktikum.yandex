import { Block } from '../../core/block';
import ProfileFormFieldHTML from './profile-form-field.hbs?raw';
import './profile-form-field.scss';

class ProfileFormField extends Block {
  static componentName = 'ProfileFormField';

  protected template = ProfileFormFieldHTML;
}

export default ProfileFormField;
