import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const QuestionText = ({ questionText, required }) => {
  return (
    <div className='mb-2'>
      <Form.Label className='font-weight-bold'>
        {questionText}
        {required === 1 && <span className='text-danger'> * </span>}
      </Form.Label>
    </div>
  );
};

QuestionText.propTypes = {
  questionText: PropTypes.string,
  required: PropTypes.number,
};

export default QuestionText;
