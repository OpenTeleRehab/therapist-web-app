import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { BiCalendarCheck } from 'react-icons/bi';

export const ApproveAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.approve" /></Tooltip>}
  >
    <Button variant="link" className={`p-0 ${className}`} {...rest}>
      <BiCalendarCheck size={25} />
    </Button>
  </OverlayTrigger>
);

ApproveAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
