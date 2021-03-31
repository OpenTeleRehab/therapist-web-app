import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { ListGroup } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { DeleteAction, ApproveAction } from 'components/ActionIcons';
import _ from 'lodash';

const Cancellation = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { appointments } = useSelector((state) => state.appointment);
  const [cancellations, setCancellations] = useState([]);

  useEffect(() => {
    if (appointments.cancelRequests) {
      const groupedData = _.chain(appointments.cancelRequests)
        .groupBy((item) => moment.utc(item.start_date).local().format('dddd, MMMM DD YYYY'))
        .map((value, key) => ({ date: key, cancels: value }))
        .value();
      setCancellations(groupedData);
    }
  }, [appointments]);

  return (
    <ListGroup variant="flush">
      {
        cancellations.map((group, index) => {
          return (
            <ListGroup.Item key={index}>
              <div className="text-primary font-weight-bold">{group.date}</div>
              {
                group.cancels.map(appointment => {
                  return (
                    <div className="d-flex mt-3" key={appointment.id}>
                      <div className="pr-3 mr-3 border-right">
                        <div>{moment(appointment.start_date).utc().format('hh:mm A')}</div>
                        <div>{moment(appointment.end_date).utc().format('hh:mm A')}</div>
                      </div>
                      <span>{translate('appointment.appointment_with_name', { name: (appointment.patient.first_name + ' ' + appointment.patient.last_name) })}</span>
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

export default Cancellation;
