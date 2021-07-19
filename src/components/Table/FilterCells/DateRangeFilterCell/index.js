import React from 'react';
import PropTypes from 'prop-types';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import settings from 'settings';

const DateRangeFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const handleApply = (event, picker) => {
    picker.element.val(
      picker.startDate.format(settings.date_format) +
      ' - ' +
      picker.endDate.format(settings.date_format)
    );

    onFilter({ value: picker.startDate.format(settings.date_format) + ' - ' + picker.endDate.format(settings.date_format) });
  };
  const handleCancel = (event, picker) => {
    picker.element.val('');
    onFilter(null);
  };

  return (
    <th>
      <DateRangePicker
        initialSettings={{
          autoUpdateInput: false,
          locale: {
            format: settings.date_format,
            cancelLabel: translate('common.clear'),
            applyLabel: translate('common.apply')
          }
        }}
        onApply={handleApply}
        onCancel={handleCancel}
      >
        <input
          type="text"
          className="form-control"
          value={filter ? filter.value : ''}
          placeholder={translate('common.timerange.placeholder')}
          readOnly
          onChange={e => onFilter(e.target.value ? { value: e.target.value } : null)}
          aria-label="Date range"
        />
      </DateRangePicker>
    </th>
  );
};

DateRangeFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default DateRangeFilterCell;
