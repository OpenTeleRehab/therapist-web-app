import React from 'react';
import { Button } from 'react-bootstrap';
import { MdViewColumn } from 'react-icons/md';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';

const ToggleButton = ({ onToggle, buttonRef }) => (
  <Button
    variant="outline-dark"
    onClick={onToggle}
    ref={buttonRef}
  >
    <MdViewColumn size={22} className="mr-1" />
    <Translate id="common.columns" />
  </Button>
);

ToggleButton.propTypes = {
  onToggle: PropTypes.func.isRequired,
  buttonRef: PropTypes.func.isRequired
};

export default ToggleButton;
