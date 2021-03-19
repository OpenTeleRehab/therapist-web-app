import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { DeleteAction, ApproveAction } from 'components/ActionIcons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

const Request = () => {
  const { appointments } = useSelector((state) => state.appointment);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (appointments.requests) {
      const groupedData = _.chain(appointments.requests)
        .groupBy((item) => moment(item.created_at).utc().format('dddd, MMMM DD YYYY'))
        .map((value, key) => ({ date: key, requests: value }))
        .value();
      setRequests(groupedData);
    }
  }, [appointments]);

  return (
    <ListGroup variant="flush">
      {
        requests.map((group, index) => {
          return (
            <ListGroup.Item key={index}>
              <div className="text-primary font-weight-bold">{group.date}</div>
              {
                group.requests.map(appointment => {
                  return (
                    <div className="d-flex mt-3" key={appointment.id}>
                      <span>{appointment.patient.first_name + ' ' + appointment.patient.last_name}</span>
                      <ApproveAction className="ml-auto" />
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

export default Request;
