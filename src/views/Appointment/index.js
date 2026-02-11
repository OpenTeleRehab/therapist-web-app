import React, { useEffect, useState, useRef, useMemo } from 'react';
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
import CreateAppointment from './Partials/create';
import { getLayoutDirection } from '../../utils/layoutDirection';
import customColorScheme from '../../utils/customColorScheme';
import { getAssistiveTechnologies } from 'store/assistiveTechnology/actions';
import Chip from '../../components/Chip';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getPatient } from '../../store/patient/actions';
import * as ROUTES from '../../variables/routes';
import { useList } from 'hooks/useList';
import { END_POINTS } from 'variables/endPoint';
import { APPOINTMENT_RECIPIENT_TYPES } from 'variables/appointment';
import { useMutationAction } from 'hooks/useMutationAction';
import Section from './Partials/section';

const calendarLocales = [...allLocales, enLocale, kmLocale];

const Appointment = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { search } = useLocation();
  const { appointmentsWithPatients } = useSelector((state) => state.appointment);
  const { languages } = useSelector(state => state.language);
  const { profile } = useSelector((state) => state.auth);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { countries } = useSelector(state => state.country);
  const calendarRef = useRef();
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [locale, setLocale] = useState('en');
  const [show, setShow] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [userLocale, setUserLocale] = useState('en-us');
  const [patient, setPatient] = useState(undefined);
  const [approvedAppointmentsWithPhcWorkers, setApprovedAppointmentsWithPhcWorkers] = useState([]);
  const [newAppointmentsWithPhcWorkers, setNewAppointmentsWithPhcWorkers] = useState([]);
  const [approvedAppointmentsWithTherapists, setApprovedAppointmentsWithTherapists] = useState([]);
  const [newAppointmentsWithTherapists, setNewAppointmentsWithTherapists] = useState([]);
  const [filter, setFilter] = useState({});
  const { data: { data: appointments = {} } = {} } = useList(END_POINTS.APPOINTMENTS, { ...filter }, { enabled: !_.isEmpty(filter.date) });
  const { mutate: updateUnreadMutation } = useMutationAction(END_POINTS.APPOINTMENTS_MARK_AS_READ);
  const [expandedSections, setExpandedSections] = useState({
    patient: true,
    phcWorker: true,
    therapist: true,
  });

  const patientId = queryString.parse(search).patient_id;

  const calendarData = useMemo(() => {
    if (_.isEmpty(appointments) || _.isEmpty(appointmentsWithPatients)) {
      return [];
    }
    const calendarDataAppointments = appointments?.calendarData ?? [];
    const calendarDataAppointmentsWithPatients = appointmentsWithPatients?.calendarData ?? [];

    return [...calendarDataAppointments, ...calendarDataAppointmentsWithPatients];
  }, [appointments, appointmentsWithPatients]);

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
    if (!_.isEmpty(appointments)) {
      const approvedWithPhcWorkers = appointments.approves?.filter(appointment => appointment.with_user_type === APPOINTMENT_RECIPIENT_TYPES.PHC_WORKER);
      const newWithPhcWorkers = appointments.newAppointments?.filter(appointment => appointment.with_user_type === APPOINTMENT_RECIPIENT_TYPES.PHC_WORKER);
      const approvedWithTherapists = appointments.approves?.filter(appointment => appointment.with_user_type === APPOINTMENT_RECIPIENT_TYPES.THERAPIST);
      const newWithTherapists = appointments.newAppointments?.filter(appointment => appointment.with_user_type === APPOINTMENT_RECIPIENT_TYPES.THERAPIST);
      setApprovedAppointmentsWithPhcWorkers(approvedWithPhcWorkers);
      setNewAppointmentsWithPhcWorkers(newWithPhcWorkers);
      setApprovedAppointmentsWithTherapists(approvedWithTherapists);
      setNewAppointmentsWithTherapists(newWithTherapists);
    }
  }, [appointments, appointmentsWithPatients]);

  useEffect(() => {
    if (date && countries.length) {
      const filter = {
        now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
        date: moment(date).locale('en').format(settings.date_format),
        selected_from_date: selectedDate ? moment.utc(selectedDate.startOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
        selected_to_date: selectedDate ? moment.utc(selectedDate.endOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null
      };

      if (patientId) {
        filter.patient_id = parseInt(patientId);
      }
      setFilter(filter);
      dispatch(getAppointments(filter));
    }
  }, [dispatch, date, selectedDate, patientId, countries]);

  useEffect(() => {
    if (date) {
      if (!Array.isArray(appointmentsWithPatients) && appointmentsWithPatients && appointmentsWithPatients.unreadAppointments.length) {
        dispatch(updateAppointmentUnread(_.map(appointmentsWithPatients.unreadAppointments, 'id'))).then(result => {
          if (result) {
            dispatch(getAppointments({
              now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
              date: moment(date).locale('en').format(settings.date_format)
            }));
          }
        });
      }

      if (appointments.unreadAppointments?.length) {
        updateUnreadMutation({ payload: _.map(appointments.unreadAppointments, 'id'), method: 'put', invalidateKeys: [END_POINTS.APPOINTMENTS] });
      }
    }
  }, [dispatch, date, appointmentsWithPatients, appointments]);

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
    if (calendarData.length > 0) {
      const groupedCalendarData = _.chain(calendarData)
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
  }, [calendarData, translate]);

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
    setAppointment(null);
    setSelectedPatientId('');
    setShow(false);
  };

  const handleEdit = (appointment) => {
    setAppointment(appointment);
    setShow(true);
  };

  const toggleSection = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
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
            appointment={appointment}
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
                  {
                    (appointmentsWithPatients.newAppointments?.length ?? 0) +
                    (appointments.newAppointments?.length ?? 0)
                  }
                </Badge>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {patient && (
            <Chip label={`${patient.first_name} ${patient.last_name}`} onDelete={() => history.push(ROUTES.APPOINTMENT)} />
          )}

          <Tab.Content>
            <Tab.Pane eventKey="list">
              <>
                {appointmentsWithPatients.approves?.length > 0 && (
                  <Section
                    eventKey="patient"
                    title={translate('appointment.with_patient')}
                    appointments={appointmentsWithPatients.approves}
                    handleEdit={handleEdit}
                    selectedDate={selectedDate}
                    date={date}
                    isOpen={expandedSections.patient}
                    onToggle={toggleSection}
                    filter={filter}
                  />
                )}
                {approvedAppointmentsWithPhcWorkers.length > 0 && (
                  <Section
                    eventKey="phcWorker"
                    title={translate('appointment.with_phc_worker')}
                    appointments={approvedAppointmentsWithPhcWorkers}
                    handleEdit={handleEdit}
                    selectedDate={selectedDate}
                    date={date}
                    isOpen={expandedSections.phcWorker}
                    onToggle={toggleSection}
                    filter={filter}
                  />
                )}
                {approvedAppointmentsWithTherapists.length > 0 && (
                  <Section
                    eventKey="therapist"
                    title={translate('appointment.with_therapist')}
                    appointments={approvedAppointmentsWithTherapists}
                    handleEdit={handleEdit}
                    selectedDate={selectedDate}
                    date={date}
                    isOpen={expandedSections.therapist}
                    onToggle={toggleSection}
                    filter={filter}
                  />
                )}
              </>
            </Tab.Pane>
            <Tab.Pane eventKey="new">
              <>
                {appointmentsWithPatients.newAppointments?.length > 0 && (
                  <Section
                    eventKey="patient"
                    title={translate('appointment.with_patient')}
                    appointments={appointmentsWithPatients.newAppointments}
                    handleEdit={handleEdit}
                    filter={filter}
                    isOpen={expandedSections.patient}
                    onToggle={toggleSection}
                  />
                )}
                {newAppointmentsWithPhcWorkers.length > 0 && (
                  <Section
                    eventKey="phcWorker"
                    title={translate('appointment.with_phc_worker')}
                    appointments={newAppointmentsWithPhcWorkers}
                    handleEdit={handleEdit}
                    filter={filter}
                    isOpen={expandedSections.phcWorker}
                    onToggle={toggleSection}
                  />
                )}
                {newAppointmentsWithTherapists.length > 0 && (
                  <Section
                    eventKey="therapist"
                    title={translate('appointment.with_therapist')}
                    appointments={newAppointmentsWithTherapists}
                    handleEdit={handleEdit}
                    filter={filter}
                    isOpen={expandedSections.therapist}
                    onToggle={toggleSection}
                  />
                )}
              </>
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
