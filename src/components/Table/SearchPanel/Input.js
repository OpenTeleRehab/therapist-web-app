import React from 'react';
import { Form } from 'react-bootstrap';
import { withLocalize } from 'react-localize-redux';
import PropTypes from 'prop-types';

const Input = ({ onValueChange, value, translate }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return true;
  };

  return (
    <Form inline onSubmit={handleSubmit}>
      <Form.Control
        className="mr-2"
        name="search"
        onChange={(e) => onValueChange(e.target.value)}
        value={value}
        placeholder={translate('common.search.placeholder')}
      />
    </Form>
  );
};

Input.propTypes = {
  value: PropTypes.any,
  onValueChange: PropTypes.func.isRequired,
  translate: PropTypes.func
};

export default withLocalize(Input);
