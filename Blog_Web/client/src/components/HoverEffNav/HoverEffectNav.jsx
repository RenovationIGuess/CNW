import React, { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '~/utils';

/* 
  data format:
  [
    {
      label: ,
      data_query: should be same as the label,
    }
  ]

  initData will be the index in the data array
*/
const HoverEffectNav = ({
  data,
  initData,
  init = false,
  callback = () => {},
}) => {
  const [currentHoverX, setCurrentHoverX] = useState(0);
  const [currentHoverWidth, setCurrentHoverWidth] = useState(0);
  const [currentActive, setCurrentActive] = useState({});

  const timeRef = useRef();
  const refs = useRef(data.map(() => createRef()));

  const firstElementRect = useMemo(() => {
    // The first found element
    if (!refs.current[0].current) return null;

    const firstElement = refs.current[0].current;
    return firstElement.getBoundingClientRect();
  }, [refs.current[0].current]);

  useEffect(() => {
    // if (!refs.current[initData].current || !firstElementRect) return;

    if (init) {
      const initDataRect =
        refs.current[initData].current.getBoundingClientRect();

      const hoverWidth = Math.round(initDataRect.width * 100) / 100;
      setCurrentHoverWidth(hoverWidth);

      if (initData > 0) {
        const hoverX =
          Math.round((initDataRect.left - firstElementRect.left) * 100) / 100;
        setCurrentHoverX(hoverX);
      }

      setCurrentActive({
        label: data[initData].label,
        index: initData,
      });
    }
  }, [init, initData, refs.current]);

  const handleHovered = (index) => {
    if (timeRef.current) clearTimeout(timeRef.current);

    const currentHoveredElement = refs.current[index].current;
    const currentElementRect = currentHoveredElement.getBoundingClientRect();

    const roundedValueWidth = Math.round(currentElementRect.width * 100) / 100;
    setCurrentHoverWidth(roundedValueWidth);

    const roundedValueX =
      Math.round((currentElementRect.left - firstElementRect.left) * 100) / 100;
    setCurrentHoverX(roundedValueX);
  };

  const handleClicked = (index, activeName) => {
    setCurrentActive({
      label: activeName,
      index: index,
    });

    callback(index);
  };

  const handleUnhovered = () => {
    timeRef.current = setTimeout(() => {
      // Needs to check the condition again here
      if (currentActive.index != null) {
        const currentElementRect =
          refs.current[currentActive.index].current.getBoundingClientRect();

        const roundedValueWidth =
          Math.round(currentElementRect.width * 100) / 100;
        setCurrentHoverWidth(roundedValueWidth);

        const roundedValueX =
          Math.round((currentElementRect.left - firstElementRect.left) * 100) /
          100;
        setCurrentHoverX(roundedValueX);
      } else {
        setCurrentHoverX(0);
        setCurrentHoverWidth(0);
      }
    }, 1000);
  };

  return (
    <>
      <div
        className="header__left"
        style={{
          '--ind-x': currentHoverX,
          '--ind-width': currentHoverWidth,
        }}
      >
        <div className="header-tab-wrapper relative">
          {data.map((item, index) => (
            <div
              className={cn(
                'header-tab mr-6',
                currentActive.index === index && ' header-tab--active'
              )}
              key={index}
              ref={refs.current[index]}
              data-active={item.data_query}
              onClick={() => handleClicked(index, item.label)}
              onMouseOver={() => handleHovered(index)}
              onMouseOut={() => handleUnhovered()}
            >
              <p data-query={item.data_query} className="header-tab-name">
                {item.label}
              </p>
            </div>
          ))}
          <div className="tab-underline"></div>
        </div>
      </div>
    </>
  );
};

export default HoverEffectNav;
