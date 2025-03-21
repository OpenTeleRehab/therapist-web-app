import React, { useContext, useState, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import Chip from '../../components/Chip';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import Datetime from 'components/DateTime';
import PropTypes from 'prop-types';
import settings from 'settings';
import moment from 'moment';
import RocketchatContext from 'context/RocketchatContext';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';

import { createUser, updateUser, getUsers } from 'store/user/actions';
import { getProfile } from 'store/auth/actions';
import { getTherapistsByClinic } from 'store/therapist/actions';
import { deleteTransfer, getTransfers } from '../../store/transfer/actions';
import { Therapist as therapistService } from 'services/therapist';
import { User as patientService } from 'services/user';

import { getCountryName, getCountryIsoCode } from 'utils/country';
import { getClinicName, getClinicIdentity } from 'utils/clinic';
import { getChatRooms } from 'utils/therapist';
import AgeCalculation from 'utils/age';
import { deleteChatRoom } from 'utils/rocketchat';
import { LOCATIONS } from 'variables/location';
import _ from 'lodash';

const CreatePatient = ({ show, handleClose, editId }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const users = useSelector(state => state.user.users);

  const countries = useSelector(state => state.country.countries);
  const therapistsByClinic = useSelector(state => state.therapist.therapistsByClinic);
  const clinics = useSelector(state => state.clinic.clinics);
  const { profile } = useSelector((state) => state.auth);
  const { transfers } = useSelector(state => state.transfer);
  const definedCountries = useSelector(state => state.country.definedCountries);
  const { languages } = useSelector(state => state.language);

  const [errorCountry, setErrorCountry] = useState(false);
  const [errorClinic, setErrorClinic] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorClass, setErrorClass] = useState('');
  const [errorPhoneMessage, setErrorPhoneMessage] = useState('');
  const [phoneExist, setPhoneExist] = useState(false);
  const [errorGender, setErrorGender] = useState(false);
  const [errorInvalidDob, setErrorInvalidDob] = useState(false);
  const [errorLocation, setErrorLocation] = useState(false);
  const [selectedTherapists, setSelectedTherapists] = useState([]);
  const [originalSecondaryTherapists, setOriginalSecondaryTherapists] = useState([]);
  const [patientChatUserId, setPatientChatUserId] = useState('');
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [locale, setLocale] = useState('en-us');

  const chatSocket = useContext(RocketchatContext);

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
    age: '',
    therapist_id: '',
    therapist_identity: '',
    location: ''
  });
  const [dob, setDob] = useState('');

  useEffect(() => {
    if (languages.length && profile) {
      const language = languages.find(lang => lang.id === profile.language_id);
      if (language) {
        setLocale(language.code);
      } else {
        setLocale('en-us');
      }
    }
  }, [languages, profile]);

  useEffect(() => {
    if (!show) {
      resetData();
    }
    // eslint-disable-next-line
    dispatch(getUsers({ therapist_id: profile.id, page_size: 999 }));
  }, [show, profile]);

  useEffect(() => {
    if (profile !== undefined) {
      dispatch(getTherapistsByClinic(profile.clinic_id));
      dispatch(getTransfers());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    const arr = [];
    const filteredTransfers = transfers.filter(item => item.patient_id === editId && item.therapist_type === 'supplementary') || [];
    if (filteredTransfers.length) {
      _.forEach(filteredTransfers, x => arr.push({ id: x.id, therapist_id: x.to_therapist_id, status: x.status, first_name: x.to_therapist.first_name, last_name: x.to_therapist.last_name }));
    }
    setPendingTransfers(previousTransfers => _.uniqBy([...previousTransfers, ...arr], 'therapist_id'));
  }, [transfers, editId]);

  if (therapistsByClinic.length && profile !== undefined) {
    therapistsByClinic.forEach(function (therapist, index) {
      if (parseInt(therapist.id) === parseInt(profile.id)) {
        therapistsByClinic.splice(index, 1);
      }
    });
  }

  const options = [];
  if (therapistsByClinic.length) {
    therapistsByClinic.forEach(function (therapist, index) {
      if (!_.some(pendingTransfers, x => x.therapist_id === therapist.id && x.status === 'invited')) {
        options.push({ value: therapist.id, label: therapist.first_name + ' ' + therapist.last_name });
      }
    });
  }

  useEffect(() => {
    if (editId && users.length) {
      const editingData = users.find(user => user.id === parseInt(editId));
      setFormFields({
        first_name: editingData.first_name || '',
        last_name: editingData.last_name || '',
        country_id: editingData.country_id || '',
        clinic_id: editingData.clinic_id || '',
        phone: editingData.phone || '',
        dial_code: editingData.dial_code || '',
        gender: editingData.gender || '',
        note: editingData.note || '',
        date_of_birth: editingData.date_of_birth !== null ? moment(editingData.date_of_birth, 'YYYY-MM-DD').format(settings.date_format) : '',
        age: editingData.date_of_birth !== null ? AgeCalculation(editingData.date_of_birth, translate) : '',
        location: editingData.location || ''
      });
      setSelectedTherapists(editingData.secondary_therapists);
      setOriginalSecondaryTherapists(editingData.secondary_therapists);
      setPatientChatUserId(editingData.chat_user_id);

      setDob(editingData.date_of_birth !== null ? moment(editingData.date_of_birth, 'YYYY-MM-DD') : '');
    } else {
      resetData();
      if (profile !== undefined) {
        setFormFields({
          ...formFields,
          country_id: profile.country_id,
          clinic_id: profile.clinic_id,
          clinic_identity: getClinicIdentity(profile.clinic_id, clinics),
          therapist_id: profile.id,
          therapist_identity: profile.identity
        });
      }
    }
    // eslint-disable-next-line
  }, [editId, users, profile]);

  useEffect(() => {
    if (formFields.clinic_id) {
      if (dob) {
        if (moment(dob, settings.date_format, true).isValid() && dob.isBefore(moment())) {
          const date = moment(dob).locale('en').format(settings.date_format);
          const age = AgeCalculation(dob, translate);
          setErrorInvalidDob(false);
          setFormFields({ ...formFields, date_of_birth: date, age: age });
        } else {
          setErrorInvalidDob(true);
          setFormFields({ ...formFields, date_of_birth: '', age: '' });
        }
      } else {
        setErrorInvalidDob(false);
        setFormFields({ ...formFields, date_of_birth: '', age: '' });
      }
    }

    let formValues = formFields;
    if (formFields.phone) {
      const phoneValue = formFields.phone;
      const numOnly = phoneValue.split(formFields.dial_code);
      if (numOnly[1].match('^0')) {
        formValues = { ...formFields, phone: formFields.dial_code + numOnly[1].slice(1) };
      }

      if (formValues.phone) {
        therapistService.getPatientByPhoneNumber(formValues.phone, editId || '').then(res => {
          if (res.data > 0) {
            setPhoneExist(true);
          } else {
            setPhoneExist(false);
          }
        });
      }
    }
    // eslint-disable-next-line
  }, [dob, formFields.therapist_id, formFields.phone]);

  const resetData = () => {
    setErrorCountry(false);
    setErrorClinic(false);
    setErrorFirstName(false);
    setErrorLastName(false);
    setErrorGender(false);
    setErrorInvalidDob(false);
    setPhoneExist(false);
    setFormFields({
      first_name: '',
      last_name: '',
      country_id: '',
      clinic_id: '',
      phone: '',
      gender: '',
      date_of_birth: '',
      note: '',
      age: '',
      dial_code: '',
      location: ''
    });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const validateDate = (current) => {
    return current.isBefore(moment());
  };

  const handleRemovePendingSecondaryTherapist = (id, therapistId) => {
    setSelectedTherapists(selectedTherapists => _.filter(selectedTherapists, x => x !== therapistId));
    setPendingTransfers(pendingTransfers => _.filter(pendingTransfers, x => x.therapist_id !== therapistId));

    if (id) {
      dispatch(deleteTransfer(id));
    }
  };

  const handleSingleSelectChange = (key, value) => {
    setFormFields({ ...formFields, [key]: value });
  };

  const handleMultipleSelectChange = e => {
    const transformE = [];
    const priority = { invited: 1, declined: 2 };

    if (Array.isArray(e)) {
      const filteredE = e.length ? _.filter(therapistsByClinic, item => e.some(x => x.value === item.id)) : [];

      if (filteredE.length) {
        _.forEach(filteredE, x => transformE.push({ therapist_id: x.id, status: 'invited', first_name: x.first_name, last_name: x.last_name }));
        _.forEach(pendingTransfers, p => {
          if ('id' in p) {
            // eslint-disable-next-line no-return-assign
            _.forEach(transformE, t => t.therapist_id === p.therapist_id ? t.id = p.id : t);
          }
        });
      }
    }

    setSelectedTherapists(previousSelects => Array.isArray(e) ? [...previousSelects, ...e.map(x => x.value)] : previousSelects);
    setPendingTransfers(pendingTransfers => _.chain([...pendingTransfers, ...transformE])
      .sortBy(t => priority[t.status])
      .uniqBy('therapist_id')
      .value()
    );
  };

  const handleConfirm = () => {
    let canSave = true;

    let formValues = formFields;
    if (formFields.phone === '' || formFields.phone === undefined || formFields.dial_code === formFields.phone) {
      canSave = false;
      setErrorClass('d-block text-danger invalid-feedback');
      setErrorPhoneMessage(translate('error.phone'));
    } else {
      if (phoneExist) {
        canSave = false;
        setErrorClass('d-block text-danger invalid-feedback');
        setErrorPhoneMessage(translate('error_message.phone_exists'));
      } else {
        setErrorClass('invalid-feedback');
        canSave = true;
      }

      const phoneValue = formFields.phone;
      const numOnly = phoneValue.split(formFields.dial_code);
      if (numOnly[1].match('^0')) {
        formValues = { ...formFields, phone: formFields.dial_code + numOnly[1].slice(1) };
      }
    }

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

    if (formFields.location === '') {
      canSave = false;
      setErrorLocation(true);
    } else {
      setErrorLocation(false);
    }

    if (errorInvalidDob) {
      canSave = false;
    }

    if (canSave) {
      const url = window.location.href;
      const payload = {
        ...formValues,
        secondary_therapists: selectedTherapists,
        stage: url.includes('local') ? 'local' : url.includes('demo') ? 'demo' : 'live'
      };

      if (editId) {
        dispatch(updateUser(editId, payload))
          .then(result => {
            if (result) {
              if (originalSecondaryTherapists) {
                originalSecondaryTherapists.forEach(function (therapist, index) {
                  if (!_.includes(selectedTherapists, therapist) || selectedTherapists.length === 0) {
                    const roomIds = getChatRooms(therapist, therapistsByClinic);
                    const fIndex = roomIds.findIndex(r => r.includes(patientChatUserId));
                    if (fIndex > -1) {
                      const chatRoomId = roomIds[fIndex];
                      deleteChatRoom(chatSocket, chatRoomId, profile.id);

                      therapistService.deleteTherapistChatRoomById(therapist, chatRoomId);
                      patientService.deletePatientChatRoomById(editId, chatRoomId);
                    }
                  }
                });
              }
              handleClose();
            }
          });
      } else {
        dispatch(createUser(payload))
          .then(result => {
            if (result) {
              dispatch(getProfile());
              handleClose();
            }
          });
      }
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
      title={translate(editId ? 'patient.edit' : 'patient.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Group controlId="formPhone">
          <label htmlFor="phone">{translate('common.phone')}</label>
          <span className="text-dark ml-1">*</span>
          <PhoneInput
            inputProps={{
              id: 'phone'
            }}
            countryCodeEditable={false}
            country={getCountryIsoCode().toLowerCase()}
            value={formFields.phone}
            onlyCountries={
              definedCountries.map(country => { return country.iso_code.toLowerCase(); })
            }
            onChange={(value, country) => {
              setFormFields({ ...formFields, phone: value, dial_code: country.dialCode });
            }}
          />
          <Form.Control.Feedback type="invalid" class={errorClass}>
            {errorPhoneMessage}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Row>
          <Form.Group as={Col} controlId="formCountry">
            <Form.Label>{translate('common.country')}</Form.Label>
            <Select
              value={formFields.country_id}
              placeholder={getCountryName(profile.country_id, countries)}
              classNamePrefix="filter"
              className={errorCountry ? 'is-invalid' : ''}
              isDisabled={true}
              aria-label="Country"
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.country')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="formClinic">
            <Form.Label>{translate('common.clinic')}</Form.Label>
            <Select
              value={formFields.clinic_id}
              placeholder={getClinicName(profile.clinic_id, clinics)}
              classNamePrefix="filter"
              className={errorClinic ? 'is-invalid' : ''}
              isDisabled={true}
              aria-label="Clinic"
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.clinic')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formGender">
            <Form.Label>{translate('common.gender')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Select
              classNamePrefix="filter"
              value={settings.genders.options.filter(option => option.value === formFields.gender)}
              getOptionLabel={option => translate('common.' + option.value)}
              options={settings.genders.options}
              placeholder={translate('placeholder.gender')}
              className={errorGender ? 'is-invalid' : ''}
              onChange={(e) => handleSingleSelectChange('gender', e.value)}
              aria-label="Gender"
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.gender')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="formDateOfBirth">
            <label htmlFor="date-of-birth">{translate('common.dateOfBirth')}</label>
            <Datetime
              inputProps={{
                id: 'date-of-birth',
                name: 'date_of_birth',
                autoComplete: 'off',
                className: errorInvalidDob ? 'form-control is-invalid' : 'form-control',
                placeholder: translate('placeholder.date_of_birth')
              }}
              dateFormat={settings.date_format}
              timeFormat={false}
              closeOnSelect={true}
              value={dob}
              onChange={(value) => setDob(value)}
              isValidDate={ validateDate }
              locale={locale}
            />
            {errorInvalidDob && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {translate('error.invalid_date')}
              </Form.Control.Feedback>
            )}
            <p className="mt-1">{translate('common.age')} {formFields.age}</p>
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
              maxLength={settings.textMaxLength}
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
              maxLength={settings.textMaxLength}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.first_name')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Group controlId="formLocation">
          <Form.Label>{translate('common.location')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Select
            classNamePrefix="filter"
            value={LOCATIONS.filter(option => option.value === formFields.location)}
            getOptionLabel={option => translate('common.' + option.key)}
            options={LOCATIONS}
            placeholder={translate('placeholder.location')}
            className={errorLocation ? 'is-invalid' : ''}
            onChange={(e) => handleSingleSelectChange('location', e.value)}
            aria-label="Location"
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.location')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="secondary-therapist">
          <Form.Label>{translate('common.secondary_therapist')}</Form.Label>
          <Select
            isMulti
            value={options.filter(obj => selectedTherapists.includes(obj.value))}
            options={options}
            placeholder={translate('placeholder.therapist')}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleMultipleSelectChange}
            isClearable
            aria-label="Secondary therapist"
          />

          {pendingTransfers.length > 0 && (
            <>
              <p className="mt-2 mb-2"><strong>{translate('transfer.pending_accept_decline')}</strong></p>
              {pendingTransfers.map(item => {
                return (
                  <Chip
                    key={item.therapist_id}
                    variant={item.status === 'invited' ? 'primary' : 'danger'}
                    label={`${item.first_name} ${item.last_name}`}
                    onDelete={() => handleRemovePendingSecondaryTherapist(item.id, item.therapist_id)}
                  />
                );
              })}
            </>
          )}
        </Form.Group>
        <Form.Group controlId="formNote">
          <Form.Label>{translate('common.note')}</Form.Label>
          <Form.Control
            name="note"
            onChange={handleChange}
            value={formFields.note}
            placeholder={translate('placeholder.note')}
            as="textarea"
            maxLength={settings.textMaxLength}
          />
        </Form.Group>
      </Form>
    </Dialog>
  );
};

CreatePatient.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  editId: PropTypes.number
};

export default CreatePatient;
