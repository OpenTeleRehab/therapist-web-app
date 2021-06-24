import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DateTime from 'components/DateTime';

import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import settings from 'settings';
import moment from 'moment/moment';

const NextAppointmentFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [date, setDate] = useState('');

  const validateDate = (current) => {
    return current.isAfter(moment().subtract(1, 'days'));
  };

  const handleApply = (event) => {
    setDate(event);
    if (typeof event === 'object') {
      onFilter({ value: event.format(settings.date_format) });
    }
    if (typeof event === 'string') {
      setDate('');
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
        value={date}
        onChange={handleApply}
        isValidDate={validateDate}
      />
    </th>
  );
};

NextAppointmentFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default NextAppointmentFilterCell;
