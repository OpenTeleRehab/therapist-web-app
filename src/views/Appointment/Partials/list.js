import React, { useEffect, useState } from 'react';
import {
  ApproveAction,
  CancelAction,
  DeleteAction,
  EditAction
} from 'components/ActionIcons';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { getTranslate } from 'react-localize-redux';
import _ from 'lodash';
import PropType from 'prop-types';
import settings from 'settings';
import Dialog from 'components/Dialog';
import { deleteAppointment } from 'store/appointment/actions';
import { APPOINTMENT_STATUS } from '../../../variables/appointment';
import scssColors from 'scss/custom.scss';

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
      {
        approvedAppointments.map((group, index) => {
          return (
            <div key={index}>
              <div className="my-3 text-primary font-weight-bold">{group.date}</div>
              {
                group.approves.map(appointment => {
                  const { therapist_status: therapistStatus, patient_status: patientStatus } = appointment;
                  let additionDateStyle = { backgroundColor: scssColors.primary };
                  let additionTextStyle = {};
                  if ([therapistStatus, patientStatus].includes(APPOINTMENT_STATUS.INVITED)) {
                    additionDateStyle = { backgroundColor: scssColors.orangeLight };
                  } else if (
                    [therapistStatus, patientStatus].includes(APPOINTMENT_STATUS.REJECTED)
                  ) {
                    additionDateStyle = { backgroundColor: scssColors.orange };
                    additionTextStyle = { textDecorationLine: 'line-through' };
                  }

                  return (
                    <div className="mx-3 mb-2 pr-2 d-flex border border-light rounded overflow-hidden" key={appointment.id}>
                      <div className="p-3 text-white" style={additionDateStyle}>
                        <div>{moment.utc(appointment.start_date).local().format('hh:mm A')}</div>
                        <div>{moment.utc(appointment.end_date).local().format('hh:mm A')}</div>
                      </div>
                      <div className="p-3" style={additionTextStyle}>
                        {translate('appointment.appointment_with_name', { name: (appointment.patient.first_name + ' ' + appointment.patient.last_name) })}
                      </div>
                      <div className="p-3 ml-auto">
                        {appointment.created_by_therapist && (
                          <>
                            <EditAction onClick={() => handleEdit(appointment.id)} disabled={isPast(moment.utc(appointment.start_date).local())} />
                            <DeleteAction className="ml-1" disabled={isPast(moment.utc(appointment.start_date).local())} onClick={ () => handleDelete(appointment.id) } />
                          </>
                        )}
                        {!appointment.created_by_therapist && (
                          <>
                            <ApproveAction className="ml-auto" />
                            <CancelAction className="ml-1" />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              }
              {(index < approvedAppointments.length - 1) && <hr />}
            </div>
          );
        })
      }
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
  handleEdit: PropType.func,
  selectedDate: PropType.object,
  date: PropType.object
};

export default AppointmentList;
