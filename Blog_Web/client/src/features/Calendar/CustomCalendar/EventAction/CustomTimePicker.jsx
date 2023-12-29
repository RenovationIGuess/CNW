import React from 'react'
import { TimePicker } from 'antd';
const { RangePicker } = TimePicker;

const CustomTimePicker = ({ event, setEvent }) => {
  return (
    <RangePicker
      className='custom-time-picker'
      bordered={false}
    />
  )
}

export default CustomTimePicker