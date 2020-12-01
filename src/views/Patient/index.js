import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import CreatePatient from './create';

import { getUsers } from 'store/user/actions';

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
