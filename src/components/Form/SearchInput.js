import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { BsSearch, BsX } from 'react-icons/bs';
import PropTypes from 'prop-types';

const SearchInput = ({ name, value, placeholder, onChange, onClear }) => {
  return (
    <Form.Group className="search-box-with-icon">
      <BsSearch className="search-icon" />
      <Button
        variant="light"
        className="clear-btn"
        onClick={onClear}
      >
        <BsX size={18} />
      </Button>
      <Form.Control
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        aria-label="Search"
      />
    </Form.Group>
  );
};

SearchInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func
};

SearchInput.defaultProps = {

};

export default SearchInput;
