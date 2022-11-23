import React from 'react';
import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import { FaLanguage } from 'react-icons/fa';

export const TranslateAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.suggest_translation" /></Tooltip>}
  >
    <Button aria-label="Suggest Translation" variant="link" className={`text-primary p-0 ${className}`} {...rest}>
      <FaLanguage size={30} />
    </Button>
  </OverlayTrigger>
);

TranslateAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
