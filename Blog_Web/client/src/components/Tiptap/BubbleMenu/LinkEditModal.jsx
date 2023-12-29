import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import InputSection from '~/components/Modal/InputSection';
import useComponentVisible from '~/hooks/useComponentVisible';

const LinkEditModal = ({
  editor,
  open,
  setOpen,
  oldUrl = '',
  oldLabel = '',
}) => {
  const [urlInputRef, isUrlInputFocused, setUrlInputFocused] =
    useComponentVisible(false);
  const [descInputRef, isDescInputFocused, setDescInputFocused] =
    useComponentVisible(false);

  const [link, setLink] = useState({
    url: oldUrl,
    label: oldLabel,
  });

  useEffect(() => {
    setLink({
      url: oldUrl,
      label: oldLabel,
    });
  }, [oldLabel, oldUrl]);

  const handleConfirm = () => {
    // Get the current selection
    const { from, to } = editor.state.selection;

    // Set the selection to the range of the link
    // editor.chain().focus().setSelection({ from, to }).run();

    // Create a new transaction
    const tr = editor.state.tr;

    // Get the text content of the link
    const linkText = editor.state.doc.textBetween(from, to);

    console.log(linkText);

    // Replace the link with a new link with the updated href
    tr.replaceWith(
      from,
      to,
      editor.state.schema.text(linkText, [
        editor.state.schema.marks.link.create({ href: link.url }),
      ])
    );

    // Apply the transaction
    editor.view.dispatch(tr);

    // Replace the content of the link
    editor
      .chain()
      .focus()
      .deleteRange(from, to)
      .insertContent(link.label)
      .run();

    setOpen(false);
  };

  return (
    <Modal
      width={625}
      open={open}
      centered
      onCancel={() => setOpen(false)}
      title={'Edit link'}
      footer={[
        <footer
          key={'edit-link-modal-footer'}
          className="flex items-center justify-center pt-1 pb-2"
        >
          <button
            onClick={() => setOpen(false)}
            className="account-edit-btn account-edit-cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="account-edit-btn account-edit-confirm-btn"
          >
            Confirm
          </button>
        </footer>,
      ]}
      className="custom-modal"
    >
      <div className="edit-tag-container">
        <div className="edit-tag__item">
          <p className="edit-tag__title">Description | Label</p>
          <div className="social-input-title-text">
            <div
              onClick={() => setDescInputFocused(true)}
              ref={descInputRef}
              className={`social-input-container${
                isDescInputFocused ? ' social-input-container--active' : ''
              }`}
            >
              <input
                type="text"
                maxLength="100"
                placeholder="Enter link description"
                value={link.label}
                onChange={(e) => setLink({ ...link, label: e.target.value })}
              />
              <span className="count-tip">{link.label.length}/100</span>
            </div>
          </div>
        </div>
        <div className="edit-tag__item">
          <p className="edit-tag__title">Path | URL</p>
          <div className="social-input-title-text">
            <div
              onClick={() => setUrlInputFocused(true)}
              ref={urlInputRef}
              className={`social-input-container${
                isUrlInputFocused ? ' social-input-container--active' : ''
              }`}
            >
              <input
                type="text"
                maxLength="100"
                placeholder="Paste or enter URL beginning with https"
                value={link.url}
                onChange={(e) => setLink({ ...link, url: e.target.value })}
              />
              <span className="count-tip">{link.url.length}/100</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LinkEditModal;
