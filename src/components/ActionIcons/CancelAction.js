import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FcCancel } from 'react-icons/fc';

export const CancelAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.cancel" /></Tooltip>}
  >
    <Button variant="link" className={`p-0 ${className}`} {...rest}>
      <FcCancel size={25} />
    </Button>
  </OverlayTrigger>
);

CancelAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
