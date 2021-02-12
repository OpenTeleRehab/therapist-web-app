import React from 'react';
import {
  Template,
  TemplatePlaceholder,
  Plugin
} from '@devexpress/dx-react-core';
import { Button } from 'react-bootstrap';
import { FaNotesMedical } from 'react-icons/fa';
import { Translate } from 'react-localize-redux';
import * as ROUTES from '../../../variables/routes';
import { useHistory, useParams } from 'react-router-dom';

const CreateButton = () => {
  const { patientId } = useParams();
  const history = useHistory();
  const handleOnClick = () => {
    history.push(ROUTES.TREATMENT_PLAN_CREATE_FOR_PATIENT.replace(':patientId', patientId));
  };

  return (
    <Plugin>
      <Template name="toolbarContent">
        <TemplatePlaceholder />
        <Button
          className={'ml-auto'}
          variant="primary"
          onClick={handleOnClick}
        >
          <FaNotesMedical className="mr-1" />
          <Translate id="patient.create_treatment" />
        </Button>
      </Template>
    </Plugin>
  );
};

export default CreateButton;
