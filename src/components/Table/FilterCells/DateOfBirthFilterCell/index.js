import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DateTime from 'components/DateTime';

import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import settings from 'settings';
import moment from 'moment/moment';

const DateOfBirthFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [dateOfBirth, setDateOfBirth] = useState('');

  const validateDate = (current) => {
    return current.isBefore(moment());
  };

  const handleApply = (event) => {
    setDateOfBirth(event);
    if (typeof event === 'object') {
      onFilter({ value: event.format(settings.date_format) });
    }
    if (typeof event === 'string') {
      setDateOfBirth('');
      onFilter(null);
    }
  };

  return (
    <th>
      <DateTime
        inputProps={{
          name: 'date',
          autoComplete: 'off',
          className: 'form-control',
          placeholder: translate('placeholder.date')
        }}
        dateFormat={settings.date_format}
        timeFormat={false}
        closeOnSelect={true}
        value={dateOfBirth}
        onChange={handleApply}
        isValidDate={validateDate}
      />
    </th>
  );
};

DateOfBirthFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default DateOfBirthFilterCell;
