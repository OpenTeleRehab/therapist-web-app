import React, { useState } from 'react';
import {
  FilteringState,
  SearchState,
  PagingState,
  CustomPaging
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableFilterRow,
  ColumnChooser,
  TableColumnVisibility,
  SearchPanel,
  TableHeaderRow,
  TableFixedColumns,
  PagingPanel
} from '@devexpress/dx-react-grid-bootstrap4';
import PropTypes from 'prop-types';

import Toolbar from 'components/Table/Toolbar';
import SearchInput from 'components/Table/SearchPanel/Input';
import FilterToggle from 'components/Table/FilterToggle';
import ToggleButton from 'components/Table/ColumnChooser/ToggleButton';

import '@icon/open-iconic/open-iconic.css';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';

const CustomTable = ({ rows, columns, columnExtensions, pageSize, setPageSize, currentPage, setCurrentPage, totalCount, setSearchValue }) => {
  const [showFilter, setShowFilter] = useState(false);

  const pageSizes = [10, 20, 30, 40, 50];
  const rightColumns = ['action'];
  const tableColumnExtensions = [...columnExtensions, { columnName: 'action', align: 'right', width: 120 }];
  const tableColumnVisibilityColumnExtensions = [{ columnName: 'action', togglingEnabled: false }];
  const filteringStateColumnExtensions = [{ columnName: 'action', filteringEnabled: false }];
  const FilterRow = (props) => <Table.Row className="filter" {...props} />;
  const FixedColumnCell = (props) => <TableFixedColumns.Cell {...props} showLeftDivider={false} />;

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <Grid
      rows={rows}
      columns={columns}>
      <SearchState onValueChange={setSearchValue} />
      <FilteringState defaultFilters={[]} columnExtensions={filteringStateColumnExtensions} />
      <PagingState
        currentPage={currentPage}
        onCurrentPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <CustomPaging
        totalCount={totalCount}
      />

      <Table columnExtensions={tableColumnExtensions} />
      <TableHeaderRow />
      {showFilter && <TableFilterRow rowComponent={FilterRow} />}
      <TableFixedColumns rightColumns={rightColumns} cellComponent={FixedColumnCell} />
      <TableColumnVisibility columnExtensions={tableColumnVisibilityColumnExtensions} />

      <Toolbar />
      <SearchPanel inputComponent={SearchInput} />
      <FilterToggle onToggle={toggleFilter} showFilter={showFilter} />
      <ColumnChooser toggleButtonComponent={ToggleButton} />
      <PagingPanel pageSizes={pageSizes} />
    </Grid>
  );
};

CustomTable.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  columnExtensions: PropTypes.array,
  pageSize: PropTypes.number,
  setPageSize: PropTypes.func,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  totalCount: PropTypes.number,
  setSearchValue: PropTypes.func
};

CustomTable.defaultProps = {
  columnExtensions: []
};

export default CustomTable;
