import React from 'react';
import { Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

let recordStart = 0;
let recordEnd = 0;

const Pagination = ({ pageSize, totalCount, currentPage, setCurrentPage, pageSizes, setPageSize }) => {
  currentPage = Math.max(1, currentPage);

  const handleClick = page => {
    setCurrentPage(page.selected + 1);
  };

  const handlePageSizeChange = e => {
    setCurrentPage(1);
    setPageSize(e.target.value);
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
        <ReactPaginate
          previousLabel={'⟨'}
          nextLabel={'⟩'}
          breakLabel={'...'}
          pageCount={Math.max(1, Math.ceil(totalCount / pageSize))}
          marginPagesDisplayed={2}
          pageRangeDisplayed={4}
          onPageChange={handleClick}
          containerClassName={'pagination'}
          activeClassName={'active-paginate'}
          disabledClassName={'disable-style'}
        />
      </div>

      <Form inline className="float-right mr-5">
        <Form.Control as="select" value={pageSize} onChange={handlePageSizeChange}>
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
  setCurrentPage: PropTypes.func,
  pageSizes: PropTypes.array,
  setPageSize: PropTypes.func
};

Pagination.defaultProps = {
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40, 50]
};

export default Pagination;
