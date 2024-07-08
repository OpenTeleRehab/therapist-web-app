import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';

import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';

import 'react-phone-input-2/lib/style.css';
import { getTherapistsByClinic } from '../../store/therapist/actions';
import Select from 'react-select';
import scssColors from 'scss/custom.scss';
import { createTransfer, getTransfers } from '../../store/transfer/actions';
import _ from 'lodash';

const TransferPatient = ({ show, patientId, handleClose }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const { therapistsByClinic } = useSelector((state) => state.therapist);
  const { profile } = useSelector(state => state.auth);
  const { transfers } = useSelector(state => state.transfer);

  const [errorTherapistId, setErrorTherapistId] = useState(false);

  const translate = getTranslate(localize);
  const transfer = transfers.find(item => item.patient_id === patientId && item.therapist_type === 'lead');

  _.remove(therapistsByClinic, therapist => therapist.id === profile.id);

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  const [formFields, setFormFields] = useState({
    patient_id: patientId,
    clinic_id: profile.clinic_id,
    from_therapist_id: profile.id,
    therapist_type: 'lead',
    to_therapist_id: ''
  });

  useEffect(() => {
    dispatch(getTransfers());
  }, [dispatch]);

  useEffect(() => {
    if (profile && therapistsByClinic.length === 0) {
      dispatch(getTherapistsByClinic(profile.clinic_id));
    }
  }, [dispatch, profile, therapistsByClinic]);

  useEffect(() => {
    if (transfer && transfer.to_therapist_id) {
      setFormFields({ ...formFields, to_therapist_id: transfer.to_therapist_id });
    }
  }, [transfer]);

  const handleSingleSelectChange = (key, value) => {
    setFormFields({ ...formFields, [key]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.to_therapist_id === '') {
      canSave = false;
      setErrorTherapistId(true);
    } else {
      setErrorTherapistId(false);
    }

    if (canSave) {
      dispatch(createTransfer(formFields))
        .then(result => {
          if (result) {
            handleClose();
          }
        });
    }
  };

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog
      show={show}
      title={translate('common.transfer_patient')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={translate('common.save')}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Row>
          <Form.Group as={Col} controlId="formTherapist">
            <Form.Label>{translate('therapist')}</Form.Label>
            <Select
              placeholder={translate('placeholder.therapist')}
              classNamePrefix="filter"
              value={therapistsByClinic.filter(option => option.id === parseInt(formFields.to_therapist_id))}
              getOptionLabel={option => `${option.last_name} ${option.first_name}`}
              options={therapistsByClinic}
              onChange={(e) => handleSingleSelectChange('to_therapist_id', e.id)}
              className={errorTherapistId ? 'is-invalid' : ''}
              styles={customSelectStyles}
              aria-label="Therapist"
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.therapist')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
      </Form>
    </Dialog>
  );
};

TransferPatient.propTypes = {
  show: PropTypes.bool,
  patientId: PropTypes.number,
  handleClose: PropTypes.func
};

export default TransferPatient;
