import React, { useState, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import Datetime from 'react-datetime';
import PropTypes from 'prop-types';
import settings from 'settings';
import moment from 'moment';
import PhoneInput from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';

import { createUser, updateUser } from 'store/user/actions';

import { getCountryName } from 'utils/country';
import { getClinicName, getClinicIdentity } from 'utils/clinic';

const CreatePatient = ({ show, handleClose, editId }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const users = useSelector(state => state.user.users);

  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const { profile } = useSelector((state) => state.auth);

  const [errorCountry, setErrorCountry] = useState(false);
  const [errorClinic, setErrorClinic] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorGender, setErrorGender] = useState(false);

  const [formFields, setFormFields] = useState({
    first_name: '',
    last_name: '',
    country_id: '',
    clinic_id: '',
    phone: '',
    gender: '',
    clinic_identity: '',
    note: '',
    date_of_birth: '',
    age: 1
  });

  useEffect(() => {
    if (!show) {
      resetData();
    }
    // eslint-disable-next-line
  }, [show]);

  useEffect(() => {
    if (editId && users.length) {
      const editingData = users.find(user => user.id === editId);
      setFormFields({
        first_name: editingData.first_name || '',
        last_name: editingData.last_name || '',
        country_id: editingData.country_id || '',
        clinic_id: editingData.clinic_id || '',
        phone: editingData.phone || '',
        gender: editingData.gender || '',
        note: editingData.note || '',
        date_of_birth: moment(editingData.date_of_birth, 'YYYY-MM-DD').format(settings.date_format) || '',
        age: ageCalculation(editingData.date_of_birth) || ''
      });
    } else {
      resetData();
      if (profile !== undefined) {
        setFormFields({ ...formFields, country_id: profile.country_id, clinic_id: profile.clinic_id, clinic_identity: getClinicIdentity(profile.clinic_id, clinics) });
      }
    }
    // eslint-disable-next-line
  }, [editId, users, profile]);

  const resetData = () => {
    setErrorCountry(false);
    setErrorClinic(false);
    setErrorFirstName(false);
    setErrorLastName(false);
    setErrorGender(false);
    setFormFields({
      first_name: '',
      last_name: '',
      country_id: '',
      clinic_id: '',
      phone: '',
      gender: '',
      date_of_birth: '',
      note: '',
      age: '1'
    });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleChangeDate = (value) => {
    const date = value.format(settings.date_format);
    const age = ageCalculation(value);
    setFormFields({ ...formFields, date_of_birth: date, age: age });
  };

  const ageCalculation = (value) => {
    var today = new Date();
    var birthDate = new Date(value);
    var year = today.getFullYear() - birthDate.getFullYear();
    var month = today.getMonth() - birthDate.getMonth();
    var day = today.getDay() - birthDate.getDay();

    var totalAge = 0;
    if (year > 0) {
      totalAge = year + ' year(s)';
    } else if (month > 0) {
      totalAge = month + ' month(s)';
    } else {
      totalAge = day > 0 ? day + ' day(s)' : totalAge;
    }

    return totalAge;
  };

  const validateDate = (current) => {
    return current.isBefore(moment());
  };

  const handleChangePhone = (value) => {
    setFormFields({ ...formFields, phone: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.first_name === '') {
      canSave = false;
      setErrorFirstName(true);
    } else {
      setErrorFirstName(false);
    }

    if (formFields.gender === '') {
      canSave = false;
      setErrorGender(true);
    } else {
      setErrorGender(false);
    }

    if (formFields.last_name === '') {
      canSave = false;
      setErrorLastName(true);
    } else {
      setErrorLastName(false);
    }

    if (formFields.phone === '') {
      canSave = false;
      setErrorPhone(true);
    } else {
      setErrorPhone(false);
    }

    if (canSave) {
      if (editId) {
        dispatch(updateUser(editId, formFields))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      } else {
        dispatch(createUser(formFields))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      }
    }
  };

  return (
    <Dialog
      show={show}
      title={translate(editId ? 'admin.edit' : 'admin.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
    >
      <Form>
        <Form.Group controlId="formPhone">
          <Form.Label>{translate('common.phone')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <PhoneInput
            defaultCountry="KH"
            class="form-control"
            placeholder="Enter phone number"
            value={formFields.phone}
            isInvalid={errorPhone}
            onChange={(e) => handleChangePhone(e)}
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.phone')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Row>
          <Form.Group as={Col} controlId="formCountry">
            <Form.Label>{translate('common.country')}</Form.Label>
            <Form.Control
              name="country_id"
              onChange={handleChange}
              value={formFields.country_id}
              placeholder={translate('placeholder.country')}
              isInvalid={errorCountry}
              as="select"
              disabled="disabled"
            >
              { profile !== undefined && (
                <option value={profile.country_id}>{getCountryName(profile.country_id, countries)}</option>)}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {translate('error.country')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="formClinic">
            <Form.Label>{translate('common.clinic')}</Form.Label>
            <Form.Control
              name="clinic_id"
              onChange={handleChange}
              value={formFields.clinic_id}
              placeholder={translate('placeholder.clinic')}
              isInvalid={errorClinic}
              as="select"
              disabled="disabled"
            >
              { profile !== undefined && (
                <option value={profile.clinic_id}>{getClinicName(profile.clinic_id, clinics)}</option>)}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {translate('error.clinic')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formGender">
            <Form.Label>{translate('common.gender')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="gender"
              onChange={handleChange}
              value={formFields.gender}
              placeholder={translate('placeholder.gender')}
              isInvalid={errorGender}
              as="select"
            >
              <option value="">{translate('placeholder.gender')}</option>
              <option value="male">Male</option>ដាតេ
              <option value="female">Female</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {translate('error.gender')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="formDateOfBirth">
            <Form.Label>{translate('common.dateOfBirth')}</Form.Label>
            <Datetime
              inputProps={{
                name: 'date_of_birth',
                autoComplete: 'off',
                className: 'form-control',
                placeholder: translate('placeholder.date_of_birth')
              }}
              dateFormat={settings.date_format}
              timeFormat={false}
              closeOnSelect={true}
              value={formFields.date_of_birth}
              onChange={(e) => handleChangeDate(e)}
              isValidDate={ validateDate }
            />
            <p className="mt-1">Age: {formFields.age}</p>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formLastName">
            <Form.Label>{translate('common.last_name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="last_name"
              onChange={handleChange}
              value={formFields.last_name}
              placeholder={translate('placeholder.last_name')}
              isInvalid={errorLastName}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.last_name')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="formFirstName">
            <Form.Label>{translate('common.first_name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="first_name"
              onChange={handleChange}
              value={formFields.first_name}
              placeholder={translate('placeholder.first_name')}
              isInvalid={errorFirstName}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.first_name')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Group controlId="formNote">
          <Form.Label>{translate('common.note')}</Form.Label>
          <Form.Control
            name="note"
            onChange={handleChange}
            value={formFields.note}
            placeholder={translate('placeholder.note')}
            as="textarea"
          />
        </Form.Group>
      </Form>
    </Dialog>
  );
};

CreatePatient.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  editId: PropTypes.string
};

export default CreatePatient;
