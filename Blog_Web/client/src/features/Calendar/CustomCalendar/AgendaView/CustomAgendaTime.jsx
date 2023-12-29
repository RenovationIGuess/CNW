import React from 'react';
import { AiFillClockCircle } from 'react-icons/ai';

const CustomAgendaTime = ({ label }) => {
  return (
    <div className="custom-agenda-time">
      <div className="flex items-center">
        <AiFillClockCircle className="icon" />
        {label}
      </div>
    </div>
  );
};

export default CustomAgendaTime;
