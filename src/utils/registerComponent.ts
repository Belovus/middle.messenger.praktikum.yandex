import Handlebars from 'handlebars';
import type { HelperOptions } from 'handlebars';
import { v4 as uuidv4 } from 'uuid';
import type { Block, BlockOwnProps } from '../core/block.ts';

export type Component<Props extends BlockOwnProps = BlockOwnProps> = {
  new (props: Props): Block<Props>;
  componentName: string;
};

export function registerComponent(Component: Component) {
  Handlebars.registerHelper(
    Component.componentName,
    function (this: unknown, { hash, data }: HelperOptions) {
      const dataAttribute = `data-component-hbs-id="${uuidv4()}"`;
      const component = new Component(hash);

      if (hash.ref) {
        data.root.__componentRefs = data.root.__componentRefs || {};
        data.root.__componentRefs[hash.ref] = component;
      }

      (data.root.__children = data.root.__children || []).push({
        component,
        embed(node: DocumentFragment) {
          const placeholder = node.querySelector(`[${dataAttribute}]`);
          if (!placeholder) {
            throw new Error(
              `Can't find data-id for component ${Component.componentName}`
            );
          }

          const element = component.element();
          if (!element) throw new Error(`Component ${Component.componentName} returned null element`);
          placeholder.replaceWith(element);
        },
      });

      return `<div ${dataAttribute}></div>`;
    }
  );
}
