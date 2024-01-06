import { Tooltip } from 'antd';
import React from 'react';

const fontFamilyArray = [
  'Roboto',
  'Inter',
  'Comic Sans MS, Comic Sans',
  'serif',
  'monospace',
  'cursive',
];

const FontFamilyPopover = ({ editor, setFontFamily, setPopoverOpen }) => {
  return (
    <div className="tiptap-popover" style={{ width: 150 }}>
      {fontFamilyArray.map((font, index) => (
        <Tooltip arrow={false} key={index} title={font} placement="right">
          <span
            onClick={() => {
              font === 'Roboto'
                ? editor.chain().focus().unsetFontFamily().run()
                : editor.chain().focus().setFontFamily(font).run();
              setFontFamily(font);
              setPopoverOpen(false);
            }}
            className={
              editor.isActive('textStyle', { fontFamily: font })
                ? 'toolbar-list__item toolbar-list__item--active'
                : 'toolbar-list__item'
            }
            style={{ fontFamily: font }}
          >
            {font.length > 10 ? font.slice(0, 10) + '...' : font}
          </span>
        </Tooltip>
      ))}
    </div>
  );
};

export default FontFamilyPopover;
