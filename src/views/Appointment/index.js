import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Col, Row, Tabs, Tab, Badge } from 'react-bootstrap';
import List from './Partials/list';
import Request from './Partials/request';
import Cancellation from './Partials/cancellation';
import { getAppointments } from 'store/appointment/actions';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/min/locales';
import allLocales from '@fullcalendar/core/locales-all';
import settings from 'settings';
import CreateAppointment from './Partials/create';

const Appointment = ({ translate }) => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointment);
  const { languages } = useSelector(state => state.language);
  const { profile } = useSelector((state) => state.auth);
  const calendarRef = useRef();
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState('');
  const [selectedDate, setSelectedDate] = useState();
  const [locale, setLocale] = useState('');
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    if (date && profile) {
      dispatch(getAppointments({
        date: moment(date).locale('en').format(settings.date_format),
        selected_date: selectedDate ? moment(selectedDate).locale('en').format(settings.date_format) : null,
        therapist_id: profile.id
      }));
    }
  }, [date, selectedDate, profile, dispatch]);

  useEffect(() => {
    if (languages.length && profile) {
      const language = languages.find(lang => lang.id === profile.language_id);
      setLocale(language.code);
      moment.locale(language.code);
    }
  }, [languages, profile]);

  useEffect(() => {
    if (appointments.calendarData) {
      const approvedAppointments = appointments.calendarData.map(appointment => {
        return {
          title: translate('appointment.number_of_appointments', { numberOfAppointments: appointment.total }),
          date: appointment.date
        };
      });

      setEvents(approvedAppointments);
    }
  }, [appointments, translate]);

  const handleViewChange = (info) => {
    setSelectedDate('');
    setDate(moment(info.view.currentStart));
  };

  const handleDateClick = (info) => {
    setSelectedDate(moment(info.startStr));
  };

  const handleEventClick = (info) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.select(info.event.startStr);
    setSelectedDate(moment(info.event.startStr));
  };

  const handleClose = () => {
    setEditId('');
    setSelectedPatientId('');
    setShow(false);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
  };

  const handleApprove = (id) => {
    setSelectedPatientId(id);
    setShow(true);
  };

  return (
    <Row>
      <Col sm={12} xl={7}>
        <FullCalendar
          ref={calendarRef}
          locales={allLocales}
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
              }
            },
            clearButton: {
              text: translate('appointment.clear'),
              click: function () {
                calendarRef.current.getApi().unselect();
                setSelectedDate('');
              }
            }
          }}
          headerToolbar={{
            left: 'title',
            right: 'addAppointmentButton clearButton today prev,next'
          }}
        />
        {
          show && <CreateAppointment
            handleClose={handleClose}
            show={show}
            editId={editId}
            filterDate={moment(date).locale('en').format(settings.date_format)}
            selectedDate={selectedDate ? moment(selectedDate).locale('en').format(settings.date_format) : null}
            selectedPatientId={selectedPatientId}
          />
        }
      </Col>
      <Col sm={12} xl={5}>
        <Tabs defaultActiveKey="list" id="uncontrolled-tab-example">
          <Tab eventKey="list" title={translate('appointment.appointment_list')}>
            <List handleEdit={handleEdit} />
          </Tab>
          <Tab
            eventKey="request"
            title={
              <div className="d-flex align-items-center">
                <span>{ translate('appointment.request_for_appointment')} </span>
                {!!(appointments.requests && appointments.requests.length) &&
                  <Badge variant="danger" className="circle d-md-block ml-2">{appointments.requests.length}</Badge>
                }
              </div>
            }>
            <Request handleApprove={handleApprove} />
          </Tab>
          <Tab
            eventKey="cancel"
            title={
              <div className="d-flex align-items-center">
                <span>{ translate('appointment.cancellation')} </span>
                {!!(appointments.cancelRequests && appointments.cancelRequests.length) &&
                  <Badge variant="danger" className="circle d-md-block ml-2">{appointments.cancelRequests.length}</Badge>
                }
              </div>
            }>
            <Cancellation />
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
};

const renderEventContent = (info) => {
  return (
    <>
      <div className="text-center text-truncate">{info.event.title}</div>
    </>
  );
};

Appointment.propTypes = {
  translate: PropTypes.func
};

export default Appointment;
