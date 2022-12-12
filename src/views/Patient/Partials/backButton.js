import React from 'react';
import { Button } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import { BsChevronLeft } from 'react-icons/bs';
import * as ROUTES from '../../../variables/routes';

const BackButton = () => {
  return (
    <Button className="ml-auto" variant="outline-primary" as={Link} to={ROUTES.PATIENT}>
      <BsChevronLeft /> <Translate id="patient.back_to_list" />
    </Button>
  );
};

export default BackButton;
