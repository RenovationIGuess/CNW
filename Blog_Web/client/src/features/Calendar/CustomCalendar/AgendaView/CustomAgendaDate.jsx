import clsx from 'clsx';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Views } from 'react-big-calendar';
import useCalendarStore from '~/store/useCalendarStore';

const CustomAgendaDate = (props) => {
  const { label } = props;

  const [setDate, setView] = useCalendarStore((state) => [
    state.setDate,
    state.setView,
  ]);

  const [day, month, date] = useMemo(() => {
    return label.split(' ');
  }, []);

  return (
    <div className="custom-agenda-date">
      <div
        className={clsx('agenda-date-text', {
          'agenda-date-text--active': dayjs().format('D') === day,
        })}
        onClick={() => {
          setView(Views.DAY);
          setDate(props.day);
        }}
      >
        {day}
      </div>
      <div
        className={clsx('agenda-text', {
          'agenda-text--active':
            dayjs().format('MMMM') === month &&
            dayjs().format('ddd') === date &&
            dayjs().format('D') === day,
        })}
      >
        {month + ', ' + date}
      </div>
    </div>
  );
};

export default CustomAgendaDate;
