import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import HttpTransport, { BASE_URL } from './http-transport';

class MockXHR {
  static instances: MockXHR[] = [];

  open = vi.fn();
  send = vi.fn();
  setRequestHeader = vi.fn();
  getResponseHeader = vi.fn(() => 'application/json');

  url: string | null = null;
  status = 200;
  statusText = 'OK';
  responseType: XMLHttpRequestResponseType = '';
  response: unknown = null;
  responseText = '';
  timeout = 0;
  withCredentials = false;

  onload: (() => void) | null = null;
  onabort: (() => void) | null = null;
  onerror: (() => void) | null = null;
  ontimeout: (() => void) | null = null;

  constructor() {
    MockXHR.instances.push(this);
  }

  triggerLoad() {
    this.onload?.();
  }
}

const originalXHR = globalThis.XMLHttpRequest;
let transport: HttpTransport;

beforeEach(() => {
  MockXHR.instances = [];
  vi.clearAllMocks();
  (globalThis as { XMLHttpRequest: unknown }).XMLHttpRequest = MockXHR as unknown as typeof XMLHttpRequest;
  transport = new HttpTransport();
});

afterAll(() => {
  (globalThis as { XMLHttpRequest: unknown }).XMLHttpRequest = originalXHR;
});

describe('HttpTransport', () => {
  it('get/post/put/delete вызывают request с нужным методом и базовым URL', () => {
    transport.get('/user');
    transport.post('/user');
    transport.put('/user');
    transport.delete('/user');

    MockXHR.instances.forEach((xhr, i) => {
      expect(xhr.open).toHaveBeenCalledWith(
        ['GET', 'POST', 'PUT', 'DELETE'][i],
        `${BASE_URL}/user`
      );
    });
  });

  it('для GET с данными добавляет query-строку в URL', () => {
    transport.get('/user', { data: { id: 1, name: 'Иван' } });

    expect(MockXHR.instances[0].open).toHaveBeenCalledWith(
      'GET',
      `${BASE_URL}/user?id=1&name=${encodeURIComponent('Иван')}`
    );
  });

  it('отправляет POST-объект в JSON, добавляя Content-Type', () => {
    transport.post('/user', { data: { message: 'привет' } });

    const xhr = MockXHR.instances[0];
    expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(xhr.send).toHaveBeenCalledWith('{"message":"привет"}');
    expect(xhr.withCredentials).toBe(true);
  });

  it('успешный JSON-ответ резолвится распарсенным объектом', async () => {
    const promise = transport.get('/json');

    const xhr = MockXHR.instances[0];
    xhr.status = 200;
    xhr.responseText = '{"ok":true}';
    xhr.triggerLoad();

    await expect(promise).resolves.toEqual({ ok: true });
  });

  it('ответ с ошибкой режектится с объектом ошибки', async () => {
    const promise = transport.get('/error');

    const xhr = MockXHR.instances[0];
    xhr.status = 500;
    xhr.statusText = 'Internal Server Error';
    xhr.responseText = '{"reason":"boom"}';
    xhr.triggerLoad();

    await expect(promise).rejects.toMatchObject({
      status: 500,
      statusText: 'Internal Server Error',
      response: { reason: 'boom' },
    });
  });

  it('режектится по таймауту и при сетевой ошибке', async () => {
    const timeoutPromise = transport.get('/x', { timeout: 1000 });
    const xhr = MockXHR.instances[MockXHR.instances.length - 1];
    expect(xhr.timeout).toBe(1000);
    xhr.ontimeout?.();

    await expect(timeoutPromise).rejects.toMatchObject({ reason: 'Request timeout' });

    const errorPromise = transport.get('/x');
    const xhr2 = MockXHR.instances[MockXHR.instances.length - 1];
    xhr2.onerror?.();

    await expect(errorPromise).rejects.toMatchObject({ reason: 'Network error' });
  });
});
