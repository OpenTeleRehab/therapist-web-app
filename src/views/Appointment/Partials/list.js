import React, { useEffect, useState } from 'react';
import {
  AcceptAction,
  RejectAction,
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
import {
  deleteAppointment,
  updateAppointmentStatus
} from 'store/appointment/actions';
import {
  APPOINTMENT_STATUS
} from 'variables/appointment';
import scssColors from 'scss/custom.scss';
import {
  showSuccessNotification
} from 'store/notification/actions';
import EllipsisText from 'react-ellipsis-text';
import { getAssistiveTechnologyName } from 'utils/assistiveTechnology';

const AppointmentList = ({ handleEdit, appointments, selectedDate, date }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [id, setId] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    if (appointments) {
      const groupedData = _.chain(appointments)
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

  const handleDialogClose = () => {
    setId(null);
    setShowDeleteDialog(false);
    setShowAcceptDialog(false);
    setShowRejectDialog(false);
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
        handleDialogClose();
      }
    });
  };

  const handleAcceptDialogConfirm = () => {
    const filter = {
      now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
      date: moment(date).locale('en').format(settings.date_format),
      selected_from_date: selectedDate ? moment.utc(selectedDate.startOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
      selected_to_date: selectedDate ? moment.utc(selectedDate.endOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
      therapist_id: profile.id
    };
    dispatch(updateAppointmentStatus(id, { status: APPOINTMENT_STATUS.ACCEPTED }, filter)).then(result => {
      if (result) {
        dispatch(showSuccessNotification('toast_title.accept_appointment', 'success_message.appointment_accept'));
        handleDialogClose();
      }
    });
  };

  const handleRejectDialogConfirm = () => {
    const filter = {
      now: moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss'),
      date: moment(date).locale('en').format(settings.date_format),
      selected_from_date: selectedDate ? moment.utc(selectedDate.startOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
      selected_to_date: selectedDate ? moment.utc(selectedDate.endOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null,
      therapist_id: profile.id
    };
    dispatch(updateAppointmentStatus(id, { status: APPOINTMENT_STATUS.REJECTED }, filter)).then(result => {
      if (result) {
        dispatch(showSuccessNotification('toast_title.reject_appointment', 'success_message.appointment_reject'));
        handleDialogClose();
      }
    });
  };

  const isPast = (datetime) => {
    return datetime.isBefore(moment());
  };

  const handleAccept = (id) => {
    setId(id);
    setShowAcceptDialog(true);
  };

  const handleReject = (id) => {
    setId(id);
    setShowRejectDialog(true);
  };

  const renderAppointmentNote = (appointment) => {
    if (appointment.assistive_technology) {
      const followUpText = translate('appointment.at_follow_up', { name: getAssistiveTechnologyName(appointment.assistive_technology.assistive_technology_id) });
      if (appointment.note) {
        return (
          <span>
            {followUpText + ' : '}
            <EllipsisText text={appointment.note} length={settings.noteMaxLength - followUpText.length} />
          </span>
        );
      } else {
        return (
          <span>{ followUpText }</span>
        );
      }
    } else {
      return (
        <>
          {appointment.note && (<EllipsisText text={appointment.note} length={settings.noteMaxLength} />)}
        </>
      );
    }
  };

  return (
    <>
      {approvedAppointments.length ? (
        approvedAppointments.map((group, index) => {
          return (
            <div key={index}>
              <div className="my-3 text-primary font-weight-bold">{group.date}</div>
              {
                group.approves.map(appointment => {
                  const { therapist_status: therapistStatus, patient_status: patientStatus } = appointment;
                  let additionTextStyle = {};
                  let statusTextStyle = { color: _.isEmpty(colorScheme) ? scssColors.primary : colorScheme.primary_color };
                  let statusText = 'appointment.status.accept';
                  if ([therapistStatus, patientStatus].includes(APPOINTMENT_STATUS.INVITED)) {
                    statusTextStyle = { color: scssColors.dark };
                    statusText = 'appointment.status.pending';
                  } else if (
                    [therapistStatus, patientStatus].includes(APPOINTMENT_STATUS.REJECTED)
                  ) {
                    additionTextStyle = { textDecorationLine: 'line-through' };
                    statusTextStyle = { color: scssColors.orange };
                    statusText = 'appointment.status.decline';
                  }

                  return (
                    <div key={appointment.id} className={appointment.therapist_status === 'invited' ? 'mb-2 d-flex border rounded overflow-hidden border-primary bg-info' : 'mb-2 d-flex border rounded overflow-hidden border-light'}>
                      <div className="p-3 text-white" style={{ backgroundColor: _.isEmpty(colorScheme) ? scssColors.primary : colorScheme.primary_color }}>
                        <div>{moment.utc(appointment.start_date).local().format('hh:mm A')}</div>
                        <div>{moment.utc(appointment.end_date).local().format('hh:mm A')}</div>
                      </div>
                      <div className={appointment.assistive_technology || appointment.note ? 'px-3 pt-2 pb-1' : 'p-3'}>
                        <div style={additionTextStyle}>{translate('appointment.appointment_with_name', { name: (appointment.patient.first_name + ' ' + appointment.patient.last_name) })}</div>
                        <div className="mt-2">
                          {renderAppointmentNote(appointment)}
                        </div>
                        <div className="mt-2 status-text mr-3" style={statusTextStyle}>
                          {translate(statusText)}
                        </div>
                      </div>
                      <div className="p-3 ml-auto">
                        {appointment.created_by_therapist && (
                          <>
                            <EditAction onClick={() => handleEdit(appointment.id)} disabled={isPast(moment.utc(appointment.start_date).local()) || appointment.patient_status === APPOINTMENT_STATUS.ACCEPTED || appointment.patient_status === APPOINTMENT_STATUS.REJECTED} />
                            <DeleteAction className="ml-1" disabled={isPast(moment.utc(appointment.start_date).local())} onClick={ () => handleDelete(appointment.id) } />
                          </>
                        )}
                        {!appointment.created_by_therapist && (
                          <>
                            <AcceptAction className="ml-auto" onClick={() => handleAccept(appointment.id)} disabled={therapistStatus === APPOINTMENT_STATUS.ACCEPTED || isPast(moment.utc(appointment.start_date).local())} />
                            <RejectAction className="ml-1" onClick={() => handleReject(appointment.id)} disabled={therapistStatus === APPOINTMENT_STATUS.REJECTED || isPast(moment.utc(appointment.start_date).local())} />
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
      ) : (
        <div className="my-3">
          <p>{translate('common.no_appointment')}</p>
        </div>
      )}
      <Dialog
        show={showDeleteDialog}
        title={translate('appointment.delete.title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('appointment.delete.content')}</p>
      </Dialog>
      <Dialog
        show={showAcceptDialog}
        title={translate('appointment.accept.title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleAcceptDialogConfirm}
      >
        <p>{translate('appointment.accept.content')}</p>
      </Dialog>
      <Dialog
        show={showRejectDialog}
        title={translate('appointment.reject.title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleRejectDialogConfirm}
      >
        <p>{translate('appointment.reject.content')}</p>
      </Dialog>
    </>
  );
};

AppointmentList.propTypes = {
  handleEdit: PropType.func,
  appointments: PropType.array,
  selectedDate: PropType.object,
  date: PropType.object
};

export default AppointmentList;
