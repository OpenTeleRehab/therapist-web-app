import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Col } from 'react-bootstrap';
import settings from 'settings';
import Datetime from '../../../../components/DateTime';
import moment from 'moment/moment';
import TimeKeeper from 'react-timekeeper';
import { useSelector } from 'react-redux';
import { ImInfo } from 'react-icons/im';

const INPUT_MIN_HEIGHT = 50;

const SmsToolbar = (props) => {
  const textAreaRef = useRef(null);
  const { languages } = useSelector(state => state.language);
  const { profile } = useSelector((state) => state.auth);
  const [parentHeight, setParentHeight] = useState(INPUT_MIN_HEIGHT);
  const [textAreaHeight, setTextAreaHeight] = useState(INPUT_MIN_HEIGHT);
  const [text, setText] = useState('');
  const [errorDate, setErrorDate] = useState(false);
  const [errorTime, setErrorTime] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [userLocale, setUserLocale] = useState('en-us');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setText(props.smsAlertTemplate.value || '');
  }, [props.smsAlertTemplate]);

  useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      setParentHeight(textAreaRef.current.scrollHeight);
      setTextAreaHeight(textAreaRef.current.scrollHeight);
    }
  }, [text, textAreaRef]);

  useEffect(() => {
    if (languages.length && profile) {
      const language = languages.find(lang => lang.id === profile.language_id);
      if (language) {
        moment.locale(language.code);
        setUserLocale(language.code);
      } else {
        moment.locale('en-us');
      }
    }
  }, [languages, profile]);

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
    if (time.isValid) {
      // set moment locale to en before convert
      moment.locale('en');
      const formatted = time.formatted12 ? moment(time.formatted12, 'hh:mm a').locale(userLocale).format('hh:mm A') : moment(time).locale(userLocale).format('hh:mm A');
      setFormattedTime(formatted);
      // set moment locale back after convert
      moment.locale(userLocale);
    } else {
      setFormattedTime('');
    }
    // eslint-disable-next-line
  }, [time, userLocale]);

  useEffect(() => {
    if (props.isSent) {
      setTime('');
      setFormattedDate('');
      setDate('');
      setSent(true);
    } else {
      setSent(false);
    }
  }, [props.isSent]);

  const validateDate = (current) => {
    const yesterday = moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  };

  const handleTimeClick = () => {
    setShowTime(true);
  };

  const handleTimeChange = (value) => {
    setTime(value || '');

    const formatted = moment(value.formatted12, 'hh:mm a').locale(userLocale).format('hh:mm A');
    const now = moment().locale('en').format('YYYY-MM-DD HH:mm:ss');
    const fromTimeThen = moment(moment(date).format(settings.date_format) + ' ' + formatted, settings.date_format + ' hh:mm A').locale('en').format('YYYY-MM-DD HH:mm:ss');

    if (value !== '' && moment(value.formatted12, 'hh:mm a').locale('en').isValid() && !moment(fromTimeThen).isBefore(now)) {
      const strTime = text.includes('HH:MM A');
      if (strTime) {
        setText(text.replace('HH:MM A', value.formatted12));
      }

      var reg = /((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/;
      if (text.match(reg)) {
        setText(text.replace(reg, value.formatted12));
      }

      if (props.onInputChanged) {
        props.onInputChanged(text);
      }

      if (props.onTimeChanged) {
        props.onTimeChanged(value.formatted12);
      }

      if (props.isSent) {
        setSent(false);
      }

      if (props.onSentChanged) {
        props.onSentChanged(sent);
      }
      setErrorTime(false);
    } else {
      setErrorTime(true);
    }
  };

  const handleDateChange = (value) => {
    const yesterday = moment().subtract(1, 'day');
    const currentDate = moment().local('en').format('DD/MM/YYYY');

    if (moment(value, settings.date_format, true).isValid() && value.isAfter(yesterday)) {
      setDate(value);
      setFormattedDate(moment(date));

      const selectedDate = value.format('DD/MM/YYYY');
      if (currentDate < selectedDate) {
        setErrorTime(false);
        setTime('');
      }

      const strDate = text.includes('dd/mm/yyyy');
      if (strDate) {
        setText(text.replace('dd/mm/yyyy', selectedDate));
      }

      const reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
      const d = value.format('DD/MM/YYYY');
      if (text.match(reg) && d.match(reg)) {
        setText(text.replace(reg, d));
      }
      setErrorDate(false);

      if (props.onInputChanged) {
        props.onInputChanged(text);
      }

      if (props.onDateChanged) {
        props.onDateChanged(d);
      }

      if (props.isSent) {
        setSent(false);
      }

      if (props.onSentChanged) {
        props.onSentChanged(sent);
      }
    } else {
      setFormattedDate('');
      setErrorDate(true);
      if (props.onDateChanged) {
        props.onDateChanged('');
      }
    }
  };

  return (
    <>
      <Form.Group className='d-flex align-items-end chat-input-toolbar chat-message' style={{ minHeight: parentHeight }}>
        <div className='position-relative w-100'>
          <Form.Control
            name="sms.reminder.alert"
            value={text}
            ref={textAreaRef}
            as="textarea"
            rows={1}
            style={{ height: textAreaHeight }}
            aria-label="Chat text"
            disabled="disabled"
          />
          <Form.Group controlId="groupDateTime" className="mt-2">
            <Form.Row>
              <Col>
                <label htmlFor="appointment-date">{props.translate('appointment.date')}</label>
                <span className="text-dark ml-1">*</span>
                <Datetime
                  inputProps={{
                    id: 'appointment-date',
                    name: 'date',
                    autoComplete: 'off',
                    className: errorDate ? 'form-control is-invalid' : 'form-control',
                    placeholder: props.translate('placeholder.date')
                  }}
                  dateFormat={settings.date_format}
                  timeFormat={false}
                  closeOnSelect={true}
                  value={formattedDate}
                  format="DD/MM/YYYY"
                  onChange={(value) => handleDateChange(value)}
                  isValidDate={ validateDate }
                />
                {errorDate && (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {props.translate('error_message.appointment_date')}
                  </Form.Control.Feedback>
                )}
              </Col>
              <Col>
                <label htmlFor="time-from">{props.translate('common.time')}</label>
                <span className="text-dark ml-1">*</span>
                <Form.Control
                  type="text"
                  name="from"
                  defaultValue={formattedTime}
                  placeholder={props.translate('placeholder.time')}
                  onClick={handleTimeClick}
                  disabled={typeof formattedDate !== 'object'}
                />
                {showTime &&
                    <TimeKeeper
                      time={time.formatted12 ? time.formatted12 : time ? moment(time).locale('en-us').format('hh:mm a') : '12:00 am'}
                      onChange={(value) => handleTimeChange(value)}
                      onDoneClick={() => setShowTime(false)}
                      switchToMinuteOnHourSelect
                      closeOnMinuteSelect
                      doneButton={() => (
                        <div
                          className="text-center pt-2 pb-2"
                          onClick={() => setShowTime(false)}
                        >
                          {props.translate('common.close')}
                        </div>
                      )}
                    />
                }
                {errorTime && (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {props.translate('error_message.appointment_from')}
                  </Form.Control.Feedback>
                )}
              </Col>
            </Form.Row>
          </Form.Group>
        </div>
      </Form.Group>
      <Form.Text className="text-muted form-text mt-2 d-flex">
        <ImInfo size={20} /><span className="ml-2">{props.translate('therapist.sms.usage')}</span>
      </Form.Text>
    </>
  );
};

SmsToolbar.propTypes = {
  translate: PropTypes.func,
  smsAlertTemplate: PropTypes.object,
  onDateChanged: PropTypes.func,
  onTimeChanged: PropTypes.func,
  onInputChanged: PropTypes.func,
  isSent: PropTypes.bool,
  onSentChanged: PropTypes.func
};

export default SmsToolbar;
