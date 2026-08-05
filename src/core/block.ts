import Handlebars from 'handlebars';
import { EventBus } from './event-bus';
import { validateField, validateForm } from "../utils/validation.ts";

export interface BlockOwnProps {
  __children?: Array<{
    component: Block<object>;
    embed(node: DocumentFragment): void;
  }>;
  __refs?: Record<string, Element>;
  __componentRefs?: Record<string, Block<object>>;
}

type EventListType = Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>>;

export abstract class Block<Props = object> extends EventBus {
  static componentName = 'Block';

  protected abstract template: string;

  protected props = {} as Props & BlockOwnProps;

  private domElement: Element | null = null;

  protected children: Block<object>[] = [];

  protected refs: Record<string, Element> = {};

  protected componentRefs: Record<string, Block<object>> = {};

  protected events: EventListType = {};

  constructor(props: Props & BlockOwnProps) {
    super();
    this.props = props;
  }

  public element(): Element | null {
    if (!this.domElement) {
      this.render();
    }

    return this.domElement;
  }

  public setProps(props: Partial<Props>) {
    this.props = { ...this.props, ...props } as Props & BlockOwnProps;
    delete this.props.__children;
    delete this.props.__refs;
    delete this.props.__componentRefs;
    this.render();
  }

  protected componentDidMount() {}

  private mountComponent() {
    this.attachListeners();
    this.componentDidMount();
  }

  protected componentWillUnmount() {}

  private unmountComponent() {
    if (this.domElement) {
      this.children.reverse().forEach(child => child.unmountComponent());

      this.componentWillUnmount();
      this.removeListeners();
    }
  }

  private attachListeners() {
    for (const eventName in this.events) {
      const eventCallback = this.events[eventName as keyof typeof this.events];
      if (typeof eventCallback == 'function' && this.domElement) {
        this.domElement.addEventListener(eventName, eventCallback);
      }
    }
  }

  private removeListeners() {
    for (const eventName in this.events) {
      const eventCallback = this.events[eventName as keyof typeof this.events];
      if (typeof eventCallback === 'function' && this.domElement) {
        this.domElement.removeEventListener(eventName, eventCallback);
      }
    }
  }

  protected validateOne(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.name && target.tagName === 'INPUT') {
      const error = validateField(target.name, target.value);
      this.componentRefs[target.name].setProps({ error, value: target.value });
    }
  }

  protected validateAll(event: Event) {
    let hasErrors = false;
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData) as Record<string, string>;
    const errors = validateForm(data);
    for (const [name, error] of Object.entries(errors)) {
      if (error) hasErrors = true;
      this.componentRefs[name].setProps({ error, value: data[name] });
    }
    return hasErrors;
  }

  protected render() {
    this.unmountComponent();
    const fragment = this.compile();
    if (this.domElement && fragment) {
      this.domElement.replaceWith(fragment);
    }
    this.domElement = fragment;
    this.mountComponent();
  }

  private compile(): Element | null {
    const html = Handlebars.compile(this.template)(this.props);
    const templateElement = document.createElement('template');
    templateElement.innerHTML = html;
    const fragment = templateElement.content;

    if (this.props.__children) {
      this.children = this.props.__children.map((child) => child.component);

      this.props.__children.forEach((child) => {
        child.embed(fragment);
      });
    }

    const refs = Array.from(fragment.querySelectorAll('[ref]')).reduce(
      (list, element) => {
        const key = element.getAttribute('ref') as string;
        list[key] = element as HTMLElement;
        element.removeAttribute('ref');
        return list;
      },
      {} as Record<string, Element>,
    );

    this.children.forEach((child) => {
      Object.assign(refs, child.refs);
    });
    this.refs = refs;

    if (this.props.__componentRefs) {
      this.componentRefs = this.props.__componentRefs;
    }

    return templateElement.content.firstElementChild;
  }
}
