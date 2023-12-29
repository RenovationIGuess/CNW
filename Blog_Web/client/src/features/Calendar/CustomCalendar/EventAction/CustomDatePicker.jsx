import React, { Fragment, useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

// const onChange = (date) => {
//   if (date) {
//     console.log('Date: ', date);
//   } else {
//     console.log('Clear');
//   }
// };

const rangePresets = [
  {
    label: 'Last 7 Days',
    value: [dayjs().add(-7, 'd'), dayjs()],
  },
  {
    label: 'Last 14 Days',
    value: [dayjs().add(-14, 'd'), dayjs()],
  },
  {
    label: 'Last 30 Days',
    value: [dayjs().add(-30, 'd'), dayjs()],
  },
  {
    label: 'Last 90 Days',
    value: [dayjs().add(-90, 'd'), dayjs()],
  },
  {
    label: 'Next 7 Days',
    value: [dayjs(), dayjs().add(7, 'd')],
  },
  {
    label: 'Next 14 Days',
    value: [dayjs(), dayjs().add(14, 'd')],
  },
  {
    label: 'Next 30 Days',
    value: [dayjs(), dayjs().add(30, 'd')],
  },
];

const CustomDatePicker = ({ event, setEvent, errors }) => {
  const [isEmpty, setIsEmpty] = useState(false);

  const onRangeChange = (dates, dateStrings) => {
    // console.log(dates);

    if (dates) {
      // console.log('From: ', dates[0], ', to: ', dates[1]);
      // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      setEvent({
        ...event,
        start_date: dates[0],
        end_date: dates[1],
      });
      setIsEmpty(false);
    } else {
      setEvent({
        ...event,
        start_date: null,
        end_date: null,
      });
      setIsEmpty(true);
    }
  };

  return (
    <Fragment>
      <RangePicker
        status={errors?.state && errors['date'] && isEmpty && 'error'}
        rootClassName="custom-date-picker"
        className="custom-date-picker"
        presets={[
          {
            label: (
              <span aria-label="Current Time to End of Day">Now ~ EOD</span>
            ),
            value: () => [dayjs(), dayjs().endOf('day')], // 5.8.0+ support function
          },
          ...rangePresets,
        ]}
        showTime
        value={[
          event.start_date instanceof Date
            ? dayjs(event.start_date)
            : event.start_date,
          event.end_date instanceof Date
            ? dayjs(event.end_date)
            : event.end_date,
        ]}
        format="YYYY/MM/DD HH:mm:ss"
        onChange={onRangeChange}
      />
      {errors?.state &&
        errors['date'] &&
        isEmpty &&
        errors['date']?.map((error, index) => (
          <p key={index} className="error-text font-normal">
            {error}
          </p>
        ))}
    </Fragment>
  );
};

export default CustomDatePicker;
