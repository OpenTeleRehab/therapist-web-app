import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { ListGroup } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { DeleteAction, ApproveAction } from 'components/ActionIcons';

const Cancellation = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { appointments } = useSelector((state) => state.appointment);
  const [cancellations, setCancellations] = useState([]);

  useEffect(() => {
    if (appointments.cancelRequests) {
      setCancellations(appointments.cancelRequests);
    }
  }, [appointments]);

  return (
    <ListGroup variant="flush">
      {
        cancellations.map(appointment => {
          return (
            <ListGroup.Item key={appointment.id}>
              <div className="text-primary font-weight-bold mb-3">{moment(appointment.start_date).utc().format('dddd, MMMM DD YYYY')}</div>
              <div className="d-flex">
                <div className="pr-3 mr-3 border-right">
                  <div>{moment(appointment.start_date).utc().format('hh:mm A')}</div>
                  <div>{moment(appointment.end_date).utc().format('hh:mm A')}</div>
                </div>
                <span>{translate('appointment.appointment_with_name', { name: (appointment.patient.first_name + ' ' + appointment.patient.last_name) })}</span>
                <ApproveAction className="ml-auto" />
                <DeleteAction className="ml-1" />
              </div>
            </ListGroup.Item>
          );
        })
      }
    </ListGroup>
  );
};

export default Cancellation;
