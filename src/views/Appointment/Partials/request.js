import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { DeleteAction, ApproveAction } from 'components/ActionIcons';
import { useSelector } from 'react-redux';
import moment from 'moment';

const Request = () => {
  const { appointments } = useSelector((state) => state.appointment);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (appointments.requests) {
      setRequests(appointments.requests);
    }
  }, [appointments]);

  return (
    <ListGroup variant="flush">
      {
        requests.map(appointment => {
          return (
            <ListGroup.Item key={appointment.id}>
              <div className="text-primary font-weight-bold mb-3">{moment(appointment.created_at).utc().format('dddd, MMMM DD YYYY')}</div>
              <div className="d-flex">
                <span>{appointment.patient.first_name + ' ' + appointment.patient.last_name}</span>
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

export default Request;
