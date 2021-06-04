import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FaCalendarTimes } from 'react-icons/fa';

export const RejectAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.reject" /></Tooltip>}
  >
    <Button variant="link" className={`text-danger p-0 ${className}`} {...rest}>
      <FaCalendarTimes size={25} />
    </Button>
  </OverlayTrigger>
);

RejectAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
