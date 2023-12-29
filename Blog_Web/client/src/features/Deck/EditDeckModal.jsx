import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import axiosClient from '~/axios';
import AttachTagsSection from '~/components/Modal/AttachTagsSection';
import ChooseLocation from '~/components/Modal/ChooseLocation';
import IconSection from '~/components/Modal/IconSection';
import InputSection from '~/components/Modal/InputSection';
import ModalFooter from '~/components/Modal/ModalFooter';
import { userStateContext } from '~/contexts/ContextProvider';
import useFlashcardStore from '~/store/useFlashcardStore';
import useModalStore from '~/store/useModalStore';
import useSidebarStore from '~/store/useSidebarStore';
import { objUtils } from '~/utils';

// This modal use for create & edit
const EditDeckModal = ({ open, setOpen, selectedDeck }) => {
  const { pathname } = useLocation();

  const { currentUser } = userStateContext();

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [decks, setDecks] = useFlashcardStore((state) => [
    state.decks,
    state.setDecks,
  ]);

  const [shouldOpenModal, setShouldOpenModal] = useFlashcardStore((state) => [
    state.shouldOpenModal,
    state.setShouldOpenModal,
  ]);

  const [setDeck] = useFlashcardStore((state) => [state.setDeck]);

  const [errors, setErrors] = useState({
    state: false,
  });

  const [handleUpdateItemWithParentId] = useSidebarStore((state) => [
    state.handleUpdateItemWithParentId,
  ]);

  const [selectedPath, setSelectedPath] = useModalStore((state) => [
    state.selectedPath,
    state.setSelectedPath,
  ]);

  const [selectedTags, setSelectedTags] = useState([]);

  // Hold new deck info
  const [tempDeck, setTempDeck] = useState(selectedDeck);
  const [editDeckLoading, setEditDeckLoading] = useState(false);

  useEffect(() => {
    if (shouldOpenModal && !objUtils.isEmptyObject(selectedDeck)) {
      setOpen(true);
      setShouldOpenModal(false); // Reset for next use
    }
  }, [selectedDeck, shouldOpenModal]);

  useEffect(() => {
    if (objUtils.isEmptyObject(selectedDeck)) return;
    setTempDeck(selectedDeck);
    setSelectedPath(selectedDeck.path);
    setSelectedTags(selectedDeck.tags);
  }, [selectedDeck]);

  if (objUtils.isEmptyObject(selectedDeck) || objUtils.isEmptyObject(tempDeck))
    return <></>;

  const handleConfirm = () => {
    setEditDeckLoading(true);

    const rootType = selectedPath[0].title.toLowerCase();
    const itemParentId = selectedDeck.directory_id;
    const dirDiff =
      selectedDeck.path[0].id !== currentUser[`${rootType}_dir`].id;

    axiosClient
      .patch(`/decks/${tempDeck.id}`, {
        ...tempDeck,
        tag_ids: selectedTags.map((tag) => tag.id),
      })
      .then(({ data }) => {
        const newData = data.data;
        const parentId = newData.directory_id;

        handleUpdateItemWithParentId(
          newData,
          itemParentId,
          parentId,
          rootType,
          dirDiff
        );

        if (pathname === '/decks') {
          setDecks(
            decks.map((deck) => (deck.id === newData.id ? newData : deck))
          );
        }

        if (pathname === `/decks/${newData.id}`) {
          setDeck(newData);
        }

        setActionToast({
          status: true,
          message: 'Updated',
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

        toast.error('Edit deck failed!', {
          duration: 1500,
        });

        console.log(err);
      })
      .finally(() => {
        setEditDeckLoading(false);
      });
  };

  return (
    <Modal
      width={525}
      open={open}
      centered
      onCancel={() => setOpen(false)}
      title={'Edit deck'}
      afterClose={() => {
        setTempDeck(selectedDeck);
        setSelectedTags(selectedDeck.tags);
        // setSelectedPath([]); // Reset selected path
        setErrors({ state: false });
      }}
      className="custom-modal"
      footer={[
        <ModalFooter
          key={'edit-deck-modal'}
          loading={editDeckLoading}
          handleCancel={() => setOpen(false)}
          handleConfirm={handleConfirm}
        />,
      ]}
      mask={true}
      maskClosable={true}
    >
      <div className="edit-tag-container modal-container">
        <IconSection title={'Icon'} item={tempDeck} setItem={setTempDeck} />
        <InputSection
          item={tempDeck}
          setItem={setTempDeck}
          title={'Title'}
          maxLength={48}
          field={'title'}
          placeholder={'Please enter title (required)'}
          errors={errors}
        />
        <InputSection
          item={tempDeck}
          setItem={setTempDeck}
          title={'Description'}
          maxLength={100}
          field={'description'}
          placeholder={'Description...'}
          errors={errors}
        />
        <ChooseLocation
          title={'Choose location'}
          desc={'Choose Location'}
          item={tempDeck}
          setItem={setTempDeck}
        />
        <AttachTagsSection
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>
    </Modal>
  );
};

export default EditDeckModal;
