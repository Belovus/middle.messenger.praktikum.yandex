import { Block } from '../../core/block';
import AvatarEditorHTML from './avatar-editor.hbs?raw';

class AvatarEditor extends Block {
  static componentName = 'AvatarEditor';

  protected template = AvatarEditorHTML;

  protected events = {
    click: () => {
      const input = this.refs.fileInput as HTMLInputElement;
      input?.click();
    }
  }
}

export default AvatarEditor;
