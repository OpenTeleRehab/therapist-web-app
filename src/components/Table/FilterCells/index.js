import React from 'react';
import PropTypes from 'prop-types';

import { TableFilterRow } from '@devexpress/dx-react-grid-bootstrap4';
import StatusFilterCell from 'components/Table/FilterCells/StatusFilterCell';
import TreatmentStatusFilterCell from 'components/Table/FilterCells/TreatmentStatusFilterCell';
import DateRangeFilterCell from 'components/Table/FilterCells/DateRangeFilterCell';
import DateOfBirthFilterCell from 'components/Table/FilterCells/DateOfBirthFilterCell';
import NumberFilterCell from './NumberFilterCell';
import TherapistTypeFilterCell from './TherapistTypeFilterCell';

const FilterCell = (props) => {
  const { column } = props;
  if (column.name === 'status') {
    return <StatusFilterCell {...props} />;
  } else if (column.name === 'treatment_status') {
    return <TreatmentStatusFilterCell {...props} />;
  } else if (column.name === 'start_date' || column.name === 'end_date') {
    return <DateRangeFilterCell {...props} />;
  } else if (column.name === 'action' || column.name === 'notification' || column.name === 'next_appointment') {
    return <th className="dx-g-bs4-fixed-cell position-sticky" style={{ right: 0 }} />;
  } else if (column.name === 'date_of_birth') {
    return <DateOfBirthFilterCell {...props} />;
  } else if (column.name === 'age') {
    return <NumberFilterCell {...props} />;
  } else if (column.name === 'secondary_therapist') {
    return <TherapistTypeFilterCell {...props} />;
  }
  return <TableFilterRow.Cell {...props} />;
};

FilterCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired
};

export default FilterCell;
