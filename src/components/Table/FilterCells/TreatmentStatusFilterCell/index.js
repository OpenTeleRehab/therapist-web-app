import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { STATUS } from 'variables/treatmentPlan';

const TreatmentStatusFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <th>
      <select
        className="form-control"
        value={filter ? filter.value : ''}
        onChange={e => onFilter(e.target.value ? { value: e.target.value } : null)}
      >
        <option value="">{ translate('common.all') }</option>
        {Object.keys(STATUS).map((item, index) => {
          return (<option key={index} value={STATUS[item]}>{translate('common.' + item)}</option>);
        })}
      </select>
    </th>
  );
};

TreatmentStatusFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default TreatmentStatusFilterCell;
