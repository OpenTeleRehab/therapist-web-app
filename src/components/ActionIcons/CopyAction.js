import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { BiCopyAlt } from 'react-icons/bi';

export const CopyAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.copy" /></Tooltip>}
  >
    <Button variant="link" className={`p-0 ${className}`} {...rest}>
      <BiCopyAlt size={25} />
    </Button>
  </OverlayTrigger>
);

CopyAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
