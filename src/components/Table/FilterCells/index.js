import React from 'react';
import PropTypes from 'prop-types';

import { TableFilterRow } from '@devexpress/dx-react-grid-bootstrap4';
import StatusFilterCell from 'components/Table/FilterCells/StatusFilterCell';
import TreatmentStatusFilterCell from 'components/Table/FilterCells/TreatmentStatusFilterCell';
import DateRangeFilterCell from 'components/Table/FilterCells/DateRangeFilterCell';

const FilterCell = (props) => {
  const { column } = props;
  if (column.name === 'status') {
    return <StatusFilterCell {...props} />;
  } else if (column.name === 'treatment_status') {
    return <TreatmentStatusFilterCell {...props} />;
  } else if (column.name === 'date_of_birth' || column.name === 'start_date' || column.name === 'end_date') {
    return <DateRangeFilterCell {...props} />;
  } else if (column.name === 'action' || column.name === 'age' || column.name === 'country' || column.name === 'clinic') {
    return <th className="dx-g-bs4-fixed-cell position-sticky" style={{ right: 0 }} />;
  }
  return <TableFilterRow.Cell {...props} />;
};

FilterCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired
};

export default FilterCell;
