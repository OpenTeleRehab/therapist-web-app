import React, { useEffect, useState } from 'react';

import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { getTranslate } from 'react-localize-redux';
import _ from 'lodash';
import PropType from 'prop-types';
import settings from 'settings';
import Dialog from 'components/Dialog';
import {
  deleteAppointment,
  updateAppointmentStatus,
  getAppointments
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
import { BiEdit } from 'react-icons/bi';
import { FaCalendarCheck } from 'react-icons/fa';
import { RejectAction, TrashAction } from 'components/ActionIcons';
import { useMutationAction } from 'hooks/useMutationAction';
import { useDelete } from 'hooks/useDelete';
import { END_POINTS } from 'variables/endPoint';
import useToast from 'components/V2/Toast';

const AppointmentList = ({ handleEdit, appointments, filter }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { profile } = useSelector((state) => state.auth);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const { mutate: acceptAppointmentMutation } = useMutationAction(`${END_POINTS.APPOINTMENTS}/${appointment?.id}/accept`);
  const { mutate: declineAppointmentMutation } = useMutationAction(`${END_POINTS.APPOINTMENTS}/${appointment?.id}/decline`);
  const { mutate: deleteAppointmentMutation } = useDelete(END_POINTS.APPOINTMENTS);

  useEffect(() => {
    if (appointments) {
      const groupedData = _.chain(appointments)
        .groupBy((item) => moment.utc(item.start_date).local().format('dddd, MMMM DD YYYY'))
        .map((value, key) => ({ date: key, approves: value }))
        .value();
      setApprovedAppointments(groupedData);
    }
  }, [appointments]);

  const handleDelete = (appointment) => {
    setAppointment(appointment);
    setShowDeleteDialog(true);
  };

  const handleDialogClose = () => {
    setAppointment(null);
    setShowDeleteDialog(false);
    setShowAcceptDialog(false);
    setShowRejectDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    if (appointment.patient_id) {
      dispatch(deleteAppointment(appointment.id, filter)).then(result => {
        if (result) {
          handleDialogClose();
        }
      });
    } else {
      deleteAppointmentMutation(appointment.id, {
        onSuccess: async (res) => {
          showToast({
            title: translate('appointment.cancel.title'),
            message: translate(res?.message),
            color: 'success'
          });
          handleDialogClose();
        },
        onError: async (error) => {
          showToast({
            title: translate('toast_title.error_message'),
            message: translate(error?.message),
            color: 'danger'
          });
        }
      });
    }
  };

  const handleAcceptDialogConfirm = () => {
    if (appointment.patient_id) {
      dispatch(updateAppointmentStatus(appointment.id, { therapist_status: APPOINTMENT_STATUS.ACCEPTED }, filter)).then(result => {
        if (result) {
          dispatch(showSuccessNotification('toast_title.accept_appointment', 'success_message.appointment_accept'));
          handleDialogClose();
        }
      });
    } else {
      acceptAppointmentMutation(
        { invalidateKeys: [END_POINTS.APPOINTMENTS] },
        {
          onSuccess: async (res) => {
            showToast({
              title: translate('appointment.accept.title'),
              message: translate(res?.message),
              color: 'success'
            });
            handleDialogClose();
          },
          onError: async (error) => {
            showToast({
              title: translate('toast_title.error_message'),
              message: translate(error?.message),
              color: 'danger'
            });
          }
        }
      );
    }
  };

  const handleRejectDialogConfirm = () => {
    if (appointment.patient_id) {
      dispatch(updateAppointmentStatus(appointment.id, { therapist_status: APPOINTMENT_STATUS.REJECTED }, filter)).then(result => {
        if (result) {
          dispatch(showSuccessNotification('toast_title.reject_appointment', 'success_message.appointment_reject'));
          handleDialogClose();
        }
      });
    } else {
      declineAppointmentMutation({ invalidateKeys: [END_POINTS.APPOINTMENTS] },
        {
          onSuccess: async (res) => {
            showToast({
              title: translate('appointment.reject.title'),
              message: translate(res?.message),
              color: 'success'
            });
            handleDialogClose();
          },
          onError: async (error) => {
            showToast({
              title: translate('toast_title.error_message'),
              message: translate(error?.message),
              color: 'danger'
            });
          }
        }
      );
    }
  };

  const isPast = (datetime) => {
    return datetime.isBefore(moment());
  };

  const handleAccept = (appointment) => {
    setAppointment(appointment);
    setShowAcceptDialog(true);
    dispatch(getAppointments(filter));
  };

  const handleReject = (appointment) => {
    setAppointment(appointment);
    setShowRejectDialog(true);
    dispatch(getAppointments(filter));
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

  const isOwner = (appointment) => {
    return appointment.created_by_therapist || (appointment.requester_id === profile.id);
  };

  const getUserStatus = (appointment) => {
    return appointment.therapist_status ? appointment.therapist_status : isOwner(appointment) ? appointment.requester_status : appointment.recipient_status;
  };

  const isEditDisabled = (appointment) => {
    return isPast(moment.utc(appointment.start_date).local()) ||
      appointment.patient_status === APPOINTMENT_STATUS.ACCEPTED || appointment.patient_status === APPOINTMENT_STATUS.REJECTED ||
      appointment.recipient_status === APPOINTMENT_STATUS.ACCEPTED || appointment.recipient_status === APPOINTMENT_STATUS.REJECTED;
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
                  const { therapist_status: therapistStatus, patient_status: patientStatus, requester_status: requesterStatus, recipient_status: recipientStatus } = appointment;
                  let additionTextStyle = {};
                  let statusTextStyle = { color: _.isEmpty(colorScheme) ? scssColors.primary : colorScheme.primary_color };
                  let statusText = 'appointment.status.accept';
                  if ([therapistStatus, patientStatus, requesterStatus, recipientStatus].includes(APPOINTMENT_STATUS.INVITED)) {
                    statusTextStyle = { color: scssColors.dark };
                    statusText = 'appointment.status.pending';
                  } else if (
                    [therapistStatus, patientStatus, requesterStatus, recipientStatus].includes(APPOINTMENT_STATUS.REJECTED)
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
                        <div style={additionTextStyle}>
                          {translate('appointment.appointment_with_name', {
                            name: appointment.patient
                              ? `${appointment.patient.last_name} ${appointment.patient.first_name}`
                              : appointment.requester_id === profile.id
                                ? `${appointment?.recipient.last_name} ${appointment?.recipient.first_name}`
                                : `${appointment?.requester.last_name} ${appointment?.requester.first_name}`
                          })}
                        </div>
                        <div className="mt-2">
                          {renderAppointmentNote(appointment)}
                        </div>
                        <div className="mt-2 status-text mr-3" style={statusTextStyle}>
                          {translate(statusText)}
                        </div>
                      </div>
                      <div className="p-3 ml-auto">
                        {isOwner(appointment) && (
                          <>
                            <Button aria-label="Edit" className="font-weight-bold pr-3 pl-3 mb-1 mr-1" onClick={() => handleEdit(appointment)} disabled={isEditDisabled(appointment)}>
                              <BiEdit className="mr-1" size={20} /><span>{translate('common.edit')}</span>
                            </Button>
                            <TrashAction className="mb-1 font-weight-bold" disabled={isPast(moment.utc(appointment.start_date).local())} onClick={ () => handleDelete(appointment) } />
                          </>
                        )}
                        {!isOwner(appointment) && !(getUserStatus(appointment) === APPOINTMENT_STATUS.REJECTED || isPast(moment.utc(appointment.start_date).local())) && (
                          <>
                            {!(getUserStatus(appointment) === APPOINTMENT_STATUS.ACCEPTED || isPast(moment.utc(appointment.start_date).local())) && (
                              <Button aria-label="Accept" className="ml-auto font-weight-bold pr-3 pl-3 mb-1 mr-1" onClick={() => handleAccept(appointment)}>
                                <FaCalendarCheck size={15} /><span>{translate('common.accept')}</span>
                              </Button>
                            )}
                            <RejectAction className="pr-3 pl-3 mb-1 font-weight-bold" onClick={() => handleReject(appointment)} disabled={getUserStatus(appointment) === APPOINTMENT_STATUS.REJECTED || isPast(moment.utc(appointment.start_date).local())} />
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
        title={translate('appointment.cancel.title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('appointment.cancel.content')}</p>
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
  filter: PropType.object
};

export default AppointmentList;
