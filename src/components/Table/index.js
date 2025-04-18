import React, { useState } from 'react';
import {
  FilteringState,
  SearchState,
  PagingState,
  CustomPaging,
  IntegratedPaging,
  SortingState,
  IntegratedSorting
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
import { getTranslate } from 'react-localize-redux';
import Spinner from 'react-bootstrap/Spinner';

import Toolbar from 'components/Table/Toolbar';
import SearchInput from 'components/Table/SearchPanel/Input';
import FilterToggle from 'components/Table/FilterToggle';
import ToggleButton from 'components/Table/ColumnChooser/ToggleButton';
import FilterCells from 'components/Table/FilterCells';

import '@icon/open-iconic/open-iconic.css';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import { useSelector } from 'react-redux';

const FilterRow = (props) => <Table.Row className="filter" {...props} />;
const FixedColumnCell = (props) => <TableFixedColumns.Cell {...props} showLeftDivider={false} />;

const CustomTable = ({
  rows, columns, columnExtensions, pageSize, setPageSize, currentPage,
  setCurrentPage, totalCount, setSearchValue, setFilters, onRowClick, hover, filters,
  rightButton, hideSearchFilter, remotePaging, defaultSoringColumns, defaultHiddenColumnNames, loading
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [showFilter, setShowFilter] = useState(false);

  const pageSizes = [60, 120, 180, 240];
  const rightColumns = ['action'];
  const tableColumnExtensions = [...columnExtensions, { columnName: 'action', align: 'center', width: 120 }];
  const tableColumnVisibilityColumnExtensions = [{ columnName: 'action', togglingEnabled: false }];
  const filteringStateColumnExtensions = [{ columnName: 'action', filteringEnabled: false }];

  const toggleFilter = () => {
    if (filters && filters.length) {
      setFilters([]);
    }
    setShowFilter(!showFilter);
  };

  const handlePageSizeChange = value => {
    setCurrentPage(0);
    setPageSize(value);
  };

  return (
    <div className="position-relative">
      <Grid
        rows={rows}
        columns={columns}>
        <SearchState onValueChange={setSearchValue} />
        <FilteringState filters={filters} defaultFilters={[]} onFiltersChange={setFilters} columnExtensions={filteringStateColumnExtensions} />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
        <SortingState
          defaultSorting={defaultSoringColumns}
        />
        <IntegratedSorting />
        {remotePaging ? <CustomPaging totalCount={totalCount} /> : <IntegratedPaging />}
        {onRowClick
          ? <Table columnExtensions={tableColumnExtensions} rowComponent={props => <TableRow {...props} handleClick={onRowClick} className={hover} tabIndex={0} />} />
          : <Table columnExtensions={tableColumnExtensions} />
        }
        <TableHeaderRow />
        {showFilter && <TableFilterRow rowComponent={FilterRow} cellComponent={FilterCells} messages={{ filterPlaceholder: translate('common.search.placeholder') }} />}
        <TableFixedColumns rightColumns={rightColumns} cellComponent={FixedColumnCell} />
        <TableColumnVisibility columnExtensions={tableColumnVisibilityColumnExtensions} defaultHiddenColumnNames={defaultHiddenColumnNames} />

        <Toolbar />
        {!hideSearchFilter && <SearchPanel inputComponent={SearchInput} /> }
        {!hideSearchFilter && <FilterToggle onToggle={toggleFilter} showFilter={showFilter} /> }
        {!hideSearchFilter && <ColumnChooser toggleButtonComponent={ToggleButton} /> }
        {rightButton}
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
      {loading && <Spinner animation="border" variant="primary" className="loading-spinner"/>}
    </div>
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
  setSearchValue: PropTypes.func,
  setFilters: PropTypes.func,
  onRowClick: PropTypes.func,
  hover: PropTypes.string,
  filters: PropTypes.array,
  rightButton: PropTypes.object,
  hideSearchFilter: PropTypes.bool,
  remotePaging: PropTypes.bool,
  defaultSoringColumns: PropTypes.array,
  defaultHiddenColumnNames: PropTypes.array,
  loading: PropTypes.bool
};

CustomTable.defaultProps = {
  columnExtensions: [],
  remotePaging: true,
  loading: false
};

export default CustomTable;

const TableRow = ({ row, handleClick, className, ...rest }) => (
  <Table.Row
    {...rest}
    onClick={() => handleClick(row)}
    onKeyPress={(event) => event.key === 'Enter' && handleClick(row)}
    className={className}
    style={{ cursor: 'pointer' }}
  />
);

TableRow.propTypes = {
  row: PropTypes.object,
  handleClick: PropTypes.func,
  className: PropTypes.string
};
