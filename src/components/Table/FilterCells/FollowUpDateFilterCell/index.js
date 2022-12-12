import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DateTime from 'components/DateTime';

import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import settings from 'settings';

const FollowUpDateFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [followUpDate, setFollowUpDate] = useState('');
  const handleApply = (event) => {
    setFollowUpDate(event);
    if (typeof event === 'object') {
      onFilter({ value: event.format(settings.date_format) });
    }
    if (typeof event === 'string') {
      setFollowUpDate('');
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
          placeholder: translate('placeholder.date'),
          title: 'follow up date'
        }}
        dateFormat={settings.date_format}
        timeFormat={false}
        closeOnSelect={true}
        value={followUpDate}
        onChange={handleApply}
      />
    </th>
  );
};

FollowUpDateFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default FollowUpDateFilterCell;
