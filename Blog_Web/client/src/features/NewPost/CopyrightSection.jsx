import React, { useState } from 'react';
import { AiOutlineCopy, AiOutlineInfoCircle } from 'react-icons/ai';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
import useComponentVisible from '~/hooks/useComponentVisible';

const CopyrightSection = () => {
  // Copyright - cp
  const [cpInputRef, isCPInputFocused, setCPInputFocused] =
    useComponentVisible(false);

  const [copyright, setCopyright] = useState(true);

  return (
    <div className="form-item-container copyright-settings">
      <div className="copyright-settings-title">
        <span className="form-item-container__label">Copyright Settings</span>
        <AiOutlineInfoCircle className="icon" />
      </div>
      <div className="copyright-settings-original">
        <div className="copyright-settings-original-radio">
          <div className="newpost-radio" onClick={() => setCopyright(true)}>
            {copyright ? (
              <MdRadioButtonChecked className="radio-icon-checked" />
            ) : (
              <MdRadioButtonUnchecked className="radio-icon-unchecked" />
            )}
            <div className="copyright-settings-original-radio-name">
              Non-original Content
            </div>
          </div>
          <div className="copyright-settings-original-radio-option">
            <div className={`copyright-input`}>
              <div
                className={`input-container${
                  isCPInputFocused ? ' input-container--focus' : ''
                }`}
                ref={cpInputRef}
                onClick={() => setCPInputFocused(true)}
              >
                <input
                  placeholder="Click to paste the reference link"
                  type="text"
                />
                <AiOutlineCopy className="paste-icon" />
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-settings-original-radio">
          <div className="newpost-radio" onClick={() => setCopyright(false)}>
            {!copyright ? (
              <MdRadioButtonChecked className="radio-icon-checked" />
            ) : (
              <MdRadioButtonUnchecked className="radio-icon-unchecked" />
            )}
            <div className="copyright-settings-original-radio-name">
              Original Content
            </div>
          </div>
          <div className="copyright-settings-original-radio-option">
            <div className="select-option">
              <div className="newpost-select">
                <div className="newpost-select__container">
                  <span className="newpost-select-label">
                    <span className="newpost-select__placeholder">
                      Original Content Type
                    </span>
                  </span>
                </div>
              </div>
              <AiOutlineInfoCircle className="notice" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyrightSection;
