import { Color } from '@tiptap/extension-color';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Document from '@tiptap/extension-document';
import ListItem from '@tiptap/extension-list-item';
import HardBreak from '@tiptap/extension-hard-break';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import Text from '@tiptap/extension-text';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import History from '@tiptap/extension-history';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from './FontSize';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';

import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { lowlight } from 'lowlight';
// import Paper from './Paper';
import TableOfContents from './TableOfContents';
import DraggableItem from './DraggableItem';

lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('js', js);
lowlight.registerLanguage('ts', ts);

const extensions = [
  // Paper,
  TableOfContents,
  DraggableItem,
  Table.configure({
    resizable: true,
  }),
  TableCell,
  TableHeader,
  TableRow,
  Typography.configure({
    oneHalf: false,
    oneQuarter: false,
    threeQuarters: false,
  }),
  // Document.extend({
  //   content: 'paper',
  // }),
  Document,
  HardBreak,
  BulletList,
  OrderedList,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  Text,
  Bold,
  Italic,
  Strike,
  Code,
  Paragraph,
  Blockquote,
  Underline,
  ListItem,
  Dropcursor,
  History,
  Gapcursor,
  Subscript,
  Superscript,
  HorizontalRule,
  Highlight.configure({
    multicolor: true,
  }),
  FontFamily.configure({
    types: ['textStyle'],
  }),
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextAlign.configure({
    types: ['heading', 'paragraph', 'image'],
    alignments: ['left', 'right', 'center'],
  }),
  TextStyle.configure({ types: [ListItem.name] }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return 'Heading';
      }

      return 'Write something…';
    },
  }),
  Image.configure({
    // inline: true,
    allowBase64: true,
  }),
  TaskList,
  FontSize,
  TaskItem.configure({
    nested: true,
  }),
  Youtube.configure({
    ccLoadPolicy: 'true',
  }),
  Link.configure({
    // protocols: ['ftp', 'mailto'],
    validate: (href) => /^https?:\/\//.test(href),
    HTMLAttributes: {
      // Change rel to different value
      // Allow search engines to follow links(remove nofollow)
      rel: 'noopener noreferrer',
    },
    openOnClick: false,
  }),
];

export default extensions;
