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
import { APPOINTMENT_STATUS } from 'variables/appointment';
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
  const [showSwitchStatusDialog, setShowSwitchStatusDialog] = useState(false);
  const [showDeleteAppointmentDialog, setShowDeleteAppointmentDialog] = useState(false);
  const [formFields, setFormFields] = useState({
    status: ''
  });

  useEffect(() => {
    if (appointments.cancelRequests) {
      const groupedData = _.chain(appointments.cancelRequests)
        .groupBy((item) => moment.utc(item.start_date).local().format('dddd, MMMM DD YYYY'))
        .map((value, key) => ({ date: key, cancels: value }))
        .value();
      setCancellations(groupedData);
    }
  }, [appointments]);

  const handleSwitchStatusDialogClose = () => {
    setId(null);
    setShowSwitchStatusDialog(false);
  };

  const handleSwitchStatus = (id, status) => {
    setId(id);
    setFormFields({ ...formFields, status: status });
    setShowSwitchStatusDialog(true);
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

  const handleDeleteAppointment = (id) => {
    setId(id);
    setShowDeleteAppointmentDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setId(null);
    setShowDeleteAppointmentDialog(false);
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
                        <ApproveAction className="ml-auto" onClick={() => handleDeleteAppointment(appointment.id)} />
                        <CancelAction className="ml-1" onClick={() => handleSwitchStatus(appointment.id, APPOINTMENT_STATUS.approved)} />
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
        title={translate('appointment.cancel')}
        cancelLabel={translate('common.no')}
        onCancel={handleSwitchStatusDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleSwitchStatusDialogConfirm}
      >
        <p>{translate('appointment.cancel.message')}</p>
      </Dialog>
      <Dialog
        show={showDeleteAppointmentDialog}
        title={translate('appointment.accept.cancel.title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('appointment.accept.cancel.content')}</p>
      </Dialog>
    </>
  );
};

Cancellation.propTypes = {
  selectedDate: PropTypes.string,
  date: PropTypes.string,
  handleSwitchStatus: PropTypes.func
};

export default Cancellation;
