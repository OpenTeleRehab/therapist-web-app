import React, { useContext } from 'react';
import { AccordionContext, useAccordionToggle, Button } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import PropTypes from 'prop-types';

const CollapseToggle = ({ title, eventKey }) => {
  const currentEventKey = useContext(AccordionContext);
  const handleOnClick = useAccordionToggle(eventKey);

  return (
    <>
      <div className="d-flex justify-content-center">
        {currentEventKey !== eventKey &&
          <h6>{title}</h6>
        }
      </div>
      <div className="accordion-collapse-toggle">
        <div className="button-wrapper">
          <Button aria-label="collapse expand" variant="outline-primary" className="btn-circle" onClick={handleOnClick}>
            {currentEventKey === eventKey
              ? <BsChevronUp size={14} />
              : <BsChevronDown size={14} />
            }
          </Button>
        </div>
        <hr />
      </div>
    </>
  );
};

CollapseToggle.propTypes = {
  title: PropTypes.string,
  eventKey: PropTypes.string
};

export default CollapseToggle;
