import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axiosClient from '~/axios';
import AttachTagsSection from '~/components/Modal/AttachTagsSection';
import ChooseLocation from '~/components/Modal/ChooseLocation';
import IconSection from '~/components/Modal/IconSection';
import InputSection from '~/components/Modal/InputSection';
import { userStateContext } from '~/contexts/ContextProvider';
import useFlashcardStore from '~/store/useFlashcardStore';
import useModalStore from '~/store/useModalStore';
import useSidebarStore from '~/store/useSidebarStore';

const defaultDeckValue = {
  title: 'New Deck',
  icon: import.meta.env.VITE_DEFAULT_DECK_ICON_URL,
  background_image: '',
  description: '',
  directory_id: null,
};

// This modal use for create & edit
const NewDeckModal = ({ open, setOpen, type }) => {
  const { currentUser } = userStateContext();

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [decks, setDecks] = useFlashcardStore((state) => [
    state.decks,
    state.setDecks,
  ]);
  const [errors, setErrors] = useState({
    state: false,
  });

  const [handleAddItemWithParentId] = useSidebarStore((state) => [
    state.handleAddItemWithParentId,
  ]);

  const [setSelectedPath] = useModalStore((state) => [state.setSelectedPath]);

  const [selectedTags, setSelectedTags] = useState([]);

  // Hold new deck info
  const [deck, setDeck] = useState(defaultDeckValue);
  const [createDeckLoading, setCreateDeckLoading] = useState(false);

  useEffect(() => {
    setSelectedPath([]);
  }, [open]);

  const handleConfirm = () => {
    setCreateDeckLoading(true);
    axiosClient
      .post(`/decks`, {
        ...deck,
        user_id: currentUser.id,
        directory_id: deck.directory_id ?? currentUser.private_dir.id,
        tag_ids: selectedTags.map((tag) => tag.id),
      })
      .then(({ data }) => {
        const newData = data.data;
        const parentId = newData.directory_id;

        handleAddItemWithParentId(newData, parentId);

        setDecks([newData, ...decks]);

        setActionToast({
          status: true,
          message: 'Created',
        });

        setOpen(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          const responseErrors = err.response.data.message;

          const errorsObj = {
            state: false, // This will tell us do we have errors or not
          };

          for (const key of Object.keys(responseErrors)) {
            if (key === 'title') {
              errorsObj.title = responseErrors[key];
              errorsObj.state = true;
            }
          }

          setErrors(errorsObj);
        }

        toast.error('Add deck failed!', {
          duration: 1500,
        });

        console.log(err);
      })
      .finally(() => {
        setCreateDeckLoading(false);
      });
  };

  return (
    <Modal
      width={525}
      open={open}
      centered
      onCancel={() => setOpen(false)}
      title={type === 'edit' ? 'Edit deck' : 'Create new deck'}
      afterClose={() => {
        setDeck(defaultDeckValue);
        setSelectedTags([]);
        // setSelectedPath([]); // Reset selected path
        setErrors({ state: false });
      }}
      className="custom-modal"
      footer={[
        <footer
          key={'modal-footer'}
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
            {!createDeckLoading ? (
              <>Confirm</>
            ) : (
              <>
                <span className="my-loader account-bg-loader"></span>
                Loading...
              </>
            )}
          </button>
        </footer>,
      ]}
      mask={true}
      maskClosable={true}
    >
      <div className="edit-tag-container modal-container">
        <IconSection title={'Icon'} item={deck} setItem={setDeck} />
        <InputSection
          item={deck}
          setItem={setDeck}
          title={'Title'}
          maxLength={48}
          field={'title'}
          placeholder={'Please enter title (required)'}
          errors={errors}
        />
        <InputSection
          item={deck}
          setItem={setDeck}
          title={'Description'}
          maxLength={100}
          field={'description'}
          placeholder={'Description...'}
          errors={errors}
        />
        <ChooseLocation
          title={'Choose location'}
          desc={'Choose Location'}
          item={deck}
          setItem={setDeck}
        />
        <AttachTagsSection
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>
    </Modal>
  );
};

export default NewDeckModal;
