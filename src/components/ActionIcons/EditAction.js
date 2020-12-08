import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { BiEdit } from 'react-icons/bi';

export const EditAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.edit" /></Tooltip>}
  >
    <Button variant="link" className={`p-0 ${className}`} {...rest}>
      <BiEdit size={25} />
    </Button>
  </OverlayTrigger>
);

EditAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
