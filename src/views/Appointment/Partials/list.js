import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { DeleteAction, EditAction } from 'components/ActionIcons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getTranslate } from 'react-localize-redux';
import _ from 'lodash';
import PropType from 'prop-types';

const AppointmentList = ({ handleEdit }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { appointments } = useSelector((state) => state.appointment);
  const [approvedAppointments, setApprovedAppointments] = useState([]);

  useEffect(() => {
    if (appointments.approves) {
      const groupedData = _.chain(appointments.approves)
        .groupBy((item) => moment.utc(item.start_date).local().format('dddd, MMMM DD YYYY'))
        .map((value, key) => ({ date: key, approves: value }))
        .value();
      setApprovedAppointments(groupedData);
    }
  }, [appointments]);

  const isPast = (datetime) => {
    return moment(datetime).isBefore(moment());
  };

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
                        <div>{moment.utc(appointment.start_date).local().format('hh:mm A')}</div>
                        <div>{moment.utc(appointment.end_date).local().format('hh:mm A')}</div>
                      </div>
                      <span>{translate('appointment.appointment_with_name', { name: (appointment.patient.first_name + ' ' + appointment.patient.last_name) })}</span>
                      <EditAction className="ml-auto" onClick={() => handleEdit(appointment.id)} disabled={isPast(appointment.end_date)} />
                      <DeleteAction className="ml-1" disabled={isPast(appointment.end_date)} />
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

AppointmentList.propTypes = {
  handleEdit: PropType.number
};

export default AppointmentList;
