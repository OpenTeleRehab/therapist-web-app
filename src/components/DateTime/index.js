import React from 'react';
import Datetime from 'react-datetime';

const renderInput = (props, openCalendar, closeCalendar) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      closeCalendar();
    }
  };

  return (
    <input {...props} onKeyDown={handleKeyDown} />
  );
};

const DateTime = (props) => {
  return (
    <Datetime
      {...props}
      renderInput={renderInput}
    />
  );
};

export default DateTime;
