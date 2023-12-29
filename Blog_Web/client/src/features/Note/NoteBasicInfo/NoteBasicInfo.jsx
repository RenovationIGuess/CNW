import React, { useRef, useState } from 'react';
import { BsPostcardFill } from 'react-icons/bs';
import ModifyTagModal from '~/features/Tag/ModifyTagModal';
import useNoteStore from '~/store/useNoteStore';
import Tag from '~/features/Tag/Tag';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
import axiosClient from '~/axios';
import useModalStore from '~/store/useModalStore';

const NoteBasicInfo = () => {
  const [note, setNote, fetchNoteLoading] = useNoteStore((state) => [
    state.note,
    state.setNote,
    state.fetchNoteLoading,
  ]);

  const [updateNoteLoading, setUpdateNoteLoading] = useNoteStore((state) => [
    state.updateNoteLoading,
    state.setUpdateNoteLoading,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const ref = useRef();

  const [tagModalOpen, setTagModalOpen] = useState(false);

  return (
    <>
      <div ref={ref} className="side-section-db no-padding">
        <div className="side-section__header-border">
          <h2 className="side-section__title">
            <div className="flex items-center justify-between">
              <span>Basic Informations</span>
              <MdKeyboardDoubleArrowDown
                role="button"
                title="Edit page info"
                className="side-section__icon"
                onClick={() => {
                  ref &&
                    ref.current.classList.toggle('side-section-db--closed');
                }}
              />
            </div>
          </h2>
        </div>
        <div className="side-section__body-db">
          <div className="flex flex-col mb-4">
            {/* Attribute items */}
            <div className="page-id-container">
              <BsPostcardFill className="id-icon" />
              {fetchNoteLoading ? (
                <p className="skeleton skeleton-loading-height-20-width-20"></p>
              ) : (
                <p>Note's ID: {note.id}</p>
              )}
            </div>
          </div>
          {/* List of tags */}
          <div className="flex flex-col">
            <div className="tags-wrp__title">Tags</div>
            <div className="flex flex-wrap gap-[6px]">
              {fetchNoteLoading ? (
                <>
                  <div className="skeleton skeleton-loading-height-20-width-20"></div>
                  <div className="skeleton skeleton-loading-height-20-width-20"></div>
                  <div className="skeleton skeleton-loading-height-20-width-20"></div>
                  <div className="skeleton skeleton-loading-height-20-width-20"></div>
                </>
              ) : note.tags.length > 0 ? (
                note.tags.map((tag) => <Tag key={tag.id} tag={tag} />)
              ) : (
                <>
                  <p className="no-item">This note has no tag attached ~</p>
                </>
              )}
            </div>
          </div>
        </div>
        {/* <div className="side-section__footer no-border-top-short"></div> */}
        <div
          className="side-section__footer"
          onClick={() => setTagModalOpen(true)}
        >
          <span className="side-section__more">See more</span>
        </div>
      </div>

      {!fetchNoteLoading && (
        <ModifyTagModal
          dataType={note.data_type}
          itemId={note.id}
          itemTags={note.tags}
          tagModalOpen={tagModalOpen}
          setTagModalOpen={setTagModalOpen}
          callback={(selectedTags) => {
            setUpdateNoteLoading(true);
            axiosClient
              .patch(`/notes/${note.id}/tags`, {
                tag_ids: selectedTags.map((tag) => tag.id),
              })
              .then(({ data }) => {
                setNote(data.data);

                setActionToast({
                  status: true,
                  message: 'Updated',
                });

                setUpdateNoteLoading(false);
              })
              .catch((err) => console.error(err));
          }}
          callbackLoading={updateNoteLoading}
        />
      )}
    </>
  );
};

export default NoteBasicInfo;
