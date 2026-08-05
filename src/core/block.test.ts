import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Block } from './block';

type MockFn = ReturnType<typeof vi.fn>;

interface MockNode {
  listeners: Map<string, (e: Event) => void>;
  addEventListener: MockFn;
  removeEventListener: MockFn;
  replaceWith: MockFn;
  removeAttribute: MockFn;
  getAttribute: MockFn;
}

interface TemplateMock {
  content: { firstElementChild: MockNode; querySelectorAll: MockFn };
  innerHTML: string;
}

interface BlockAccess {
  events: Record<string, (e: Event) => void>;
  props: Record<string, unknown>;
  componentRefs: Record<string, { setProps: (props: unknown) => void }>;
  refs: Record<string, MockNode>;
  validateAll: (event: Event) => boolean;
}

const renderedHtmls: string[] = [];
const allNodes: MockNode[] = [];

function makeNode(): MockNode {
  const node: MockNode = {
    listeners: new Map<string, (e: Event) => void>(),
    addEventListener: vi.fn(function (this: MockNode, type: string, cb: (e: Event) => void) {
      this.listeners.set(type, cb);
    }),
    removeEventListener: vi.fn(function (this: MockNode, type: string) {
      this.listeners.delete(type);
    }),
    replaceWith: vi.fn(),
    removeAttribute: vi.fn(),
    getAttribute: vi.fn(() => null),
  };
  allNodes.push(node);
  return node;
}

function makeTemplate(queryResult: MockNode[] = []): TemplateMock {
  const element = makeNode();
  return {
    content: {
      firstElementChild: element,
      querySelectorAll: vi.fn(() => queryResult),
    },
    innerHTML: '',
  };
}

function installDocument() {
  (globalThis as unknown as { document: { createElement: (tag: string) => TemplateMock } }).document = {
    createElement: (tag: string) => {
      expect(tag).toBe('template');
      return makeTemplate();
    },
  };
}

class TestBlock extends Block<{ name?: string; age?: number }> {
  protected template = '<div>Hello {{name}}</div>';
}

beforeEach(() => {
  vi.clearAllMocks();
  renderedHtmls.length = 0;
  allNodes.length = 0;
  installDocument();
});

describe('Block', () => {
  it('element() компилирует шаблон и возвращает закешированный DOM-узел', () => {
    const block = new TestBlock({ name: 'Vasya' });

    const first = block.element();
    const second = block.element();

    expect(allNodes.length).toBe(1);
    expect(first).toBe(second);
    expect(first).toBeDefined();
  });

  it('mountComponent() вешает обработчики событий на корневой элемент', () => {
    const onClick = vi.fn();
    const block = new TestBlock({ name: 'Vasya' });
    (block as unknown as BlockAccess).events = { click: onClick };

    const root = block.element()!;

    expect(root.addEventListener).toHaveBeenCalledWith('click', onClick);
  });

  it('setProps() мержит новые пропсы, сохраняя прежние, и заново рендерит', () => {
    const block = new TestBlock({ name: 'Vasya' });
    block.element();
    const previousRoot = allNodes[0];

    block.setProps({ age: 30 });

    expect((block as unknown as BlockAccess).props).toEqual({ name: 'Vasya', age: 30 });
    expect(previousRoot.replaceWith).toHaveBeenCalled();
    expect(allNodes.length).toBe(2);
  });

  it('перерендер снимает старые обработчики и вешает новые', () => {
    const onClick = vi.fn();
    const block = new TestBlock({ name: 'Vasya' });
    (block as unknown as BlockAccess).events = { click: onClick };
    block.element();
    const previousRoot = allNodes[0];

    block.setProps({ age: 30 });

    expect(previousRoot.removeEventListener).toHaveBeenCalledWith('click', onClick);
    expect(allNodes[1].addEventListener).toHaveBeenCalledWith('click', onClick);
  });

  it('validateAll() пишет ошибки в componentRefs и возвращает наличие ошибок', () => {
    const loginRef = { setProps: vi.fn() };
    const emailRef = { setProps: vi.fn() };
    const block = new TestBlock({ name: 'Vasya' });
    (block as unknown as BlockAccess).componentRefs = { login: loginRef, email: emailRef };

    (globalThis as unknown as { FormData: typeof FormData }).FormData = class {
      [Symbol.iterator]() {
        return [
          ['login', '123'],
          ['email', 'bad'],
        ][Symbol.iterator]();
      }
    } as unknown as typeof FormData;

    const hasErrors = (block as unknown as BlockAccess).validateAll({ target: {} } as unknown as Event);

    expect(hasErrors).toBe(true);
    expect(loginRef.setProps).toHaveBeenCalledWith({
      error: 'Не может состоять только из цифр',
      value: '123',
    });
    expect(emailRef.setProps).toHaveBeenCalledWith({
      error: 'Некорректный email',
      value: 'bad',
    });
  });

  it('собирает refs из атрибута [ref] и удаляет атрибут из элемента', () => {
    const refNode = makeNode();
    refNode.getAttribute.mockReturnValue('login');

    const template = makeTemplate();
    (template.content.querySelectorAll as MockFn).mockReturnValue([refNode]);
    (globalThis as unknown as { document: { createElement: (tag: string) => TemplateMock } }).document = {
      createElement: () => template,
    };

    class FormBlock extends Block {
      protected template = '<form></form>';
    }

    const block = new FormBlock({});
    block.element();

    expect(block['refs'].login).toBe(refNode);
    expect(refNode.removeAttribute).toHaveBeenCalledWith('ref');
  });
});
