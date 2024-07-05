import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as ROUTES from 'variables/routes';
import settings from 'settings';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Tooltip,
  OverlayTrigger,
  Dropdown,
  DropdownButton,
  Button
} from 'react-bootstrap';

import { BsFillChatSquareFill } from 'react-icons/bs';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import CustomPhoneNumber from 'utils/phoneNumber';
import EllipsisText from 'react-ellipsis-text';
import { getCountryName } from 'utils/country';
import AgeCalculation from 'utils/age';
import { activateDeactivateAccount, getUsers, deleteAccount } from 'store/user/actions';
import {
  getOrganizationTherapistAndMaxSms
} from 'store/organization/actions';
import CreatePatient from 'views/Patient/create';
import Dialog from 'components/Dialog';
import {
  getChatRooms,
  selectRoom,
  setIsOnChatPage,
  sendPodcastNotification
} from '../../../store/rocketchat/actions';
import { loadMessagesInRoom, sendNewMessage } from '../../../utils/rocketchat';
import { markMessagesAsRead } from '../../../utils/chat';
import RocketchatContext from '../../../context/RocketchatContext';
import {
  showErrorNotification
} from '../../../store/notification/actions';
import { generateHash } from '../../../utils/general';
import { CALL_STATUS } from '../../../variables/rocketchat';
import customColorScheme from '../../../utils/customColorScheme';
import _ from 'lodash';
import Message from '../message';
import CallingButton from '../../../components/CallingButton';
import SmsButton from '../../../components/SmsButton';
import {
  getTherapistMessage
} from '../../../store/message/actions';
import TransferPatient from '../transfer';

