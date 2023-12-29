import { Modal } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import axiosClient from '~/axios';
import FormInput from '~/components/Form/FormInput';
import FormInputWrap from '~/components/Form/FormInputWrap';
import ModalFooter from '~/components/Modal/ModalFooter';
import TiptapNoWrapper from '~/components/Tiptap/TiptapNoWrapper';
import useFlashcardStore from '~/store/useFlashcardStore';
import useModalStore from '~/store/useModalStore';
import { objUtils } from '~/utils';

const defaultCard = {
  front_title: '',
  front_content: '',
  back_title: '',
  back_content: '',
};

const defaultErrors = {
  front_title: [],
  back_title: [],
  state: false,
};

const FlashcardModal = ({ open, setOpen }) => {
  const [deck, selectedCard] = useFlashcardStore((state) => [
    state.deck,
    state.selectedCard,
  ]);

  const [shouldOpenFlashcardModal, setShouldOpenFlashcardModal] =
    useFlashcardStore((state) => [
      state.shouldOpenFlashcardModal,
      state.setShouldOpenFlashcardModal,
    ]);

  const [deckFlashcards, setDeckFlashcards] = useFlashcardStore((state) => [
    state.deckFlashcards,
    state.setDeckFlashcards,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const type = useMemo(() => {
    if (objUtils.isEmptyObject(selectedCard)) return 'create';
    return 'edit';
  }, [selectedCard]);

  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState(defaultCard);
  const [errors, setErrors] = useState(defaultErrors);

  useEffect(() => {
    if (!objUtils.isEmptyObject(selectedCard)) {
      setCard(selectedCard);
    } else setCard(defaultCard);
  }, [selectedCard]);

  useEffect(() => {
    if (shouldOpenFlashcardModal) {
      setOpen(true);
      setShouldOpenFlashcardModal(false); // Reset for next use
    }
  }, [shouldOpenFlashcardModal]);

  const handleConfirm = () => {
    setLoading(true);
    if (type === 'edit') {
      axiosClient
        .patch(`/flashcards/${selectedCard.id}`, card)
        .then(({ data }) => {
          const newCard = data.data;

          setDeckFlashcards(
            deckFlashcards.map((card) =>
              card.id === newCard.id ? newCard : card
            )
          );

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
              if (key === 'front_title') {
                errorsObj.front_title = responseErrors[key];
                errorsObj.state = true;
              } else if (key === 'back_title') {
                errorsObj.back_title = responseErrors[key];
                errorsObj.state = true;
              }
            }

            console.log(errorsObj);

            setErrors(errorsObj);
          }

          toast.error('Edit card failed!', {
            duration: 1500,
          });

          console.log(err);
        })
        .finally(() => setLoading(false));
    } else if (type === 'create') {
      axiosClient
        .post(`/flashcards`, {
          ...card,
          deck_id: deck.id,
        })
        .then(({ data }) => {
          const newCard = data.data;

          setDeckFlashcards([...deckFlashcards, newCard]);

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
              if (key === 'front_title') {
                errorsObj.front_title = responseErrors[key];
                errorsObj.state = true;
              } else if (key === 'back_title') {
                errorsObj.back_title = responseErrors[key];
                errorsObj.state = true;
              }
            }

            console.log(errorsObj);

            setErrors(errorsObj);
          }

          toast.error('Create card failed!', {
            duration: 1500,
          });

          console.log(err);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Modal
      width={768}
      open={open}
      centered
      onCancel={() => setOpen(false)}
      title={type === 'create' ? 'Create card' : 'Edit card'}
      afterClose={() => {
        if (type === 'create') {
          setCard(defaultCard);
        } else if (type === 'edit') {
          setCard(selectedCard);
        }
        setErrors(defaultErrors);
      }}
      className="custom-modal"
      footer={[
        <ModalFooter
          key={'flashcard-modal'}
          loading={loading}
          handleCancel={() => setOpen(false)}
          handleConfirm={handleConfirm}
        />,
      ]}
      mask={true}
      maskClosable={true}
    >
      <div className="add-fc-modal__container">
        <div className="add-section">
          {/* Front Title */}
          <FormInput
            label="Front Title | Terms"
            data={card}
            setData={(value) => {
              setCard(value);
            }}
            field="front_title"
            error={errors}
            type={'text'}
            maxLength={200}
            placeholder={'Please enter title (required)'}
            size={'sm'}
          />

          {/* Front Content */}
          <FormInputWrap
            label={'Front Content | Terms Description'}
            size="blocknote"
          >
            <div className="w-full h-[248px] overflow-y-auto px-4 pt-[10px] pb-4">
              <TiptapNoWrapper
                setData={(value) => {
                  setCard({
                    ...card,
                    front_content: value,
                  });
                }}
                content={card.front_content}
              />
            </div>
          </FormInputWrap>
        </div>
        <div className="section-divider"></div>
        <div className="add-section">
          {/* Back Title */}
          <FormInput
            label="Back Title | Definition"
            data={card}
            setData={(value) => {
              setCard(value);
            }}
            field="back_title"
            error={errors}
            type={'text'}
            maxLength={200}
            placeholder={'Please enter title (required)'}
            size={'sm'}
          />

          {/* Back Content */}
          <FormInputWrap
            label={"Back Content | Definition's Description"}
            size="blocknote"
          >
            <div className="w-full h-[248px] overflow-y-auto px-4 pt-[10px] pb-4">
              <TiptapNoWrapper
                setData={(value) => {
                  setCard({
                    ...card,
                    back_content: value,
                  });
                }}
                content={card.back_content}
              />
            </div>
          </FormInputWrap>
        </div>
      </div>
    </Modal>
  );
};

export default FlashcardModal;
