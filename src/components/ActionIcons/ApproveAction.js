import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FcApproval } from 'react-icons/fc';

export const ApproveAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.approve" /></Tooltip>}
  >
    <Button variant="link" className={`p-0 ${className}`} {...rest}>
      <FcApproval size={25} />
    </Button>
  </OverlayTrigger>
);

ApproveAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
