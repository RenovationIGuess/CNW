import React from 'react';

const fontSizeOptions = [
  12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72,
];

const FontSizePopover = ({ editor, setPopoverOpen }) => {
  return (
    <div className="tiptap-popover max-h-[248px] overflow-y-auto">
      {fontSizeOptions.map((fontSize, index) => (
        <span
          key={index}
          onClick={() => {
            setPopoverOpen(false);
            editor.isActive('textStyle', { fontSize: fontSize })
              ? editor.chain().focus().unsetFontSize().run()
              : editor.chain().focus().setFontSize(fontSize).run();
          }}
          className={
            editor.isActive('textStyle', { fontSize: fontSize })
              ? 'toolbar-list__item toolbar-list__item--active'
              : 'toolbar-list__item'
          }
        >
          {fontSize}px
        </span>
      ))}
    </div>
  );
};

export default FontSizePopover;
