import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Button } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';

const Chip = ({ variant, label, onDelete }) => {
  return (
    <Badge className="chip" pill variant={variant}>
      {label}
      <Button className="close chip-clear" onClick={onDelete}>
        <BsX size={16}/>
      </Button>
    </Badge>
  );
};

Chip.propTypes = {
  variant: PropTypes.string,
  label: PropTypes.string,
  onDelete: PropTypes.func
};

Chip.defaultProps = {
  variant: 'primary'
};

export default Chip;
