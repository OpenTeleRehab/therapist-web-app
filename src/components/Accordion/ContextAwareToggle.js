import React, { useContext } from 'react';
import { AccordionContext } from 'react-bootstrap';
import { BsChevronRight, BsChevronDown } from 'react-icons/bs';
import PropTypes from 'prop-types';

export const ContextAwareToggle = ({ eventKey }) => {
  const currentEventKey = useContext(AccordionContext);

  if (currentEventKey === eventKey) {
    return <BsChevronDown className="ml-auto" />;
  }

  return <BsChevronRight className="ml-auto" />;
};

ContextAwareToggle.propTypes = {
  eventKey: PropTypes.string
};
