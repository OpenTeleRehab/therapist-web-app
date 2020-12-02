import React, { useState, useEffect } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import CreatePatient from './create';

import { getUsers } from 'store/user/actions';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../variables/routes';

const Patient = ({ translate }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState('');
  const handleClose = () => {
    setEditId('');
    setShow(false);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    dispatch(getUsers()).then(result => {
      if (result) {
        // setTotalCount(result.total_count);
      }
    });
  }, [dispatch]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('patient.management')}</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="primary" onClick={handleShow}>
            <BsPlus className="mr-1" />
            {translate('patient.new')}
          </Button>
        </div>

        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="primary" onClick={() => handleEdit(11)}>
            <BsPlus className="mr-1" />
            Edit
          </Button>
          <DropdownButton className="float-right" alignRight variant="outline-dark">
            <Dropdown.Item as={Link} to={ROUTES.TREATMENT_PLAN_CREATE_FOR_PATIENT.replace(':patientId', '2')}>
              {translate('common.create')}
            </Dropdown.Item>
            <Dropdown.Item as={Link} to={ROUTES.TREATMENT_PLAN_EDIT.replace(':id', '8')}>
              {translate('common.edit')}
            </Dropdown.Item>
          </DropdownButton>
        </div>
        {show && <CreatePatient handleClose={handleClose} show={show} editId={editId} />}
      </div>
    </>
  );
};

Patient.propTypes = {
  translate: PropTypes.func
};

export default Patient;
