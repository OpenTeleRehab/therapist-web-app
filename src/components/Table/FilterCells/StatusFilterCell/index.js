import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

const StatusFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <th>
      <select
        className="form-control"
        value={filter ? filter.value : ''}
        onChange={e => onFilter(e.target.value ? { value: e.target.value } : null)}
      >
        <option value={null}>{ translate('common.all') }</option>
        <option value="1">{ translate('common.active') }</option>
        <option value="0">{ translate('common.inactive') }</option>
      </select>
    </th>
  );
};

StatusFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default StatusFilterCell;
