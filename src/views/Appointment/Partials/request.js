import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { DeleteAction, ApproveAction } from 'components/ActionIcons';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import PropType from 'prop-types';
import { getTranslate } from 'react-localize-redux';
import Dialog from 'components/Dialog';
import { deleteAppointmentRequest } from 'store/appointment/actions';
import settings from 'settings';

const Request = ({ handleApprove, selectedDate, date }) => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointment);
  const localize = useSelector((state) => state.localize);
  const { profile } = useSelector((state) => state.auth);
  const translate = getTranslate(localize);
  const [requests, setRequests] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [id, setId] = useState('');

  useEffect(() => {
    if (appointments.requests) {
      const groupedData = _.chain(appointments.requests)
        .groupBy((item) => moment.utc(item.created_at).local().format('dddd, MMMM DD YYYY'))
        .map((value, key) => ({ date: key, requests: value }))
        .value();
      setRequests(groupedData);
    }
  }, [appointments]);

  const handleDelete = (id) => {
    setId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setId('');
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    const filter = {
      now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
      date: moment(date).locale('en').format(settings.date_format),
      selected_from_date: selectedDate ? moment.utc(selectedDate.startOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
      selected_to_date: selectedDate ? moment.utc(selectedDate.endOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
      therapist_id: profile.id
    };
    dispatch(deleteAppointmentRequest(id, filter)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  return (
    <>
      <Dialog
        show={showDeleteDialog}
        title={translate('appointment.delete.request.title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('appointment.delete.appointment.request')}</p>
      </Dialog>
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
                        <ApproveAction className="ml-auto" onClick={() => handleApprove(appointment.id, appointment.patient_id)} />
                        <DeleteAction className="ml-1" onClick={() => handleDelete(appointment.id)} />
                      </div>
                    );
                  })
                }
              </ListGroup.Item>
            );
          })
        }
      </ListGroup>
    </>
  );
};

Request.propTypes = {
  handleApprove: PropType.func,
  selectedDate: PropType.object,
  date: PropType.object
};

export default Request;
