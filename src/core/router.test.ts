import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { Router } from './router';

vi.mock('../main.ts', () => ({ router: { go: vi.fn() } }));
vi.mock('../controllers/auth-controller.ts', () => ({ default: { isAuthenticated: vi.fn() } }));

import AuthController from '../controllers/auth-controller';
import { router as mainRouter } from '../main';

let root: { textContent: string; appendChild: ReturnType<typeof vi.fn> };
let history: { pushState: ReturnType<typeof vi.fn>; back: ReturnType<typeof vi.fn>; forward: ReturnType<typeof vi.fn> };

function resetRouter() {
  (Router as unknown as { __instance: unknown }).__instance = undefined;
  const appRoot = { textContent: '', appendChild: vi.fn() };
  root = appRoot;
  (globalThis as unknown as { window: unknown }).window = {
    location: { pathname: '/' },
    history: (history = { pushState: vi.fn(), back: vi.fn(), forward: vi.fn() }),
    set onpopstate(value: unknown) { void value; },
  };
  (globalThis as unknown as { document: unknown }).document = { querySelector: vi.fn(() => appRoot) };
}

function makeView() {
  const node = {} as Node;
  return { getContent: () => node };
}

describe('Router', () => {
  beforeAll(() => resetRouter());
  beforeEach(() => {
    vi.clearAllMocks();
    resetRouter();
    (AuthController as unknown as { isAuthenticated: ReturnType<typeof vi.fn> }) =
      { isAuthenticated: vi.fn(() => false) };
  });

  it('use() возвращает this (чейнинг) и регистрирует маршрут', () => {
    const router = new Router('#app');
    const result = router.use('/settings', makeView(), true);
    expect(result).toBe(router);
    expect(router.getRoute('/settings')).toBeDefined();
    expect(router.getRoute('/unknown')).toBeUndefined();
  });

  it('constructor — синглтон: второй new Router() возвращает тот же экземпляр', () => {
    (Router as unknown as { __instance: unknown }).__instance = undefined;
    const first = new Router('#app');
    const second = new Router('#app');
    expect(second).toBe(first);
  });

  it('go() добавляет запись в историю и рендерит маршрут', () => {
    const router = new Router('#app');
    const view = makeView();
    vi.spyOn(view, 'getContent');
    router.use('/settings', view, false);

    router.go('/settings');

    expect(history.pushState).toHaveBeenCalledWith({}, '', '/settings');
    expect(view.getContent).toHaveBeenCalled();
    expect(root.appendChild).toHaveBeenCalled();
  });

  it('guarded маршрут без авторизации редиректит на "/" и не рендерит', () => {
    const router = new Router('#app');
    const view = makeView();
    vi.spyOn(view, 'getContent');
    router.use('/settings', view, true);

    router.go('/settings');

    expect(mainRouter.go).toHaveBeenCalledWith('/');
    expect(view.getContent).not.toHaveBeenCalled();
  });

  it('guarded маршрут с авторизацией рендерится', () => {
    (AuthController as unknown as { isAuthenticated: ReturnType<typeof vi.fn> }).isAuthenticated.mockReturnValue(true);
    const router = new Router('#app');
    const view = makeView();
    vi.spyOn(view, 'getContent');
    router.use('/settings', view, true);

    router.go('/settings');

    expect(mainRouter.go).not.toHaveBeenCalled();
    expect(view.getContent).toHaveBeenCalled();
  });

  it('start() выставляет onpopstate и обрабатывает текущий pathname', () => {
    const router = new Router('#app');
    const view = makeView();
    vi.spyOn(view, 'getContent');
    router.use('/settings', view, false);
    (globalThis as unknown as { window: { location: { pathname: string }; onpopstate: unknown } }).window.location.pathname = '/settings';

    router.start();

    expect(router.getRoute('/settings')).toBeDefined();
    expect(view.getContent).toHaveBeenCalled();
  });
});
