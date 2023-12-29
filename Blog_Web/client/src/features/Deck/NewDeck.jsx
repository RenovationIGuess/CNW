import { Popover, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import FileLocationInput from '~/components/Form/FileLocationInput';
import FormInput from '~/components/Form/FormInput';
import TagSelectInput from '~/components/Form/TagSelectInput';
import IconSelector from '~/components/IconSelector/IconSelector';
import { debounce } from 'lodash';

const NewDeck = ({ deckRef, error }) => {
  const [deck, setDeck] = useState(deckRef.current);
  const [selectedTags, setSelectedTags] = useState([]);

  // Define the debounced function outside of the useEffect
  const debouncedSetData = useRef(
    debounce((value) => {
      deckRef.current = {
        ...deckRef.current,
        ...value,
      };
    }, 1000)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSetData.flush();
    };
  }, [debouncedSetData]);

  // Use useEffect to track changes to the fc state
  useEffect(() => {
    debouncedSetData(deck);
  }, [deck]);

  useEffect(() => {
    debouncedSetData({
      tag_ids: selectedTags.map((tag) => tag.id),
    });
  }, [selectedTags]);

  return (
    <div className="new-deck__container">
      <div className="icon-section">
        <div className="icon-select__container">
          <Popover
            rootClassName="custom-popover"
            content={
              <IconSelector callback={(icon) => setDeck({ ...deck, icon })} />
            }
            placement="bottom"
            trigger={'click'}
          >
            <Tooltip placement="top" title={'Click to change icon'}>
              <div className="icon-select__wrapper">
                {deck.icon.includes('/') ? (
                  <img src={deck.icon} alt="item-icon" />
                ) : (
                  <p className="text-5xl">{deck.icon}</p>
                )}
              </div>
            </Tooltip>
          </Popover>
        </div>
      </div>
      <div className="detail-section">
        <FormInput
          label="Title"
          data={deck}
          setData={setDeck}
          field="title"
          error={error}
          type={'text'}
          maxLength={200}
          placeholder={'Please enter title (required)'}
          size={'sm'}
        />
        <FormInput
          label="Description"
          data={deck}
          setData={setDeck}
          field="description"
          // error={error}
          type={'text'}
          maxLength={200}
          placeholder={'Description...'}
          size={'sm'}
        />
        <FileLocationInput
          setData={setDeck}
          label={'Choose save location'}
          desc={'Open folder'}
        />
        <TagSelectInput
          label={'Tags'}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>
    </div>
  );
};

export default NewDeck;
