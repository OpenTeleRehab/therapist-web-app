import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

const NumberFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  return (
    <th>
      <input type="number" className="form-control" onChange={(e) => onFilter(e.target.value ? { value: e.target.value } : null)} placeholder={translate('common.search.placeholder')} aria-label="Number"/>
    </th>
  );
};

NumberFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default NumberFilterCell;
