import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';

const CustomDateHeader = ({ label, drilldownView, onDrillDown }) => {
  if (!drilldownView) {
    return <span>{label}</span>;
  }

  return (
    <button
      type="button"
      className={clsx('rbc-button-link', 'custom-date-header', {
        'date-header--today': parseInt(label) === dayjs().date(),
      })}
      onClick={onDrillDown}
      role="cell"
    >
      {label}
    </button>
  );
};

export default CustomDateHeader;
