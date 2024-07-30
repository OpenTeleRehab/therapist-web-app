import React from 'react';
import { Button } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FaCalendarTimes } from 'react-icons/fa';

export const RejectAction = ({ className, ...rest }) => (
  <Button aria-label="Reject" className={`btn-danger ${className}`} {...rest}>
    <FaCalendarTimes size={20} /> <span><Translate id="common.decline" /></span>
  </Button>
);

RejectAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
