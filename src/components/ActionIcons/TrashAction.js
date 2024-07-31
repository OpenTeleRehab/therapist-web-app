import React from 'react';
import { Button } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';

export const TrashAction = ({ className, ...rest }) => (
  <Button aria-label="Delete" variant="danger" className={`${className}`} {...rest}>
    <FaTrashAlt size={15} className="mr-1" /><span><Translate id="common.delete" /></span>
  </Button>
);

TrashAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};
