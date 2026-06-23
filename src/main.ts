import { registerComponent } from './utils/registerComponent';

import { LOGIN_CONFIG } from './configs/login-config';
import { REGISTRATION_CONFIG } from './configs/registration-config';
import { PROFILE_CONFIG } from './configs/profile-config.ts';
import { CHANGE_PASSWORD_CONFIG } from './configs/change-password-config.ts';
import { PLUG_CONFIG } from './configs/plug-config.ts';

import { Button } from './components/button';
import { AuthFormField } from './components/auth-form-field';
import { Link } from './components/link';
import { BackBar } from './components/back-bar';
import { AvatarEditor } from './components/avatar-editor';
import { ProfileFormField } from './components/profile-form-field';
import { ChatItem } from './components/chat-item';
import { Message } from './components/message';
import { Hint } from './components/hint';

import { LoginView } from './views/login';
import { RegistrationView } from './views/registration';
import { ErrorView } from './views/error';
import { ProfileView } from './views/profile';
import { ChangePasswordView } from './views/change-password';
import { ChatsView } from './views/chats';
import { PlugView } from './views/plug';

import { LoginController } from './controllers/login-controller.ts';
import { LoginModel } from './models/login-model.ts';
import { RegistrationController } from './controllers/registration-controller.ts';
import { RegistrationModel } from './models/registration-model.ts';
import { ErrorController } from './controllers/error-controller.ts';
import { ErrorModel } from './models/error-model.ts';
import { ChangePasswordController } from './controllers/change-password-controller.ts';
import { ChangePasswordModel } from './models/change-password-model.ts';
import { ProfileModel } from './models/profile-model.ts';
import { ProfileController } from './controllers/profile-controller.ts';
import { ChatsController } from './controllers/chats-controller.ts';
import { ChatsModel } from './models/chats-model.ts';

import './style.scss';

registerComponent(Button);
registerComponent(AuthFormField);
registerComponent(Link);
registerComponent(BackBar);
registerComponent(AvatarEditor);
registerComponent(ProfileFormField);
registerComponent(ChatItem);
registerComponent(Message);
registerComponent(Hint);

class App {
  private state: { currentPage: string }
  private appElement: HTMLElement

  constructor() {
    this.state = {
      currentPage: 'plug',
    }
    const el = document.getElementById('app');
    if (!el) throw new Error('#app root element not found');
    this.appElement = el;

    this.appElement.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      const href = target.getAttribute('data-href');
      if (!href) return;
      this.state.currentPage = href;
      this.appElement.innerHTML = '';
      this.render();
    });
  }

  render() {
    const append = (node: Node | null) => {
      if (node) this.appElement.appendChild(node);
    };

    if (this.state.currentPage === 'login') {
      const login = new LoginController(new LoginModel(), new LoginView({ config: LOGIN_CONFIG }));
      append(login.getContent());
    }
    if (this.state.currentPage === 'registration') {
      const registration = new RegistrationController(new RegistrationModel(), new RegistrationView({ config: REGISTRATION_CONFIG }));
      append(registration.getContent());
    }
    if (this.state.currentPage === 'error-404') {
      const error = new ErrorController(new ErrorModel(), new ErrorView({ code: 404, text: 'Мы уже фиксим', link_text: 'Назад к чатам' }))
      append(error.getContent());
    }
    if (this.state.currentPage === 'error-500') {
      const error = new ErrorController(new ErrorModel(), new ErrorView({ code: 500, text: 'Мы уже фиксим', link_text: 'Назад к чатам' }))
      append(error.getContent());
    }
    if (this.state.currentPage === 'change-password') {
      const changePassword = new ChangePasswordController(new ChangePasswordModel(), new ChangePasswordView({ config: CHANGE_PASSWORD_CONFIG, edit: true }));
      append(changePassword.getContent());
    }
    if (this.state.currentPage === 'profile') {
      const profile = new ProfileController(new ProfileModel(), new ProfileView({ config: PROFILE_CONFIG, edit: false }));
      append(profile.getContent());
    }
    if (this.state.currentPage === 'chats') {
      const chats = new ChatsController(new ChatsModel(), new ChatsView({}));
      append(chats.getContent());
    }

    if (this.state.currentPage === 'plug') {
      const plug = new PlugView({ config: PLUG_CONFIG });
      append(plug.element());
    }
  }
}

const app = new App();
app.render();
