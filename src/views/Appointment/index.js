import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Col, Row, Tabs, Tab } from 'react-bootstrap';
import List from './Partials/list';
import { getAppointments } from 'store/appointment/actions';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/min/locales';
import allLocales from '@fullcalendar/core/locales-all';
import enLocale from 'locales/fullcalendar/en';
import kmLocale from 'locales/fullcalendar/km';
import settings from 'settings';
import CreateAppointment from './Partials/create';
import _ from 'lodash';
import { getLayoutDirection } from '../../utils/layoutDirection';
import customColorScheme from '../../utils/customColorScheme';

const calendarLocales = [...allLocales, enLocale, kmLocale];

const Appointment = ({ translate }) => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (date && profile) {
      const filter = {
        now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
        date: moment(date).locale('en').format(settings.date_format),
        selected_from_date: selectedDate ? moment.utc(selectedDate.startOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
        selected_to_date: selectedDate ? moment.utc(selectedDate.endOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
        therapist_id: profile.id
      };
      dispatch(getAppointments(filter));
    }
  }, [date, selectedDate, profile, dispatch]);

  useEffect(() => {
    if (languages.length && profile) {
      const language = languages.find(lang => lang.id === profile.language_id);
      if (language) {
        setLocale(language.code);
        moment.locale(language.code);
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

  const handleViewChange = (info) => {
    setSelectedDate(undefined);
    setDate(moment(info.view.currentStart));
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
          />
        }
      </Col>
      <Col sm={12} xl={5}>
        <Tabs defaultActiveKey="list" id="uncontrolled-tab-example">
          <Tab eventKey="list" title={translate('appointment.appointment_list')}>
            <List handleEdit={handleEdit} selectedDate={selectedDate} date={date} />
          </Tab>
        </Tabs>
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
