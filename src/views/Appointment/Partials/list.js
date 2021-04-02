import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { DeleteAction, EditAction } from 'components/ActionIcons';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { getTranslate } from 'react-localize-redux';
import _ from 'lodash';
import PropType from 'prop-types';
import settings from 'settings';
import Dialog from 'components/Dialog';
import { deleteAppointment } from 'store/appointment/actions';

const AppointmentList = ({ handleEdit, selectedDate, date }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { appointments } = useSelector((state) => state.appointment);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [id, setId] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (appointments.approves) {
      const groupedData = _.chain(appointments.approves)
        .groupBy((item) => moment.utc(item.start_date).local().format('dddd, MMMM DD YYYY'))
        .map((value, key) => ({ date: key, approves: value }))
        .value();
      setApprovedAppointments(groupedData);
    }
  }, [appointments]);

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

  const isPast = (datetime) => {
    return datetime.isBefore(moment());
  };

  return (
    <>
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
                        <EditAction className="ml-auto" onClick={() => handleEdit(appointment.id)} disabled={isPast(moment.utc(appointment.start_date).local())} />
                        <DeleteAction className="ml-1" disabled={isPast(moment.utc(appointment.start_date).local())} onClick={ () => handleDelete(appointment.id) } />
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

AppointmentList.propTypes = {
  handleEdit: PropType.number,
  selectedDate: PropType.string,
  date: PropType.string
};

export default AppointmentList;
