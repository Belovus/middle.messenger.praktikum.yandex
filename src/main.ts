import Handlebars from 'handlebars';
import { registerComponent } from './utils/registerComponent';
import { Router } from './core/router.ts';
import { And, Or, Not, Equal } from './utils/handlebars-helpers.ts';

import { LOGIN_CONFIG } from './configs/login-config';
import { REGISTRATION_CONFIG } from './configs/registration-config';
import { SETTINGS_CONFIG } from './configs/settings-config.ts';

// Components
import { Button } from './components/button';
import { AuthFormField } from './components/auth-form-field';
import { Link } from './components/link';
import { BackBar } from './components/back-bar';
import { AvatarEditor } from './components/avatar-editor';
import { ProfileFormField } from './components/profile-form-field';
import { ChatItem } from './components/chat-item';
import { Message } from './components/message';
import { Hint } from './components/hint';
import { Modal } from './components/modal';

// Views
import { LoginView } from './views/login';
import { RegistrationView } from './views/registration';
import { ErrorView } from './views/error';
import { SettingsView } from './views/settings';
import { ChatsView } from './views/chats';

// Controllers
import { LoginController } from './controllers/login-controller.ts';
import { RegistrationController } from './controllers/registration-controller.ts';
import { ErrorController } from './controllers/error-controller.ts';
import { SettingsController } from './controllers/settings-controller.ts';
import { ChatsController } from './controllers/chats-controller.ts';
import AuthController from './controllers/auth-controller.ts';

// Models
import { RegistrationModel } from './models/registration-model.ts';
import { LoginModel } from './models/login-model.ts';
import { ErrorModel } from './models/error-model.ts';
import { SettingsModel } from './models/settings-model.ts';
import { ChatsModel } from './models/chats-model.ts';

import './style.scss';

Handlebars.registerHelper('and', And);
Handlebars.registerHelper('or', Or);
Handlebars.registerHelper('not', Not);
Handlebars.registerHelper('equal', Equal);

registerComponent(Button);
registerComponent(AuthFormField);
registerComponent(Link);
registerComponent(BackBar);
registerComponent(AvatarEditor);
registerComponent(ProfileFormField);
registerComponent(ChatItem);
registerComponent(Message);
registerComponent(Hint);
registerComponent(Modal);

export const router = new Router("#app");
await AuthController.checkAuth();

router
  .use("/", () => new LoginController(new LoginModel(), new LoginView({ config: LOGIN_CONFIG })), false)
  .use("/sign-up", () => new RegistrationController(new RegistrationModel(), new RegistrationView({ config: REGISTRATION_CONFIG })), false)
  .use("/settings", () => new SettingsController(new SettingsModel(), new SettingsView({ config: SETTINGS_CONFIG, edit: false, type: 'SETTINGS' })), true)
  .use("/messenger", () => new ChatsController(new ChatsModel(), new ChatsView({})), true)
  .use("/404", () => new ErrorController(new ErrorModel(), new ErrorView({ code: 404, text: 'Мы уже фиксим', link_text: 'Назад к чатам' })), false)
  .use("/500", () => new ErrorController(new ErrorModel(), new ErrorView({ code: 500, text: 'Мы уже фиксим', link_text: 'Назад к чатам' })), false)
  .start()