const PatientInfo = ({ id, translate }) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);
  const { profile } = useSelector((state) => state.auth);
  const therapist = useSelector(state => state.auth.profile);
  const countries = useSelector(state => state.country.countries);
  const { authToken, chatRooms } = useSelector(state => state.rocketchat);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [editId, setEditId] = useState('');
  const [show, setShow] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showActivateDeactivateDialog, setShowActivateDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [disabledConfirmButton, setDisabledConfirmButton] = useState(false);
  const [isSecondaryTherapist, setIsSecondaryTherapist] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const history = useHistory();
  const chatSocket = useContext(RocketchatContext);
  const [phone, setPhone] = useState('');
  const [maxSms, setMaxSms] = useState(2);
  const [reachMaxSms, setReachMaxSms] = useState(false);

  const [formFields, setFormFields] = useState({
    name: '',
    id: '',
    phone: '',
    date_of_birth: '',
    country: '',
    note: '',
    enabled: ''
  });

  useEffect(() => {
    if (countries.length) {
      dispatch(getUsers({
        id: id
      }));
    }
  }, [dispatch, id, countries]);

  useEffect(() => {
    if (id && users.length && countries.length) {
      const data = users.find(user => user.id === parseInt(id));
      setPhone(data.phone);
      setFormFields({
        name: data.last_name + ' ' + data.first_name || '',
        id: data.id || '',
        phone: CustomPhoneNumber(data.dial_code, data.phone) || '',
        date_of_birth: moment(data.date_of_birth, 'YYYY-MM-DD').locale('en').format(settings.date_format) || '',
        country: getCountryName(data.country_id, countries),
        note: data.note || '',
        age: AgeCalculation(data.date_of_birth, translate) || '',
        chat_user_id: data.chat_user_id || '',
        enabled: data.enabled
      });
      setIsSecondaryTherapist(data.secondary_therapists.includes(profile.id));
    }
  }, [id, translate, profile, users, countries]);

  useEffect(() => {
    if (therapist) {
      dispatch(
        getOrganizationTherapistAndMaxSms(process.env.REACT_APP_NAME))
        .then(r => {
          if (r) {
            setMaxSms(r.max_sms_per_week);
            dispatch(getTherapistMessage()).then(result => {
              if (result) {
                if (result >= r.max_sms_per_week) {
                  setReachMaxSms(true);
                } else {
                  setReachMaxSms(false);
                }
              }
            });
          }
        });
    }
  }, [therapist]);

  useEffect(() => {
    if (authToken && therapist && therapist.chat_user_id && therapist.chat_rooms.length && chatRooms.length === 0) {
      dispatch(getChatRooms());
    }
    dispatch(setIsOnChatPage(false));
  }, [dispatch, authToken, therapist, chatRooms]);

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
  };

  const handleTransfer = () => {
    setShowTransferDialog(true);
  };

  const handleClose = () => {
    setEditId('');
    setShow(false);
  };

  const handleActivateDeactivateAccount = () => {
    setShowActivateDeactivateDialog(true);
  };

  const handleActivateDeactivateDialogClose = () => {
    setShowActivateDeactivateDialog(false);
  };

  const handleActivateDeactivateDialogConfirm = (id, enabled) => {
    setDisabledConfirmButton(true);
    dispatch(activateDeactivateAccount(id, { enabled: enabled })).then(result => {
      if (result) {
        handleActivateDeactivateDialogClose();
        setDisabledConfirmButton(false);
      }
    });
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = (id) => {
    setDisabledConfirmButton(true);
    dispatch(deleteAccount(id)).then(result => {
      if (result) {
        handleDeleteDialogClose();
        setDisabledConfirmButton(false);
        history.push(ROUTES.PATIENT);
      }
    });
  };

  const handleSelectRoomToChat = () => {
    if (id && users.length) {
      const patient = users.find(user => user.id === parseInt(id));
      const findIndex = chatRooms.findIndex(r => r.u._id === patient.chat_user_id);

      if (findIndex !== -1 && patient.enabled) {
        dispatch(selectRoom(chatRooms[findIndex]));
        loadMessagesInRoom(chatSocket, chatRooms[findIndex].rid, therapist.id);
        history.push(ROUTES.CHAT_OR_CALL);
      } else {
        dispatch(showErrorNotification('chat_or_call', 'error_message.chat_nonactivated'));
      }
    }
  };

  const handleSelectRoomToCall = () => {
    if (id && users.length) {
      const patient = users.find(user => user.id === parseInt(id));
      const findIndex = chatRooms.findIndex(r => r.u._id === patient.chat_user_id);
      const _id = generateHash();
      const rid = chatRooms[findIndex].rid;
      const identity = chatRooms[findIndex].u.username;
      const title = therapist.first_name + ' ' + therapist.last_name;
      const msg = CALL_STATUS.AUDIO_STARTED;

      if (findIndex !== -1 && patient.enabled) {
        const newMessage = {
          _id,
          rid,
          msg
        };
        const notification = {
          _id,
          rid,
          identity,
          title,
          body: msg,
          translatable: false
        };

        sendNewMessage(chatSocket, newMessage, therapist.id);
        dispatch(selectRoom(chatRooms[findIndex]));
        dispatch(sendPodcastNotification(notification));
        loadMessagesInRoom(chatSocket, chatRooms[findIndex].rid, therapist.id);
        setTimeout(() => {
          markMessagesAsRead(chatSocket, chatRooms[findIndex].rid, therapist.id);
        }, 1000);
        history.push(ROUTES.CHAT_OR_CALL);
      } else {
        dispatch(showErrorNotification('chat_or_call', 'error_message.chat_nonactivated'));
      }
    }
  };

  const handleCheckMaxSms = () => {
    dispatch(getTherapistMessage()).then(rs => {
      if (rs) {
        if (rs >= maxSms) {
          setReachMaxSms(true);
        } else {
          setReachMaxSms(false);
        }
      }
    });
  };

  return (
    <>
      <div className="btn-toolbar mb-2 mb-md-0 d-flex float-right mt-3">
        <SmsButton
          reachMaxSms={reachMaxSms}
          maxSms={maxSms}
          aria-label="Call"
          variant="link"
          className="mr-2 btn-circle-lg btn-light-blue"
          onClick={() => setShowMessageDialog(true)}
        >
          <FaEnvelope size={20} />
        </SmsButton>
        <CallingButton
          aria-label="Call"
          variant="link"
          className="mr-2 btn-circle-lg btn-light-blue"
          onClick={() => handleSelectRoomToCall()}
        >
          <FaPhoneAlt size={20} />
        </CallingButton>
        <Button
          aria-label="Chat"
          variant="link"
          className="mr-4 btn-circle-lg btn-light-blue"
          onClick={() => handleSelectRoomToChat()}
        >
          <BsFillChatSquareFill size={20} />
        </Button>
        {!isSecondaryTherapist &&
          <DropdownButton alignRight variant="primary" title={translate('common.action')} className="mr-3">
            <Dropdown.Item onClick={() => handleEdit(formFields.id)}>{translate('common.edit_info')}</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTransfer()}>{translate('common.transfer')}</Dropdown.Item>
            <Dropdown.Item onClick={handleActivateDeactivateAccount}>{formFields.enabled ? translate('patient.deactivate_account') : translate('patient.activate_account')}</Dropdown.Item>
            <Dropdown.Item onClick={handleDeleteAccount} disabled={formFields.enabled}>{translate('patient.delete_account')}</Dropdown.Item>
          </DropdownButton>
        }
      </div>
      <div className="p-3">
        <h4 className="mb-">{formFields.name}</h4>
        <div className="patient-info">
          <span className="mr-4"><strong>{translate('common.label_id')}</strong> {formFields.id}</span>
          <span className="mr-4"><strong>{translate('common.mobile_number')}</strong>: {formFields.phone}</span>
          <span className="mr-4"><strong>{translate('common.dob')}</strong> {formFields.date_of_birth} ({formFields.age})</span>
          <span className="mr-4"><strong>{translate('common.label_country')}</strong> {formFields.country}</span>
          <span className="mr-4">
            <strong>{translate('common.note')} </strong>
            <OverlayTrigger
              overlay={<Tooltip id="button-tooltip-2">{ formFields.note }</Tooltip>}
            >
              <span className="card-title">
                <EllipsisText text={formFields.note} length={settings.noteMaxLength} />
              </span>
            </OverlayTrigger>
          </span>
        </div>
      </div>

      {show && <CreatePatient handleClose={handleClose} show={show} editId={editId} />}
      {showTransferDialog && <TransferPatient show={showTransferDialog} patientId={parseInt(id)} therapist={therapist} handleClose={() => setShowTransferDialog(false)} />}

      <Dialog
        show={showActivateDeactivateDialog}
        title={translate('patient.activate_deactivate_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleActivateDeactivateDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={() => handleActivateDeactivateDialogConfirm(formFields.id, formFields.enabled ? 0 : 1)}
        disabledConfirmButton={disabledConfirmButton}
      >
        <p>{translate('patient.activate_deactivate_confirmation_message', { status: formFields.enabled ? translate('patient.deactivate') : translate('patient.activate') })}</p>
      </Dialog>
      <Dialog
        show={showDeleteDialog}
        title={translate('patient.delete_account')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={() => handleDeleteDialogConfirm(formFields.id, 1)}
        disabledConfirmButton={disabledConfirmButton}
      >
        <p>{translate('patient.delete_confirmation_message')}</p>
      </Dialog>
      {showMessageDialog && <Message patientId={id} phone={phone} show={showMessageDialog} handleClose={() => setShowMessageDialog(false) } handleCheckMaxSms={handleCheckMaxSms} reachMaxSms={reachMaxSms} />}
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

PatientInfo.propTypes = {
  id: PropTypes.string,
  translate: PropTypes.func
};

export default PatientInfo;
