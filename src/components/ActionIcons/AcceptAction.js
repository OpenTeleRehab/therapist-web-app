import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FaCalendarCheck } from 'react-icons/fa';

export const AcceptAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.accept" /></Tooltip>}
  >
    <Button variant="link" className={`p-0 ${className}`} {...rest}>
      <FaCalendarCheck size={25} />
    </Button>
  </OverlayTrigger>
);

AcceptAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
