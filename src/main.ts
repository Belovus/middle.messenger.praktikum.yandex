import Handlebars from 'handlebars';
import { LOGIN_CONFIG } from './configs/login-config.ts';
import { REGISTRATION_CONFIG } from './configs/registration-config.ts';
import { INTERNAL_SERVER_ERROR } from './configs/internal-server-error.ts';
import { NOT_FOUND_ERROR } from './configs/not-found-error.ts';
import { PROFILE_CONFIG } from './configs/profile-config.ts';
import { CHANGE_PASSWORD_CONFIG } from './configs/change-password-config.ts';

import { PLUG_CONFIG } from './configs/plug-config.ts';

// Partials
import { Button } from './components/button';
import { AuthFormField } from './components/auth-form-field';
import { Link } from './components/link';
import { BackBar } from './components/back-bar';
import { AvatarEditor } from './components/avatar-editor';
import { ProfileFormField } from './components/profile-form-field';
import { ChatItem } from './components/chat-item';

// Pages
import { Login } from './pages/login';
import { Registration } from './pages/registration';
import { Error } from './pages/error';
import { Profile } from './pages/profile';
import { ChangePassword } from './pages/change-password';
import { Chats } from './pages/chats';

import { Plug } from './pages/plug';

import './style.css';

// Register partials
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('AuthFormField', AuthFormField);
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('BackBar', BackBar);
Handlebars.registerPartial('AvatarEditor', AvatarEditor);
Handlebars.registerPartial('ProfileFormField', ProfileFormField);
Handlebars.registerPartial('ChatItem', ChatItem);

class App {
  private state: any
  private appElement: any

  constructor() {
    this.state = {
      currentPage: 'plug',
    }
    this.appElement = document.getElementById('app');

    this.appElement.addEventListener('click', (event: any) => {
      this.state.currentPage = event.target.getAttribute('data-href');
      this.render();
    });
  }

  render() {
    let template: any;
    if (this.state.currentPage === 'login') {
      template = Handlebars.compile(Login);
      this.appElement.innerHTML = template({ config: LOGIN_CONFIG });
    }
    if (this.state.currentPage === 'registration') {
      template = Handlebars.compile(Registration);
      this.appElement.innerHTML = template({ config: REGISTRATION_CONFIG });
    }
    if (this.state.currentPage === 'error-404') {
      template = Handlebars.compile(Error);
      this.appElement.innerHTML = template({ config: NOT_FOUND_ERROR });
    }
    if (this.state.currentPage === 'error-500') {
      template = Handlebars.compile(Error);
      this.appElement.innerHTML = template({ config: INTERNAL_SERVER_ERROR });
    }
    if (this.state.currentPage === 'change-password') {
      template = Handlebars.compile(ChangePassword);
      this.appElement.innerHTML = template({ config: CHANGE_PASSWORD_CONFIG });
    }
    if (this.state.currentPage === 'profile') {
      template = Handlebars.compile(Profile);
      this.appElement.innerHTML = template({ config: PROFILE_CONFIG });
    }
    if (this.state.currentPage === 'chats') {
      template = Handlebars.compile(Chats);
      this.appElement.innerHTML = template({});
    }


    if (this.state.currentPage === 'plug') {
      template = Handlebars.compile(Plug);
      this.appElement.innerHTML = template({ config: PLUG_CONFIG })
    }
  }
}

const app = new App();
app.render();
