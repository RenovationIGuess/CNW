import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CustomLinkComponent from './CustomLinkComponent.jsx';

export default Node.create({
  name: 'customLinkComponent',

  group: 'block',

  content: 'inline*',

  addAttributes() {
    return {
      url: { default: '' },
      urlLabel: { default: '' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'custom-link-component',
      },
    ];
  },

  // addKeyboardShortcuts() {
  //   return {
  //     'Mod-Enter': () => {
  //       return this.editor
  //         .chain()
  //         .insertContentAt(this.editor.state.selection.head, {
  //           type: this.type.name,
  //         })
  //         .focus()
  //         .run();
  //     },
  //   };
  // },

  renderHTML({ HTMLAttributes }) {
    return ['custom-link-component', mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomLinkComponent);
  },
});
