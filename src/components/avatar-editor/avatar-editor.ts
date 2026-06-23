import { Block } from '../../core/block';
import AvatarEditorHTML from './avatar-editor.hbs?raw';

class AvatarEditor extends Block {
  static componentName = 'AvatarEditor';

  protected template = AvatarEditorHTML;
}

export default AvatarEditor;
