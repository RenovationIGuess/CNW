import React from 'react';
import clsx from 'clsx';
import { Navigate as navigate } from '~/constants';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Tooltip } from 'antd';
import useCalendarStore from '~/store/useCalendarStore';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { useParams } from 'react-router-dom';

function ViewNamesGroup({ views: viewNames, view, messages, onView }) {
  return viewNames.map((name) => (
    <Tooltip key={name} title={messages[name]} placement="bottom">
      <button
        type="button"
        // key={name}
        className={clsx(
          { 'view-button--active': view === name },
          'view-button'
        )}
        onClick={() => onView(name)}
      >
        {messages[name].at(0)}
      </button>
    </Tooltip>
  ));
}

const CustomToolbar = ({
  label,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
}) => {
  const { id } = useParams();

  const [subCalendarClosed, setSubCalendarClosed, setScheduleDetailOpen] =
    useCalendarStore((state) => [
      state.subCalendarClosed,
      state.setSubCalendarClosed,
      state.setScheduleDetailOpen,
    ]);

  return (
    <div className="custom-toolbar">
      <div className="toolbar-left">
        {subCalendarClosed && (
          <button
            type="button"
            onClick={() => setSubCalendarClosed(false)}
            className="navigate-button open-sub-calendar-btn"
          >
            <MdKeyboardDoubleArrowRight className="navigate-button__icon" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onNavigate(navigate.TODAY)}
          aria-label={messages.today}
          className="today-button"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onNavigate(navigate.PREVIOUS)}
          aria-label={messages.previous}
          className="navigate-button ml-3"
        >
          <IoIosArrowBack className="navigate-button__icon" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate(navigate.NEXT)}
          aria-label={messages.next}
          className="navigate-button"
        >
          <IoIosArrowForward className="navigate-button__icon" />
        </button>
        <span className="toolbar-label">{label}</span>
      </div>

      <span className={clsx('toolbar-right')}>
        <ViewNamesGroup
          view={view}
          views={views}
          messages={messages}
          onView={onView}
        />
        {id && (
          <button
            type="button"
            onClick={() => setScheduleDetailOpen((prev) => !prev)}
            // aria-label={messages.today}
            className="today-button"
          >
            Schedule Detail
          </button>
        )}
      </span>
    </div>
  );
};

export default CustomToolbar;
