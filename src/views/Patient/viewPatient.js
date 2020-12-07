import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import * as ROUTES from 'variables/routes';

import PatientInfo from 'views/Patient/Partials/patientInfo';
import TreatmentHistory from './treatmentHistory';
import CreatePatient from 'views/Patient/create';

const ViewPatient = () => {
  const { patientId } = useParams();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const [editId, setEditId] = useState('');
  const [show, setShow] = useState(false);

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
  };

  const handleClose = () => {
    setEditId('');
    setShow(false);
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <span>Patient / Patient Detail</span>
        <div className="btn-toolbar mb-2 mb-md-0">
          <DropdownButton alignRight variant="primary" title={translate('common.actions')}>
            <Dropdown.Item onClick={() => handleEdit(patientId)}>{translate('common.edit_info')}</Dropdown.Item>
            <Dropdown.Item as={Link} to={ROUTES.TREATMENT_PLAN_CREATE_FOR_PATIENT.replace(':patientId', patientId)}>{translate('patient.create_treatment')}</Dropdown.Item>
            <Dropdown.Item href="#/action-3">{translate('patient.deactivate_account')}</Dropdown.Item>
            <Dropdown.Item href="#/action-4">{translate('patient.delete_account')}</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>

      {show && <CreatePatient handleClose={handleClose} show={show} editId={editId} />}
      <PatientInfo id={patientId} translate={translate} />
      <TreatmentHistory />
    </>
  );
};

export default ViewPatient;
