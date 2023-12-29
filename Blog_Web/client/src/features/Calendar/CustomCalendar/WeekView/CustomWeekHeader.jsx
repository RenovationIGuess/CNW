import dayjs from 'dayjs';
import React, { useMemo } from 'react';

const CustomWeekHeader = ({ label }) => {
  // day - day in month
  // date - day of week
  const { day, date } = useMemo(() => {
    const [day, date] = label.split(' ');
    return { day, date };
  });

  return (
    <div
      className={`custom-week-header${
        dayjs().format('DD') === day ? ' custom-week-header--active' : ''
      }`}
    >
      <div className="date-text">{date}</div>
      <div className="day-text">{day}</div>
    </div>
  );
};

export default CustomWeekHeader;
