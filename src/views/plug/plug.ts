import { Block } from '../../core/block.ts';
import PlugHTML from './plug.hbs?raw';

import type { PLUG_CONFIG } from "../../configs/plug-config.ts";

interface PlugProps {
  config: typeof PLUG_CONFIG;
}

class PlugView extends Block<PlugProps> {
  static componentName = 'Plug';

  protected template = PlugHTML;
}

export default PlugView;
