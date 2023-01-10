import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Form, Col } from 'react-bootstrap';
import { getUsers } from '../../../store/user/actions';
import Datetime from 'components/DateTime';
import moment from 'moment';
import settings from 'settings';
import { createAppointment, updateAppointment } from 'store/appointment/actions';
import Select from 'react-select';
import TimeKeeper from 'react-timekeeper';
import scssColors from '../../../scss/custom.scss';

const CreatePatient = ({ show, handleClose, selectedPatientId, editId, selectedDate, userLocale }) => {
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
  const [showFromTime, setShowFromTime] = useState(false);
  const [showToTime, setShowToTime] = useState(false);
  const [timeTo, setTimeTo] = useState('12:00 am');

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
      setFormattedDate(moment(date));
    } else {
      setFormattedDate('');
    }
    // eslint-disable-next-line
  }, [date]);

  useEffect(() => {
    if (from.isValid) {
      // set moment locale to en before convert
      moment.locale('en');
      setFormattedTo(moment(from.formatted12, 'hh:mm a').locale(userLocale).add(15, 'minutes').format('hh:mm A'));
      const formatted = from.formatted12 ? moment(from.formatted12, 'hh:mm a').locale(userLocale).format('hh:mm A') : moment(from).locale(userLocale).format('hh:mm A');
      setFormattedFrom(formatted);
      // set moment locale back after convert
      moment.locale(userLocale);
    } else {
      setFormattedFrom('');
    }
    // eslint-disable-next-line
  }, [from, userLocale]);

  useEffect(() => {
    if (to.isValid) {
      // set moment locale to en before convert
      moment.locale('en');
      setTimeTo(to.formatted12 ? to.formatted12 : moment(to, 'hh:mm A').locale('en').format('hh:mm a'));

      const formatted = to.formatted12 ? moment(to.formatted12, 'hh:mm a').locale(userLocale).format('hh:mm A') : moment(to).locale(userLocale).format('hh:mm A');
      setFormattedTo(formatted);
      // set moment locale back after convert
      moment.locale(userLocale);
    } else {
      setFormattedTo('');
    }
    // eslint-disable-next-line
  }, [to, userLocale]);

  useEffect(() => {
    // Translate meridiem button of picker base on language when click
    const topMeridiemButton = document.querySelector('[data-testid="topbar_meridiem"]');
    const amButton = document.querySelector('[data-testid="meridiem_am"]');
    const pmButton = document.querySelector('[data-testid="meridiem_pm"]');

    if (topMeridiemButton && amButton && pmButton) {
      topMeridiemButton.addEventListener('click', function () {
        setTimeout(() => {
          // set moment locale to en before convert
          moment.locale('en');
          const newTopMeridiemButton = document.querySelector('[data-testid="topbar_meridiem"]');
          newTopMeridiemButton.innerHTML = moment(`12:00 ${newTopMeridiemButton.innerHTML}`, 'hh:mm a').locale(userLocale).format('A');
        }, [0]);
      });

      amButton.addEventListener('click', function () {
        setTimeout(() => {
          moment.locale('en');
          const newTopMeridiemButton = document.querySelector('[data-testid="topbar_meridiem"]');
          newTopMeridiemButton.innerHTML = moment('12:00 AM', 'hh:mm A').locale(userLocale).format('A');
        }, [0]);
      });

      pmButton.addEventListener('click', function () {
        setTimeout(() => {
          moment.locale('en');
          const newTopMeridiemButton = document.querySelector('[data-testid="topbar_meridiem"]');
          newTopMeridiemButton.innerHTML = moment('12:00 PM', 'hh:mm A').locale(userLocale).format('A');
        }, [0]);
      });
    }
  }, [showFromTime, showToTime, userLocale]);

  useEffect(() => {
    // set moment locale to en before convert
    moment.locale('en');
    const amButton = document.querySelector('[data-testid="meridiem_am"]');
    const pmButton = document.querySelector('[data-testid="meridiem_pm"]');
    const topMeridiemButton = document.querySelector('[data-testid="topbar_meridiem"]');
    if (amButton && pmButton && topMeridiemButton) {
      // Translate meridiem button of picker base on language
      topMeridiemButton.innerHTML = moment(timeTo, 'hh:mm a').locale(userLocale).format('A');
      amButton.innerHTML = moment('12:00 AM', 'hh:mm A').locale(userLocale).format('A');
      pmButton.innerHTML = moment('12:00 PM', 'hh:mm A').locale(userLocale).format('A');
    }
  }, [showFromTime, showToTime, userLocale, timeTo]);

  const handleConfirm = () => {
    let canSave = true;
    moment.locale(userLocale);

    const now = moment().locale('en').format('YYYY-MM-DD HH:mm:ss');
    const fromTimeThen = moment(moment(date).format(settings.date_format) + ' ' + formattedFrom, settings.date_format + ' hh:mm A').locale('en').format('YYYY-MM-DD HH:mm:ss');
    const toTimeThen = moment(moment(date).format(settings.date_format) + ' ' + formattedTo, settings.date_format + ' hh:mm A').locale('en').format('YYYY-MM-DD HH:mm:ss');

    if (!patientId) {
      canSave = false;
      setErrorPatient(true);
    } else {
      setErrorPatient(false);
    }

    if (formattedDate === '' || !moment(formattedDate, settings.date_format).locale('en').isValid()) {
      canSave = false;
      setErrorDate(true);
    } else {
      setErrorDate(false);
    }

    if (formattedFrom === '' || !moment(formattedFrom, 'hh:mm A').locale('en').isValid() || !moment(now).isBefore(fromTimeThen)) {
      canSave = false;
      setErrorFrom(true);
    } else {
      setErrorFrom(false);
    }

    if (formattedTo === '' || !moment(formattedTo, 'hh:mm A').locale('en').isValid() || formattedFrom === formattedTo || moment(formattedTo, 'hh:mm A').locale('en').isBefore(moment(formattedFrom, 'hh:mm A').locale('en')) || !moment(now).isBefore(toTimeThen)) {
      canSave = false;
      setErrorTo(true);
    } else {
      setErrorTo(false);
    }

    if (canSave) {
      const data = {
        patient_id: patientId,
        therapist_id: profile.id,
        from: moment(moment(date).format(settings.date_format) + ' ' + formattedFrom, settings.date_format + ' hh:mm A').utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
        to: moment(moment(date).format(settings.date_format) + ' ' + formattedTo, settings.date_format + ' hh:mm A').utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
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

  const handleFromClick = () => {
    setShowFromTime(true);
    setShowToTime(false);
  };

  const handleFromChange = (value) => {
    moment.locale('en');
    setFrom(value);
    setTimeTo(moment(value.formatted12, 'hh:mm a').locale('en').add(15, 'minutes').format('hh:mm a'));
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
              <Form.Control
                type="text"
                name="from"
                defaultValue={formattedFrom}
                placeholder={translate('placeholder.time')}
                onClick={handleFromClick}
              />
              {errorFrom && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {translate('error_message.appointment_from')}
                </Form.Control.Feedback>
              )}
              {showFromTime &&
                <TimeKeeper
                  time={from.formatted12 ? from.formatted12 : from ? moment(from).locale('en-us').format('hh:mm a') : '12:00 am'}
                  onChange={(value) => handleFromChange(value)}
                  onDoneClick={() => setShowFromTime(false)}
                  switchToMinuteOnHourSelect
                  closeOnMinuteSelect
                  doneButton={() => (
                    <div
                      className="text-center pt-2 pb-2"
                      onClick={() => setShowFromTime(false)}
                    >
                      {translate('common.close')}
                    </div>
                  )}
                />
              }
            </Col>
            <Col>
              <label htmlFor="time-to">{translate('appointment.to')}</label>
              <span className="text-dark ml-1">*</span>
              <Form.Control
                type="text"
                name="to"
                defaultValue={formattedTo}
                placeholder={translate('placeholder.time')}
                onClick={() => [setShowToTime(true), setShowFromTime(false)]}
                disabled={typeof from !== 'object'}
              />
              {errorTo && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {translate('error_message.appointment_to')}
                </Form.Control.Feedback>
              )}
              {showToTime &&
                <TimeKeeper
                  time={timeTo}
                  onChange={(value) => setTo(value)}
                  onDoneClick={() => setShowToTime(false)}
                  switchToMinuteOnHourSelect
                  closeOnMinuteSelect
                  doneButton={() => (
                    <div
                      className="text-center pt-2 pb-2"
                      onClick={() => setShowToTime(false)}
                    >
                      {translate('common.close')}
                    </div>
                  )}
                />
              }
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
  selectedDate: PropTypes.string,
  userLocale: PropTypes.string
};

export default CreatePatient;
