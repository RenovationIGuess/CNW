import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { RiArrowDownSFill } from 'react-icons/ri';
import useComponentVisible from '~/hooks/useComponentVisible';

const fontFamilyArray = [
  'Roboto',
  'Inter',
  'Comic Sans MS, Comic Sans',
  'serif',
  'monospace',
  'cursive',
];

const FontFamilyButton = ({ editor }) => {
  const [toolbarFFRef, isToolbarFFVisible, setToolbarFFVisible] =
    useComponentVisible(false, 'toolbar-font-family');

  // Font family
  const [fontFamily, setFontFamily] = useState('Roboto');

  return (
    <>
      <div className="toolbar-item toolbar-font-family">
        <Tooltip placement="top" title={'Change font'} arrow={false}>
          <div
            className="editor-font-family-container"
            ref={toolbarFFRef}
            onClick={() => setToolbarFFVisible((prev) => !prev)}
          >
            <div className="font-name">{fontFamily}</div>
            <RiArrowDownSFill
              className={
                isToolbarFFVisible
                  ? 'font-menu-arrow font-menu-arrow--active'
                  : 'font-menu-arrow'
              }
            />
          </div>
        </Tooltip>
        {isToolbarFFVisible && (
          <div
            className="toolbar-list editor-tool-popup"
            style={{ width: 150 }}
          >
            {fontFamilyArray.map((font, index) => (
              <span
                key={index}
                onClick={() => {
                  font === 'Roboto'
                    ? editor.chain().focus().unsetFontFamily().run()
                    : editor.chain().focus().setFontFamily(font).run();
                  // setFontFamily(font);
                  setToolbarFFVisible(false);
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
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FontFamilyButton;
