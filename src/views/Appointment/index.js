import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { Col, Row, Tab, Nav, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import 'moment/min/locales';
import enLocale from 'locales/fullcalendar/en';
import kmLocale from 'locales/fullcalendar/km';
import settings from 'settings';
import { getAppointments, updateAppointmentUnread } from 'store/appointment/actions';
import List from './Partials/list';
import CreateAppointment from './Partials/create';
import { getLayoutDirection } from '../../utils/layoutDirection';
import customColorScheme from '../../utils/customColorScheme';
import { getAssistiveTechnologies } from 'store/assistiveTechnology/actions';
import Chip from '../../components/Chip';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getPatient } from '../../store/patient/actions';
import * as ROUTES from '../../variables/routes';

const calendarLocales = [...allLocales, enLocale, kmLocale];

const Appointment = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { search } = useLocation();
  const { appointments } = useSelector((state) => state.appointment);
  const { languages } = useSelector(state => state.language);
  const { profile } = useSelector((state) => state.auth);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const calendarRef = useRef();
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [locale, setLocale] = useState('en');
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [userLocale, setUserLocale] = useState('en-us');
  const [patient, setPatient] = useState(undefined);

  const patientId = queryString.parse(search).patient_id;

  useEffect(() => {
    if (patientId) {
      dispatch(getPatient(patientId)).then(patient => {
        setPatient(patient);
      });
    } else {
      setPatient(undefined);
    }
  }, [patientId]);

  useEffect(() => {
    if (date && profile) {
      const filter = {
        now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
        date: moment(date).locale('en').format(settings.date_format),
        selected_from_date: selectedDate ? moment.utc(selectedDate.startOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
        selected_to_date: selectedDate ? moment.utc(selectedDate.endOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
        therapist_id: profile.id
      };

      if (patientId) {
        filter.patient_id = parseInt(patientId);
      }

      dispatch(getAppointments(filter));
    }
  }, [dispatch, date, selectedDate, profile, patientId]);

  useEffect(() => {
    if (date && profile) {
      if (!Array.isArray(appointments) && appointments && appointments.unreadAppointments.length) {
        dispatch(updateAppointmentUnread(_.map(appointments.unreadAppointments, 'id'))).then(result => {
          if (result) {
            dispatch(getAppointments({
              now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
              date: moment(date).locale('en').format(settings.date_format),
              therapist_id: profile.id
            }));
          }
        });
      }
    }
  }, [dispatch, date, profile, appointments]);

  useEffect(() => {
    if (languages.length && profile) {
      const language = languages.find(lang => lang.id === profile.language_id);
      if (language) {
        setLocale(language.code);
        moment.locale(language.code);
        setUserLocale(language.code);
      } else {
        setLocale('en-us');
        moment.locale('en-us');
      }
    }
  }, [languages, profile]);

  useEffect(() => {
    if (appointments.calendarData) {
      const groupedCalendarData = _.chain(appointments.calendarData)
        .groupBy((item) =>
          moment.utc(item.start_date).local().locale('en').format('YYYY-MM-DD')
        )
        .map((value, key) => ({ date: key, total: value.length }))
        .value();
      const approvedAppointments = groupedCalendarData.map(appointment => {
        return {
          title: translate('appointment.number_of_appointments', { numberOfAppointments: appointment.total }),
          date: appointment.date
        };
      });

      setEvents(approvedAppointments);
    }
  }, [appointments, translate]);

  useEffect(() => {
    dispatch(getAssistiveTechnologies({ lang: profile.language_id }));
  }, [profile, dispatch]);

  const handleViewChange = (info) => {
    setSelectedDate(undefined);
    const newDate = moment(info.view.currentStart);
    if (!newDate.isSame(date)) {
      setDate(newDate);
    }
  };

  const handleDateClick = (info) => {
    const { startStr } = info;
    if (selectedDate && selectedDate.isSame(startStr, 'day')) {
      calendarRef.current.getApi().unselect();
      setSelectedDate(undefined);
    } else {
      setSelectedDate(moment(startStr));
    }
  };

  const handleEventClick = (info) => {
    const { startStr } = info.event;
    if (selectedDate && selectedDate.isSame(startStr, 'day')) {
      calendarRef.current.getApi().unselect();
      setSelectedDate(undefined);
    } else {
      calendarRef.current.getApi().select(startStr);
      setSelectedDate(moment(startStr));
    }
  };

  const handleClose = () => {
    moment.locale(userLocale);
    setEditId('');
    setSelectedPatientId('');
    setShow(false);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
  };

  return (
    <Row>
      <Col sm={12} xl={7}>
        <FullCalendar
          isRTL={getLayoutDirection(profile.language_id, languages) === 'rtl'}
          ref={calendarRef}
          locales={calendarLocales}
          locale={locale}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          events={events}
          select={handleDateClick}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          datesSet={handleViewChange}
          unselectAuto={false}
          customButtons={{
            addAppointmentButton: {
              text: translate('appointment.add_appointment'),
              click: function () {
                setShow(true);
                moment.locale(userLocale);
              }
            }
          }}
          headerToolbar={{
            left: 'title',
            right: 'addAppointmentButton today prev,next'
          }}
        />
        {
          show && <CreateAppointment
            handleClose={handleClose}
            show={show}
            editId={editId}
            selectedDate={selectedDate}
            selectedPatientId={selectedPatientId}
            userLocale={userLocale}
          />
        }
      </Col>
      <Col sm={12} xl={5}>
        <Tab.Container defaultActiveKey="list">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="list">
                {translate('appointment.appointment_list')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="new">
                {translate('appointment.new_requested')}
                <Badge className="ml-1" variant="danger">
                  {appointments.newAppointments ? appointments.newAppointments.length : 0}
                </Badge>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {patient && (
            <Chip label={`${patient.first_name} ${patient.last_name}`} onDelete={() => history.push(ROUTES.APPOINTMENT)} />
          )}

          <Tab.Content>
            <Tab.Pane eventKey="list">
              <List handleEdit={handleEdit} appointments={appointments.approves} selectedDate={selectedDate} date={date} />
            </Tab.Pane>
            <Tab.Pane eventKey="new">
              <List handleEdit={handleEdit} appointments={appointments.newAppointments} selectedDate={selectedDate} date={date} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Col>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </Row>
  );
};

const renderEventContent = (info) => {
  return (
    <div className="text-center text-truncate">{info.event.title}</div>
  );
};

Appointment.propTypes = {
  translate: PropTypes.func
};

export default Appointment;
