import { Block } from '../../core/block';
import AuthFormFieldHTML from './auth-form-field.hbs?raw';

class AuthFormField extends Block {
  static componentName = 'AuthFormField';

  protected template= AuthFormFieldHTML;
}

export default AuthFormField;
