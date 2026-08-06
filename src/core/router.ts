import { router } from "../main.ts";
import AuthController from '../controllers/auth-controller.ts';

interface IRoutable {
  getContent(): Node | null;
}

class Route {
  _pathname: string;
  _blockClass: (() => IRoutable) | IRoutable;
  _block: IRoutable | null;
  _guard: boolean;
  _props: {
    rootQuery: string;
  }


  constructor(pathname: string, view: (() => IRoutable) | IRoutable, guard: boolean, props: { rootQuery: string }) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
    this._guard = guard;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      // this._block.hide();
    }
  }

  match(pathname: string) {
    return pathname === this._pathname;
  }

  render() {
    this._block = typeof this._blockClass === 'function' ? this._blockClass() : this._blockClass;
    const root = document.querySelector(this._props.rootQuery);
    if (root) {
      root.textContent = '';
      const content = this._block.getContent();
      if (content) root.appendChild(content);
    }
    return;

    // this._block.show();
  }
}

export class Router {
  static __instance: Router;

  routes: Route[] = [];
  history: History = window.history;
  _currentRoute: Route | null = null;
  _rootQuery: string = '';

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  use(pathname: string, block: (() => IRoutable) | IRoutable, guard: boolean) {
    const route = new Route(pathname, block, guard, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  start() {
    window.onpopstate = () => {
      this._onRoute(window.location.pathname);
    }

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    const route = this.getRoute(pathname);

    if (!route) {
      return;
    }

    if (route._guard && !AuthController.isAuthenticated()) {
      router.go('/');
      return;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string) {
    return this.routes.find(route => route.match(pathname));
  }
}
