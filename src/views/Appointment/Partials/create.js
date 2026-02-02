import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Form, Col, Row } from 'react-bootstrap';
import { getUsers } from '../../../store/user/actions';
import Datetime from 'components/DateTime';
import moment from 'moment';
import settings from 'settings';
import { createAppointment, updateAppointment } from 'store/appointment/actions';
import Select from 'react-select';
import TimeKeeper from 'react-timekeeper';
import scssColors from '../../../scss/custom.scss';
import { useList } from 'hooks/useList';
import { useCreate } from 'hooks/useCreate';
import { useUpdate } from 'hooks/useUpdate';
import { END_POINTS } from 'variables/endPoint';
import { USER_GROUPS } from 'variables/user';
import { APPOINTMENT_OPTIONS, APPOINTMENT_RECIPIENT_TYPES } from '../../../variables/appointment';
import useToast from 'components/V2/Toast';
import { getCountryIsoCode } from 'utils/country';
import { APPOINTMENT_TYPE } from 'variables/appointmentType';

const CreatePatient = ({ show, handleClose, selectedPatientId, appointment, selectedDate, userLocale }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const localize = useSelector((state) => state.localize);
  const { profile } = useSelector((state) => state.auth);
  const { users } = useSelector(state => state.user);
  const { appointmentsWithPatients } = useSelector((state) => state.appointment);
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
  const [recipientType, setRecipientType] = useState('');
  const [phcWorkerOptions, setPhcWorkerOptions] = useState([]);
  const [therapistOptions, setTherapistOptions] = useState([]);
  const [recipientId, setRecipientId] = useState('');
  const [type, setType] = useState(APPOINTMENT_TYPE.ONLINE);

  const validateDate = (current) => {
    const yesterday = moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  };

  const [errorPatient, setErrorPatient] = useState(false);
  const [errorDate, setErrorDate] = useState(false);
  const [errorFrom, setErrorFrom] = useState(false);
  const [errorTo, setErrorTo] = useState(false);
  const [errorRecipientType, setErrorRecipientType] = useState(false);
  const [errorRecipient, setErrorRecipient] = useState(false);

  const { data: { data: referralTherapists = [] } = {} } = useList(END_POINTS.REFERRAL_THERAPISTS, null, { enabled: profile.type === USER_GROUPS.PHC_WORKER }, { country: getCountryIsoCode() });
  const { data: { data: acceptedReferralPhcWorkers = [] } = {} } = useList(END_POINTS.PHC_WORKERS_WITH_ACCEPTED_REFERRALS, null, { enabled: profile.type === USER_GROUPS.THERAPIST }, { country: getCountryIsoCode() });
  const { data: { data: therapists = [] } = {} } = useList(END_POINTS.THERAPISTS_BY_CLINIC, null, { enabled: profile.type === USER_GROUPS.THERAPIST });
  const { data: { data: phcWorkers = [] } = {} } = useList(END_POINTS.PHC_WORKERS_BY_PHC_SERVICE, { phc_service_id: profile.phc_service_id }, { enabled: profile.type === USER_GROUPS.PHC_WORKER });
  const { mutate: createAppointmentMutation } = useCreate(END_POINTS.APPOINTMENTS);
  const { mutate: updateAppointmentMutation } = useUpdate(END_POINTS.APPOINTMENTS);

  useEffect(() => {
    if (profile) {
      dispatch(getUsers({ page_size: 999, enabled: true }));
    }
  }, [profile, dispatch]);

  useEffect(() => {
    if (profile.type === USER_GROUPS.PHC_WORKER) {
      setPhcWorkerOptions(phcWorkers);
      setTherapistOptions(referralTherapists);
    } else {
      setPhcWorkerOptions(acceptedReferralPhcWorkers);
      setTherapistOptions(therapists);
    }
  }, [profile, phcWorkers, referralTherapists, acceptedReferralPhcWorkers, therapists]);

  useEffect(() => {
    if (!appointment && selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate, appointment]);

  useEffect(() => {
    if (appointment) {
      setPatientId(appointment.patient_id);
      setRecipientType(
        appointment.patient_id
          ? APPOINTMENT_RECIPIENT_TYPES.PATIENT
          : therapistOptions.find(item => item.id === appointment.recipient_id)
            ? APPOINTMENT_RECIPIENT_TYPES.THERAPIST
            : APPOINTMENT_RECIPIENT_TYPES.PHC_WORKER
      );
      setRecipientId(appointment.recipient_id);
      setDate(moment.utc(appointment.start_date).local());
      setFrom(moment.utc(appointment.start_date).local());
      setTo(moment.utc(appointment.end_date).local());
      setNote(appointment.note);
      setType(appointment.type);
    }
  }, [appointment, therapistOptions, selectedPatientId]);

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
    if (from) {
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
    if (to) {
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

    if (!recipientType) {
      canSave = false;
      setErrorRecipientType(true);
    } else {
      setErrorRecipientType(false);
    }

    if (recipientType === APPOINTMENT_RECIPIENT_TYPES.PATIENT && !patientId) {
      canSave = false;
      setErrorPatient(true);
    } else {
      setErrorPatient(false);
    }

    if ((recipientType === APPOINTMENT_RECIPIENT_TYPES.THERAPIST || recipientType === APPOINTMENT_RECIPIENT_TYPES.PHC_WORKER) && !recipientId) {
      canSave = false;
      setErrorRecipient(true);
    } else {
      setErrorRecipient(false);
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
      let data = {};
      const from = moment(moment(date).format(settings.date_format) + ' ' + formattedFrom, settings.date_format + ' hh:mm A').utc().locale('en').format('YYYY-MM-DD HH:mm:ss');
      const to = moment(moment(date).format(settings.date_format) + ' ' + formattedTo, settings.date_format + ' hh:mm A').utc().locale('en').format('YYYY-MM-DD HH:mm:ss');
      if (recipientType === APPOINTMENT_RECIPIENT_TYPES.PATIENT) {
        data = {
          patient_id: patientId,
          from,
          to,
          note,
          type,
        };
      } else {
        data = {
          recipient_id: recipientId,
          from,
          to,
          note,
          type,
        };
      }

      const filter = {
        now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
        date: moment(date).locale('en').format(settings.date_format),
        selected_from_date: selectedDate ? moment.utc(selectedDate.startOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
        selected_to_date: selectedDate ? moment.utc(selectedDate.endOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null
      };

      if (recipientType === APPOINTMENT_RECIPIENT_TYPES.PATIENT) {
        if (appointment) {
          dispatch(updateAppointment(appointment.id, data, filter))
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
      } else {
        if (appointment) {
          updateAppointmentMutation(
            { id: appointment.id, payload: { ...data } },
            {
              onSuccess: async (res) => {
                showToast({
                  title: translate('appointment.edit'),
                  message: translate(res?.message),
                  color: 'success'
                });
                handleClose();
              },
              onError: async (error) => {
                showToast({
                  title: translate('toast_title.error_message'),
                  message: translate(error?.response?.data?.message),
                  color: 'danger'
                });
              }
            }
          );
        } else {
          createAppointmentMutation(
            { ...data },
            {
              onSuccess: async (res) => {
                showToast({
                  title: translate('appointment.new'),
                  message: translate(res?.message),
                  color: 'success'
                });
                handleClose();
              },
              onError: async (error) => {
                showToast({
                  title: translate('toast_title.error_message'),
                  message: translate(error?.response?.data?.message),
                  color: 'danger'
                });
              }
            },
          );
        }
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

  const handleRecipientTypeChange = (e) => {
    setRecipientType(e.value);
    setRecipientId('');
    setPatientId('');
  };

  return (
    <Dialog
      show={show}
      title={translate(appointment ? 'appointment.edit' : 'appointment.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={appointment ? translate('common.save') : translate('common.create')}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Group controlId="type">
          <Form.Label>
            {translate('appointment.type')}
            <span className="text-dark ml-1">*</span>
          </Form.Label>

          <div className="d-flex" style={{ gap: 20 }}>
            <Form.Check
              name="type"
              type="radio"
              value={APPOINTMENT_TYPE.ONLINE}
              checked={type === APPOINTMENT_TYPE.ONLINE}
              onChange={() => setType(APPOINTMENT_TYPE.ONLINE)}
              id="appointmentTypeOnline"
              label={translate('appointment.type.online')}
            />

            <Form.Check
              name="type"
              type="radio"
              value={APPOINTMENT_TYPE.IN_PERSON}
              checked={type === APPOINTMENT_TYPE.IN_PERSON}
              onChange={() => setType(APPOINTMENT_TYPE.IN_PERSON)}
              id="appointmentTypeInPerson"
              label={translate('appointment.type.in_person')}
            />
          </div>
        </Form.Group>
        <Form.Group controlId="groupRecipientType">
          <Form.Label>{translate('appointment.appointment_with')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Select
            isDisabled={appointment}
            placeholder={translate('appointment.appointment_with.placeholder')}
            classNamePrefix="filter"
            className={errorRecipientType ? 'is-invalid' : ''}
            value={APPOINTMENT_OPTIONS.filter(option => option.value === recipientType)}
            getOptionLabel={option => translate(option.label)}
            options={APPOINTMENT_OPTIONS}
            onChange={(e) => handleRecipientTypeChange(e)}
            styles={customSelectStyles}
            aria-label="Recipient Type"
          />
          {errorRecipientType && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {translate('error_message.appointment.appointment_with.required')}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        {recipientType === APPOINTMENT_RECIPIENT_TYPES.PATIENT && (
          <Form.Group controlId="groupTitle">
            <Form.Label>{translate('appointment.patient')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Select
              isDisabled={appointment}
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
        )}
        {recipientType === APPOINTMENT_RECIPIENT_TYPES.PHC_WORKER && (
          <Form.Group controlId="groupPhcWorker">
            <Form.Label>{translate('appointment.phc_worker')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Select
              isDisabled={appointment}
              placeholder={translate('appointment.phc_worker.placeholder')}
              classNamePrefix="filter"
              className={errorRecipient ? 'is-invalid' : ''}
              value={phcWorkerOptions.filter(option => option.id === recipientId)}
              getOptionLabel={option => `${option.last_name} ${option.first_name}`}
              options={phcWorkerOptions.filter(option => option.id !== profile.id)}
              onChange={(e) => setRecipientId(e.id)}
              styles={customSelectStyles}
              aria-label="Phc Worker"
            />
            {errorRecipient && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {translate('error_message.appointment.phc_worker.required')}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        )}
        {recipientType === APPOINTMENT_RECIPIENT_TYPES.THERAPIST && (
          <Form.Group controlId="groupTherapist">
            <Form.Label>{translate('appointment.therapist')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Select
              isDisabled={appointment}
              placeholder={translate('appointment.therapist.placeholder')}
              classNamePrefix="filter"
              className={errorRecipient ? 'is-invalid' : ''}
              value={therapistOptions.filter(option => option.id === recipientId)}
              getOptionLabel={option => `${option.last_name} ${option.first_name}`}
              options={therapistOptions.filter(option => option.id !== profile.id)}
              onChange={(e) => setRecipientId(e.id)}
              styles={customSelectStyles}
              aria-label="Therapist"
            />
            {errorRecipient && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {translate('error_message.appointment.therapist.required')}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        )}
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
  appointment: PropTypes.object,
  selectedDate: PropTypes.string,
  userLocale: PropTypes.string
};

export default CreatePatient;
