import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { DeleteAction, EditAction } from 'components/ActionIcons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getTranslate } from 'react-localize-redux';
import _ from 'lodash';

const AppointmentList = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { appointments } = useSelector((state) => state.appointment);
  const [approvedAppointments, setApprovedAppointments] = useState([]);

  useEffect(() => {
    if (appointments.approves) {
      const groupedData = _.chain(appointments.approves)
        .groupBy((item) => moment(item.start_date).utc().format('dddd, MMMM DD YYYY'))
        .map((value, key) => ({ date: key, approves: value }))
        .value();
      setApprovedAppointments(groupedData);
    }
  }, [appointments]);

  return (
    <ListGroup variant="flush">
      {
        approvedAppointments.map((group, index) => {
          return (
            <ListGroup.Item key={index}>
              <div className="text-primary font-weight-bold">{group.date}</div>
              {
                group.approves.map(appointment => {
                  return (
                    <div className="d-flex mt-3" key={appointment.id}>
                      <div className="pr-3 mr-3 border-right">
                        <div>{moment(appointment.start_date).utc().format('hh:mm A')}</div>
                        <div>{moment(appointment.end_date).utc().format('hh:mm A')}</div>
                      </div>
                      <span>{translate('appointment.appointment_with_name', { name: (appointment.patient.first_name + ' ' + appointment.patient.last_name) })}</span>
                      <EditAction className="ml-auto" />
                      <DeleteAction className="ml-1" />
                    </div>
                  );
                })
              }
            </ListGroup.Item>
          );
        })
      }
    </ListGroup>
  );
};

export default AppointmentList;
