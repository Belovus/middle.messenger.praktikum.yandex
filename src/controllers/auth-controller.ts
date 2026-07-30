import HttpTransport from '../core/http-transport.ts';

const AuthApi = new HttpTransport();

class AuthController {
  private _user: unknown | null = null;

  async checkAuth() {
    return await AuthApi.get('/auth/user').then((user) => {
      this._user = user;
      return user;
    }).catch(() => {
      this._user = null;
      return null;
    });
  }

  getUser() {
    return this._user;
  }

  isAuthenticated() {
    return this._user !== null;
  }
}

export default new AuthController();
