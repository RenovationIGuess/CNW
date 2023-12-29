import React, { useEffect, useMemo, useRef, useState } from 'react';
import Liked from '~/components/Actions/Liked';
import Pinned from '~/components/Actions/Pinned';
import Top from '~/components/Actions/Top';

const PrioritySelector = ({ event, setEvent }) => {
  const [currentHoverX, setCurrentHoverX] = useState(0);
  const [currentHoverWidth, setCurrentHoverWidth] = useState(0);
  const [currentActive, setCurrentActive] = useState({});

  const timeRef = useRef();
  const highRef = useRef();
  const medRef = useRef();
  const lowRef = useRef();

  const { highWidth, highX } = useMemo(() => {
    if (!highRef.current)
      return {
        highWidth: 0,
        highX: 0,
      };

    const highRect = highRef.current.getBoundingClientRect();

    return {
      highWidth: highRect.width,
      highX: highRect.left,
    };
  }, [highRef.current]);

  const { medWidth, medX } = useMemo(() => {
    if (!medRef.current)
      return {
        medWidth: 0,
        medX: 0,
      };

    const medRect = medRef.current.getBoundingClientRect();

    return {
      medWidth: medRect.width,
      medX: medRect.left,
    };
  }, [medRef.current]);

  const { lowWidth, lowX } = useMemo(() => {
    if (!lowRef.current)
      return {
        lowWidth: 0,
        lowX: 0,
      };

    const lowRect = lowRef.current.getBoundingClientRect();

    return {
      lowWidth: lowRect.width,
      lowX: lowRect.left,
    };
  }, [lowRef.current]);

  useEffect(() => {
    let width = 0;
    let active = {};
    let x = 0;

    if (event.priority) {
      switch (event.priority) {
        case 'high':
          width = Math.round(highWidth * 100) / 100;
          active = {
            active_name: 'high',
            element_tag: highRef.current,
          };
          break;
        case 'medium':
          x = Math.round((medX - highX) * 100) / 100;
          width = Math.round(medWidth * 100) / 100;
          active = {
            active_name: 'medium',
            element_tag: medRef.current,
          };
          break;
        case 'low':
          x = Math.round((lowX - highX) * 100) / 100;
          width = Math.round(lowWidth * 100) / 100;
          active = {
            active_name: 'low',
            element_tag: lowRef.current,
          };
          break;
        default:
          break;
      }
    }

    setCurrentHoverX(x);
    setCurrentHoverWidth(width);
    setCurrentActive(active);
  }, [event.priority, highRef.current, medRef.current, lowRef.current]);

  const handleHovered = (e) => {
    if (timeRef.current) clearTimeout(timeRef.current);
    const currentHoveredElement = e.currentTarget;
    const currentElementRect = currentHoveredElement.getBoundingClientRect();

    const roundedValueWidth = Math.round(currentElementRect.width * 100) / 100;
    setCurrentHoverWidth(roundedValueWidth);

    const roundedValueX =
      Math.round((currentElementRect.left - highX) * 100) / 100;
    setCurrentHoverX(roundedValueX);
  };

  const handleClicked = (e, priority) => {
    setCurrentActive({
      active_name: priority.name,
      element_tag: e.currentTarget,
    });
    setEvent({
      ...event,
      priority: priority.name,
      background_color: priority.color,
    });
  };

  const handleUnhovered = () => {
    timeRef.current = setTimeout(() => {
      if (currentActive.element_tag) {
        const currentElementRect =
          currentActive.element_tag.getBoundingClientRect();

        const roundedValueWidth =
          Math.round(currentElementRect.width * 100) / 100;
        setCurrentHoverWidth(roundedValueWidth);

        const roundedValueX =
          Math.round((currentElementRect.left - highX) * 100) / 100;
        setCurrentHoverX(roundedValueX);
      } else {
        setCurrentHoverX(0);
        setCurrentHoverWidth(0);
      }
    }, 1000);
  };

  return (
    <div
      className="priority-selector"
      style={{
        '--ind-x': currentHoverX,
        '--ind-width': currentHoverWidth,
      }}
    >
      <div className="flex items-center gap-4 relative">
        <div
          className="priority-wrapper"
          data-active="high"
          onClick={(e) =>
            handleClicked(e, {
              name: 'high',
              color: '#ff7033',
            })
          }
          onMouseOver={(e) => handleHovered(e)}
          onMouseOut={() => handleUnhovered()}
          ref={highRef}
        >
          <Top content="High" />
        </div>
        <div
          className="priority-wrapper"
          data-active="medium"
          onClick={(e) =>
            handleClicked(e, {
              name: 'medium',
              color: '#ff667e',
            })
          }
          onMouseOver={(e) => handleHovered(e)}
          onMouseOut={() => handleUnhovered()}
          ref={medRef}
        >
          <Liked content="Medium" />
        </div>
        <div
          className="priority-wrapper"
          data-active="low"
          onClick={(e) =>
            handleClicked(e, {
              name: 'low',
              color: '#00cc88',
            })
          }
          onMouseOver={(e) => handleHovered(e)}
          onMouseOut={() => handleUnhovered()}
          ref={lowRef}
        >
          <Pinned content="Low" />
        </div>
        <div className="tab-underline"></div>
      </div>
    </div>
  );
};

export default PrioritySelector;
