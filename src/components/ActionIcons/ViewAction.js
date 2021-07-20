import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { BsFillEyeFill } from 'react-icons/bs';

export const ViewAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.view" /></Tooltip>}
  >
    <Button aria-label="View" variant="link" className={`p-0 ${className}`} {...rest}>
      <BsFillEyeFill size={25} />
    </Button>
  </OverlayTrigger>
);

ViewAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
