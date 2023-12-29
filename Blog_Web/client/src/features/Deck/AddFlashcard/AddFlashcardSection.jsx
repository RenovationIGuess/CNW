import React, { useEffect, useRef, useState } from 'react';
import FormInputWrap from '~/components/Form/FormInputWrap';
import FormInput from '~/components/Form/FormInput';
import useComponentVisible from '~/hooks/useComponentVisible';
import TiptapNoWrapper from '~/components/Tiptap/TiptapNoWrapper';
import { debounce } from 'lodash';
import { cn } from '~/utils';
import { BsTextParagraph } from 'react-icons/bs';

const AddFlashcardSection = ({ index, data, error }) => {
  // fc stands for flashcard - for short reasons
  const [fc, setFc] = useState({
    key: data.current[index]?.key || 1,
    front_title: '',
    front_content: '',
    back_title: '',
    back_content: '',
  });

  const [addFrontDesc, setAddFrontDesc] = useState(false);
  const [addBackDesc, setAddBackDesc] = useState(false);

  // Define the debounced function outside of the useEffect
  const debouncedSetData = useRef(
    debounce((value) => {
      data.current[index] = value;
    }, 1000)
  ).current;

  // Use useEffect to track changes to the fc state
  useEffect(() => {
    debouncedSetData(fc);
  }, [fc]);

  return (
    <div className="px-6 flex add-flashcard__container">
      <div className="add-section">
        {/* Front Title */}
        <FormInput
          label="Front Title | Terms"
          data={fc}
          setData={(value) => {
            setFc(value);
          }}
          field="front_title"
          error={error}
          type={'text'}
          maxLength={200}
          placeholder={'Please enter title (required)'}
          size={'sm'}
        />

        {/* Front Content */}
        {addFrontDesc && (
          <FormInputWrap
            label={'Front Content | Terms Description'}
            size="blocknote"
          >
            <div className="w-full min-h-[168px] px-4 pt-[10px] pb-4">
              <TiptapNoWrapper
                setData={(value) => {
                  setFc({
                    ...fc,
                    front_content: value,
                  });
                }}
                content={fc.front_content}
              />
            </div>
          </FormInputWrap>
        )}

        <div
          className={cn(`banner-entry`, 'mt-4')}
          onClick={() => {
            setAddFrontDesc(!addFrontDesc);
          }}
        >
          <BsTextParagraph className="icon" />
          <p>{addFrontDesc ? 'Remove Description' : 'Add Description'}</p>
        </div>
      </div>
      <div className="section-divider"></div>
      <div className="add-section">
        {/* Back Title */}
        <FormInput
          label="Back Title | Definition"
          data={fc}
          setData={(value) => {
            setFc(value);
          }}
          field="back_title"
          error={error}
          type={'text'}
          maxLength={200}
          placeholder={'Please enter title (required)'}
          size={'sm'}
        />

        {/* Back Content */}
        {addBackDesc && (
          <FormInputWrap
            label={"Back Content | Definition's Description"}
            size="blocknote"
          >
            <div className="w-full min-h-[168px] px-4 pt-[10px] pb-4">
              <TiptapNoWrapper
                setData={(value) => {
                  setFc({
                    ...fc,
                    back_content: value,
                  });
                }}
                content={fc.back_content}
              />
            </div>
          </FormInputWrap>
        )}

        <div
          className={cn(`banner-entry`, 'mt-4')}
          onClick={() => {
            setAddBackDesc(!addBackDesc);
          }}
        >
          <BsTextParagraph className="icon" />
          <p>{addBackDesc ? 'Remove Description' : 'Add Description'}</p>
        </div>
      </div>
    </div>
  );
};

export default AddFlashcardSection;
