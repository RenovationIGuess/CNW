import React, { useRef, useState } from 'react';
import NewFlashcard from '../NewFlashcard';
import NewFlashcardButton from '../NewFlashcardButton';
import { toast } from 'sonner';
import axiosClient from '~/axios';
import useFlashcardStore from '~/store/useFlashcardStore';
import FloatMenu from '~/components/FloatMenu/FloatMenu';

const AddFlashcards = ({ initId, containerRef }) => {
  const [deck] = useFlashcardStore((state) => [state.deck]);

  const [deckFlashcards, setDeckFlashcards] = useFlashcardStore((state) => [
    state.deckFlashcards,
    state.setDeckFlashcards,
  ]);

  // Fc stands for flashcard
  const newFc = useRef([]);
  const [lastId, setLastId] = useState(initId ?? 1);
  const [newFcLength, setNewFcLength] = useState([]);
  const [fcErrors, setFcErrors] = useState([]);

  const filterNewFc = () => {
    const newFcCurrent = [];
    for (let i = 0; i < newFcLength.length; i++) {
      const fcs = newFc.current.filter((fc) => fc.key === newFcLength[i]);

      if (fcs.length > 1) {
        for (let j = 0; j < fcs.length; j++) {
          if (fcs[j].front_title !== '' || fcs[j].back_title !== '') {
            newFcCurrent.push(fcs[j]);
            break;
          }
        }
      } else if (fcs.length === 1) {
        newFcCurrent.push(fcs[0]);
      }
    }

    newFc.current = newFcCurrent;
  };

  // const filterNewFc = () => {
  //   const newFcCurrent = newFcLength.map(key => {
  //     const fcs = newFc.current.filter(fc => fc.key === key);
  //     if (fcs.length > 1) {
  //       return fcs.reduce((prev, curr) => {
  //         return (curr.front_title !== '' || curr.back_title !== '') ? curr : prev;
  //       }, fcs[0]);
  //     } else {
  //       return fcs[0];
  //     }
  //   });

  //   newFc.current = newFcCurrent;
  // };

  console.log(newFc.current);

  // Use to see if any of the adding flashcard has error
  const checkAddError = (index = -1) => {
    filterNewFc();

    let hasError = false;
    const errorArr = [];

    for (let i = 0; i < newFc.current.length; i++) {
      let errorObj = {
        key: newFc.current[i].key,
        front_title: [],
        back_title: [],
        state: false,
      };

      if (index === -1 || i === index) {
        if (newFc.current[i].front_title.length === 0) {
          errorObj.front_title.push('Please enter title (required)');
          errorObj.state = true;
          hasError = true;
        }

        if (newFc.current[i].back_title.length === 0) {
          errorObj.back_title.push('Please enter title (required)');
          errorObj.state = true;
          hasError = true;
        }
      }

      errorArr.push(errorObj);
    }

    return {
      hasError: hasError,
      errorArr: errorArr,
    };
  };

  // Add single card
  const handleAddFlashcard = (index) => {
    const toastId = toast.loading('Creating flashcard...', {
      position: 'bottom-center',
    });

    const { hasError, errorArr } = checkAddError(index);

    if (hasError) {
      setFcErrors(errorArr);
      toast.error('Please fill in all required fields!', {
        id: toastId,
        position: 'bottom-center',
        duration: 1500,
      });
    } else {
      const itemKey = newFc.current[index].key;
      axiosClient
        .patch(`/decks/${deck.id}/flashcards`, {
          flashcards: [newFc.current[index]],
        })
        .then(({ data }) => {
          const newFlashcard = data.data[0];
          newFc.current = newFc.current.filter((fc) => fc.key !== itemKey);
          setNewFcLength((prev) => prev.filter((item) => item !== itemKey));
          setDeckFlashcards([...deckFlashcards, newFlashcard]);
          setFcErrors((prev) => prev.filter((err) => err.key !== itemKey));

          toast.success('Created flashcard successfully!', {
            id: toastId,
            duration: 1500,
            position: 'bottom-center',
          });
        })
        .catch((err) => {
          console.error(err);

          if (err.response) {
            if (err.response.status === 500) {
              toast.error('Server Error!', {
                id: toastId,
                position: 'bottom-center',
                duration: 1500,
              });
            }
          }
        });
    }
  };

  const handleAddFlashcards = () => {
    const toastId = toast.loading('Creating flashcard...', {
      position: 'bottom-center',
    });

    const { hasError, errorArr } = checkAddError();

    if (hasError) {
      setFcErrors(errorArr);
      toast.error('Please fill in all required fields!', {
        id: toastId,
        position: 'bottom-center',
        duration: 1500,
      });
    } else {
      axiosClient
        .patch(`/decks/${deck.id}/flashcards`, {
          flashcards: newFc.current,
        })
        .then(({ data }) => {
          const newFlashcards = data.data;
          newFc.current = [];
          setNewFcLength([]);
          setDeckFlashcards([...deckFlashcards, ...newFlashcards]);
          setFcErrors([]);

          toast.success('Created flashcards successfully!', {
            id: toastId,
            duration: 1500,
            position: 'bottom-center',
          });
        })
        .catch((err) => {
          console.error(err);

          if (err.response) {
            if (err.response.status === 500) {
              toast.error('Server Error!', {
                id: toastId,
                position: 'bottom-center',
                duration: 1500,
              });
            }
          }
        });
    }
  };

  return (
    <>
      {newFcLength.map((item, index) => (
        <NewFlashcard
          key={item}
          index={index}
          data={newFc}
          setLength={setNewFcLength}
          error={fcErrors[index]}
          setErrors={setFcErrors}
          initId={initId}
          showCreateButton={true}
          handleAddFlashcard={handleAddFlashcard}
        />
      ))}

      <NewFlashcardButton
        label={initId + newFc.current.length + 1}
        callback={() => {
          newFc.current.push({
            key: lastId + 1,
            front_title: '',
            front_content: '',
            back_title: '',
            back_content: '',
          });
          setLastId(lastId + 1);
          setNewFcLength([...newFcLength, lastId + 1]);
        }}
      />

      {/* Float menu */}
      <FloatMenu
        containerRef={containerRef}
        showCreate={newFc.current.length > 0}
        handleCreate={handleAddFlashcards}
      />
    </>
  );
};

export default AddFlashcards;
