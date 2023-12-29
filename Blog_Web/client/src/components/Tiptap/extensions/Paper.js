import { Node, mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react';
import PaperComponent from './PaperComponent';

export default Node.create({
  name: 'paper',

  group: 'block',

  atom: true,

  draggable: false,

  addAttributes() {
    return {
      lines: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="paper"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'paper' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PaperComponent);
  },
});
