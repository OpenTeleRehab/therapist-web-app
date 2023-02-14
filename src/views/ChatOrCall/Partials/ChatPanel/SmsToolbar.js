import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Col } from 'react-bootstrap';
import settings from 'settings';
import Datetime from '../../../../components/DateTime';
import moment from 'moment/moment';
import TimeKeeper from 'react-timekeeper';
import { useSelector } from 'react-redux';
import { ImInfo } from 'react-icons/im';
import { getTranslate } from 'react-localize-redux';
import { isGSM7 } from 'utils/general';
import { TEXT_MAX_LENGTH } from 'variables/sms';
import _ from 'lodash';

const INPUT_MIN_HEIGHT = 70;

const SmsToolbar = (props) => {
  const textAreaRef = useRef(null);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
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
      const formatDate = _.cloneDeep(date);
      setFormattedDate(formatDate.locale(userLocale).format(settings.date_format));
    } else {
      setFormattedDate('');
    }
    // eslint-disable-next-line
  }, [date]);

  useEffect(() => {
    if (time.isValid) {
      // set moment locale to en before convert
      moment.locale('en');
      const formatted = moment(time.formatted12, 'hh:mm a').locale(userLocale).format('hh:mm A');
      setFormattedTime(formatted);

      const now = moment().locale('en').format('YYYY-MM-DD HH:mm:ss');
      const fromTimeThen = moment(moment(date).format(settings.date_format) + ' ' + moment(time.formatted12, 'hh:mm a').format('hh:mm A'), settings.date_format + ' hh:mm A').locale('en').format('YYYY-MM-DD HH:mm:ss');

      if (time.formatted12 !== '' && moment(time.formatted12, 'hh:mm a').locale('en').isValid() && !moment(fromTimeThen).isBefore(now)) {
        if (props.onTimeChanged) {
          props.onTimeChanged(time.formatted12);
        }

        if (props.isSent) {
          setSent(false);
        }

        if (props.onSentChanged) {
          props.onSentChanged(sent);
        }
        setErrorTime(false);
      } else {
        if (props.onTimeChanged) {
          props.onTimeChanged('');
        }
        setErrorTime(true);
      }
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

  useEffect(() => {
    if (formattedDate || formattedTime) {
      const smsText = translate('sms.reminder.alert', { date: formattedDate || settings.date_format, time: formattedTime || settings.time_format });
      setText(checkGSM(smsText));
      props.onInputChanged(checkGSM(smsText));
    } else {
      const smsText = translate('sms.reminder.alert', { date: settings.date_format, time: settings.time_format });
      setText(checkGSM(smsText));
    }
  }, [formattedDate, formattedTime]);

  const checkGSM = (smsText) => {
    let newSmsText = smsText;
    if (isGSM7(smsText)) {
      if (smsText.length > TEXT_MAX_LENGTH.GSM_7) {
        newSmsText = smsText.substring(0, TEXT_MAX_LENGTH.GSM_7);
      }
    } else {
      if (smsText.length > TEXT_MAX_LENGTH.NON_GSM) {
        newSmsText = smsText.substring(0, TEXT_MAX_LENGTH.NON_GSM);
      }
    }
    return newSmsText;
  };

  const validateDate = (current) => {
    const yesterday = moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  };

  const handleTimeClick = () => {
    setShowTime(true);
  };

  const handleTimeChange = (value) => {
    setTime(value || '');
  };

  const handleDateChange = (value) => {
    const yesterday = moment().subtract(1, 'day');
    const currentDate = moment().local('en').format(settings.date_format);

    if (moment(value, settings.date_format, true).isValid() && value.isAfter(yesterday)) {
      setDate(value);

      const selectedDate = value.format(settings.date_format);
      if (currentDate < selectedDate) {
        setErrorTime(false);
        setTime('');
      }

      setErrorDate(false);

      if (props.onDateChanged) {
        props.onDateChanged(value.format(settings.date_format));
      }

      if (props.isSent) {
        setSent(false);
      }

      if (props.onSentChanged) {
        props.onSentChanged(sent);
      }
    } else {
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
                  value={date ? moment(date).locale(userLocale).format(settings.date_format) : ''}
                  onChange={(value) => handleDateChange(value)}
                  isValidDate={ validateDate }
                />
                {errorDate && (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {translate('error_message.appointment_date')}
                  </Form.Control.Feedback>
                )}
              </Col>
              <Col>
                <label htmlFor="time-from">{translate('common.time')}</label>
                <span className="text-dark ml-1">*</span>
                <Form.Control
                  type="text"
                  name="from"
                  defaultValue={formattedTime}
                  placeholder={translate('placeholder.time')}
                  onClick={handleTimeClick}
                  disabled={typeof date !== 'object'}
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
                          {translate('common.close')}
                        </div>
                      )}
                    />
                }
                {errorTime && (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {translate('error_message.appointment_from')}
                  </Form.Control.Feedback>
                )}
              </Col>
            </Form.Row>
          </Form.Group>
        </div>
      </Form.Group>
      <Form.Text className="text-muted form-text mt-2 d-flex">
        <ImInfo size={20} /><span className="ml-2">{translate('therapist.sms.usage')}</span>
      </Form.Text>
    </>
  );
};

SmsToolbar.propTypes = {
  onDateChanged: PropTypes.func,
  onTimeChanged: PropTypes.func,
  onInputChanged: PropTypes.func,
  isSent: PropTypes.bool,
  onSentChanged: PropTypes.func
};

export default SmsToolbar;
