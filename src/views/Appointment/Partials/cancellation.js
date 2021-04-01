import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { ListGroup } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { ApproveAction, CancelAction } from 'components/ActionIcons';
import _ from 'lodash';
import 'moment/min/locales';
import PropTypes from 'prop-types';

import Dialog from 'components/Dialog';
import settings from 'settings';
import { updateAppointmentStatus, deleteAppointment } from 'store/appointment/actions';

const Cancellation = ({ selectedDate, date }) => {
  const { profile } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { appointments } = useSelector((state) => state.appointment);
  const [cancellations, setCancellations] = useState([]);
  const [id, setId] = useState('');
  const [formFields, setFormFields] = useState({
    status: ''
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSwitchStatusDialog, setShowSwitchStatusDialog] = useState(false);
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  useEffect(() => {
    if (appointments.cancelRequests) {
      const groupedData = _.chain(appointments.cancelRequests)
        .groupBy((item) => moment.utc(item.start_date).local().format('dddd, MMMM DD YYYY'))
        .map((value, key) => ({ date: key, cancels: value }))
        .value();
      setCancellations(groupedData);
    }
  }, [appointments]);

  const handleSwitchStatus = (id, status, action) => {
    setId(id);
    setFormFields({ ...formFields, status: status });
    setShowSwitchStatusDialog(true);
    if (action === 'cancel') {
      setMessageContent(translate('appointment.cancel.message'));
      setMessageTitle(translate('appointment.cancel'));
    } else {
      setMessageContent(translate('appointment.approve.message'));
      setMessageTitle('appointment.approve');
    }
  };

  const handleSwitchStatusDialogClose = () => {
    setId(null);
    setShowSwitchStatusDialog(false);
  };

  const handleSwitchStatusDialogConfirm = () => {
    const filter = {
      now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
      date: moment(date).locale('en').format(settings.date_format),
      selected_from_date: selectedDate ? moment.utc(selectedDate.startOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
      selected_to_date: selectedDate ? moment.utc(selectedDate.endOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
      therapist_id: profile.id
    };
    dispatch(updateAppointmentStatus(id, formFields, filter)).then(result => {
      if (result) {
        handleSwitchStatusDialogClose();
      }
    });
  };

  const handleDelete = (id) => {
    setId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setId(null);
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
    dispatch(deleteAppointment(id, filter)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  return (
    <>
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
                          <div>{moment.utc(appointment.start_date).local().format('hh:mm A')}</div>
                          <div>{moment.utc(appointment.end_date).local().format('hh:mm A')}</div>
                        </div>
                        <span>{translate('appointment.appointment_with_name', { name: (appointment.patient.first_name + ' ' + appointment.patient.last_name) })}</span>
                        <ApproveAction className="ml-auto" onClick={() => handleDelete(appointment.id)} />
                        <CancelAction className="ml-1" onClick={() => handleSwitchStatus(appointment.id, 'approved', 'cancel')} />
                      </div>
                    );
                  })
                }
              </ListGroup.Item>
            );
          })
        }
      </ListGroup>
      <Dialog
        show={showSwitchStatusDialog}
        title={messageTitle}
        cancelLabel={translate('common.no')}
        onCancel={handleSwitchStatusDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleSwitchStatusDialogConfirm}
      >
        <p>{messageContent}</p>
      </Dialog>
      <Dialog
        show={showDeleteDialog}
        title={translate('appointment.delete.title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('appointment.delete.content')}</p>
      </Dialog>
    </>
  );
};

Cancellation.propTypes = {
  selectedDate: PropTypes.string,
  date: PropTypes.string
};

export default Cancellation;
