import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FaGoogle } from 'react-icons/fa';

export const TranslateAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.auto_translate" /></Tooltip>}
  >
    <Button aria-label="Auto translate" variant="link" className={`text-primary p-0 ${className}`} {...rest}>
      <FaGoogle size={20} />
    </Button>
  </OverlayTrigger>
);

TranslateAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
