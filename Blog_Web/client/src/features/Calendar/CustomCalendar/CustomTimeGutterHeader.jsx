import clsx from 'clsx';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import useCalendarStore from '~/store/useCalendarStore';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

const CustomTimeGutterHeader = () => {
  const [view, date] = useCalendarStore((state) => [state.view, state.date]);

  const { dayValue, dateValue } = useMemo(() => {
    return {
      dayValue: dayjs(date).format('D'),
      dateValue: dayjs(date).format('ddd'),
    };
  }, [date]);

  if (view === 'day')
    return (
      <div
        className={clsx('custom-time-gutter-header', 'custom-week-header', {
          'custom-week-header--active': dayjs(date).isToday(),
        })}
      >
        <div className="date-text">{dateValue}</div>
        <div className="day-text">{dayValue}</div>
      </div>
    );
  else return <></>;
};

export default CustomTimeGutterHeader;
