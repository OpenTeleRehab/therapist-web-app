import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Form, Col } from 'react-bootstrap';
import _ from 'lodash';
import { getUsers } from '../../../store/user/actions';
import Datetime from 'components/DateTime';
import moment from 'moment';
import settings from 'settings';
import { createAppointment, updateAppointment } from 'store/appointment/actions';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';

const CreatePatient = ({ show, handleClose, selectedPatientId, editId, selectedDate }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const { profile } = useSelector((state) => state.auth);
  const { users } = useSelector(state => state.user);
  const { appointments } = useSelector((state) => state.appointment);
  const translate = getTranslate(localize);
  const [date, setDate] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [note, setNote] = useState('');
  const [patientId, setPatientId] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedFrom, setFormattedFrom] = useState('');
  const [formattedTo, setFormattedTo] = useState('');
  const validateDate = (current) => {
    const yesterday = moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  };

  const [errorPatient, setErrorPatient] = useState(false);
  const [errorDate, setErrorDate] = useState(false);
  const [errorFrom, setErrorFrom] = useState(false);
  const [errorTo, setErrorTo] = useState(false);

  useEffect(() => {
    if (profile) {
      dispatch(getUsers({ therapist_id: profile.id, page_size: 999, enabled: true }));
    }
  }, [profile, dispatch]);

  useEffect(() => {
    if (!editId && selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate, editId]);

  useEffect(() => {
    if (editId && appointments) {
      let appointment = null;
      if (selectedPatientId) {
        appointment = appointments.requests.find(
          item => item.id === editId);
      } else {
        appointment = appointments.approves.find(
          item => item.id === editId);
      }

      if (appointment) {
        setPatientId(appointment.patient_id);
        setDate(moment.utc(appointment.start_date).local());
        setFrom(moment.utc(appointment.start_date).local());
        setTo(moment.utc(appointment.end_date).local());
        setNote(appointment.note);
      }
    }
  }, [editId, appointments, selectedPatientId]);

  useEffect(() => {
    const yesterday = moment().subtract(1, 'day');
    if (moment(date, settings.date_format, true).isValid() && date.isAfter(yesterday)) {
      setFormattedDate(moment(date).format(settings.date_format));
    } else {
      setFormattedDate('');
    }
    // eslint-disable-next-line
  }, [date]);

  useEffect(() => {
    if (moment(from, settings.date_format + ' hh:mm A', true).isValid()) {
      setFormattedFrom(moment(from).format('hh:mm A'));
    } else {
      setFormattedFrom('');
    }
    // eslint-disable-next-line
  }, [from]);

  useEffect(() => {
    if (moment(to, settings.date_format + ' hh:mm A', true).isValid()) {
      setFormattedTo(moment(to).format('hh:mm A'));
    } else {
      setFormattedTo('');
    }
    // eslint-disable-next-line
  }, [to]);

  const handleConfirm = () => {
    let canSave = true;

    const now = moment().locale('en').format('YYYY-MM-DD HH:mm:ss');
    const fromTimeThen = moment(formattedDate + ' ' + formattedFrom, settings.date_format + ' hh:mm A').locale('en').format('YYYY-MM-DD HH:mm:ss');
    const toTimeThen = moment(formattedDate + ' ' + formattedTo, settings.date_format + ' hh:mm A').locale('en').format('YYYY-MM-DD HH:mm:ss');

    if (!patientId) {
      canSave = false;
      setErrorPatient(true);
    } else {
      setErrorPatient(false);
    }

    if (formattedDate === '' || !moment(formattedDate, settings.date_format).isValid()) {
      canSave = false;
      setErrorDate(true);
    } else {
      setErrorDate(false);
    }

    if (formattedFrom === '' || !moment(formattedFrom, 'hh:mm A').isValid() || !moment(now).isBefore(fromTimeThen)) {
      canSave = false;
      setErrorFrom(true);
    } else {
      setErrorFrom(false);
    }

    if (formattedTo === '' || !moment(formattedTo, 'hh:mm A').isValid() || formattedFrom === formattedTo || moment(formattedTo, 'hh:mm A').isBefore(moment(formattedFrom, 'hh:mm A')) || !moment(now).isBefore(toTimeThen)) {
      canSave = false;
      setErrorTo(true);
    } else {
      setErrorTo(false);
    }

    if (canSave) {
      const data = {
        patient_id: patientId,
        therapist_id: profile.id,
        from: moment(formattedDate + ' ' + formattedFrom, settings.date_format + ' hh:mm A').utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
        to: moment(formattedDate + ' ' + formattedTo, settings.date_format + ' hh:mm A').utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
        note
      };

      const filter = {
        now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
        date: moment(date).locale('en').format(settings.date_format),
        selected_from_date: selectedDate ? moment.utc(selectedDate.startOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
        selected_to_date: selectedDate ? moment.utc(selectedDate.endOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
        therapist_id: profile.id
      };

      if (editId) {
        dispatch(updateAppointment(editId, data, filter))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      } else {
        dispatch(createAppointment(data, filter))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      }
    }
  };

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

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog
      show={show}
      title={translate(editId ? 'appointment.edit' : 'appointment.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Group controlId="groupTitle">
          <Form.Label>{translate('appointment.patient')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Select
            isDisabled={editId || selectedPatientId}
            placeholder={translate('placeholder.patient')}
            classNamePrefix="filter"
            className={errorPatient ? 'is-invalid' : ''}
            value={users.filter(option => option.id === patientId)}
            getOptionLabel={option => `${option.last_name} ${option.first_name}`}
            options={users}
            onChange={(e) => setPatientId(e.id)}
            styles={customSelectStyles}
            aria-label="Patient"
          />
          {errorPatient && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {translate('error_message.appointment_patient_required')}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="groupDate">
          <label htmlFor="appointment-date">{translate('appointment.date')}</label>
          <span className="text-dark ml-1">*</span>
          <Datetime
            inputProps={{
              id: 'appointment-date',
              name: 'date',
              autoComplete: 'off',
              className: errorDate ? 'form-control is-invalid' : 'form-control',
              placeholder: translate('placeholder.date')
            }}
            dateFormat={settings.date_format}
            timeFormat={false}
            closeOnSelect={true}
            value={formattedDate}
            onChange={(value) => setDate(value)}
            isValidDate={ validateDate }
          />
          {errorDate && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {translate('error_message.appointment_date')}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="groupTime">
          <Form.Row>
            <Col>
              <label htmlFor="time-from">{translate('appointment.from')}</label>
              <span className="text-dark ml-1">*</span>
              <Datetime
                inputProps={{
                  id: 'time-from',
                  name: 'from',
                  autoComplete: 'off',
                  className: errorFrom ? 'form-control is-invalid' : 'form-control',
                  placeholder: translate('placeholder.time')
                }}
                timeConstraints={{ minutes: { step: 15 } }}
                initialViewMode="time"
                value={formattedFrom}
                onChange={(value) => {
                  setFrom(value);
                  if (typeof value === 'object') {
                    setTo(_.cloneDeep(value).add(15, 'minutes'));
                  }
                }}
                dateFormat={false}
                timeFormat={'h:mm A'}
              />
              {errorFrom && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {translate('error_message.appointment_from')}
                </Form.Control.Feedback>
              )}
            </Col>
            <Col>
              <label htmlFor="time-to">{translate('appointment.to')}</label>
              <span className="text-dark ml-1">*</span>
              <Datetime
                inputProps={{
                  id: 'time-to',
                  name: 'to',
                  autoComplete: 'off',
                  className: errorTo ? 'form-control is-invalid' : 'form-control',
                  placeholder: translate('placeholder.time'),
                  disabled: typeof from !== 'object'
                }}
                timeConstraints={{ minutes: { step: 15 } }}
                initialViewMode="time"
                value={formattedTo}
                onChange={(value) => setTo(value)}
                dateFormat={false}
                timeFormat={'h:mm A'}
              />
              {errorTo && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {translate('error_message.appointment_to')}
                </Form.Control.Feedback>
              )}
            </Col>
          </Form.Row>
        </Form.Group>
        <Form.Group controlId="groupNote">
          <Form.Label>{translate('appointment.note')}</Form.Label>
          <Form.Control
            as="textarea"
            name="note"
            maxLength={255}
            rows={3}
            value={note}
            placeholder={translate('appointment.note.placeholder')}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Dialog>
  );
};

CreatePatient.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  selectedPatientId: PropTypes.number,
  editId: PropTypes.number,
  selectedDate: PropTypes.string
};

export default CreatePatient;
