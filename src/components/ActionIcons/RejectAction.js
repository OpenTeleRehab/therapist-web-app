import React from 'react';
import { Button } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FaCalendarTimes } from 'react-icons/fa';

export const RejectAction = ({ className, ...rest }) => (
  <Button aria-label="Reject" variant="danger" className={`${className}`} {...rest}>
    <FaCalendarTimes size={15} /> <span className="mt-2" ><Translate id="common.decline" /></span>
  </Button>
);

RejectAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
