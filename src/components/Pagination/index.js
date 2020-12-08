import React from 'react';
import { Form } from 'react-bootstrap';
import PaginationBootstrap from 'react-bootstrap-4-pagination';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

let recordStart = 0;
let recordEnd = 0;

const Pagination = ({ pageSize, totalCount, currentPage, setCurrentPage, showMax, pageSizes, setPageSize }) => {
  currentPage = Math.max(1, currentPage);
  const paginationConfig = {
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    currentPage,
    showMax
  };

  const handleClick = page => {
    setCurrentPage(page);
  };

  recordStart = totalCount <= 0 ? 0 : 1 + (currentPage - 1) * pageSize;
  recordEnd = Math.min(currentPage * pageSize, totalCount);

  return (
    <div>
      <span>
        <Translate
          id="common.paginate.show_number_of_records"
          data={{ recordStart, recordEnd, totalCount }}
        />
      </span>

      <div className="float-right mr-3">
        <PaginationBootstrap
          threeDots
          prevNext
          center={false}
          onClick={handleClick}
          {...paginationConfig}
        />
      </div>

      <Form inline className="float-right mr-5">
        <Form.Control as="select" value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
          {
            pageSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))
          }
        </Form.Control>
        <span className="ml-2">
          <Translate id="common.paginate.per_page" />
        </span>
      </Form>
    </div>
  );
};

Pagination.propTypes = {
  pageSize: PropTypes.number,
  totalCount: PropTypes.number,
  currentPage: PropTypes.number,
  showMax: PropTypes.number,
  setCurrentPage: PropTypes.func,
  pageSizes: PropTypes.array,
  setPageSize: PropTypes.func
};

Pagination.defaultProps = {
  totalCount: 0,
  currentPage: 1,
  showMax: 5,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40, 50]
};

export default Pagination;
