import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as ROUTES from 'variables/routes';
import settings from 'settings';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Tooltip,
  OverlayTrigger
  , Dropdown, DropdownButton, Button
} from 'react-bootstrap';

import { BsFillChatSquareFill } from 'react-icons/bs';
import { FaPhoneAlt } from 'react-icons/fa';
import CustomPhoneNumber from 'utils/phoneNumber';

import EllipsisText from 'react-ellipsis-text';

import { getCountryName } from 'utils/country';
import AgeCalculation from 'utils/age';
import { activateDeactivateAccount, getUsers, deleteAccount } from 'store/user/actions';
import CreatePatient from 'views/Patient/create';
import Dialog from 'components/Dialog';
import {
  getChatRooms, selectRoom, setIsOnChatPage
} from '../../../store/rocketchat/actions';
import { loadMessagesInRoom, sendNewMessage } from '../../../utils/rocketchat';
import { markMessagesAsRead } from '../../../utils/chat';
import RocketchatContext from '../../../context/RocketchatContext';
import {
  showErrorNotification
} from '../../../store/notification/actions';
import { generateHash } from '../../../utils/general';
import { CALL_STATUS } from '../../../variables/rocketchat';

const PatientInfo = ({ id, translate }) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);
  const { profile } = useSelector((state) => state.auth);
  const therapist = useSelector(state => state.auth.profile);
  const countries = useSelector(state => state.country.countries);
  const { authToken, chatRooms } = useSelector(state => state.rocketchat);
  const [editId, setEditId] = useState('');
  const [show, setShow] = useState(false);
  const [showActivateDeactivateDialog, setShowActivateDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [disabledConfirmButton, setDisabledConfirmButton] = useState(false);
  const [isSecondaryTherapist, setIsSecondaryTherapist] = useState(false);
  const history = useHistory();
  const chatSocket = useContext(RocketchatContext);

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
    dispatch(getUsers({
      id: id
    }));
  }, [id, dispatch]);

  useEffect(() => {
    if (id && users.length) {
      const data = users.find(user => user.id === parseInt(id));
      setFormFields({
        name: data.last_name + ' ' + data.first_name || '',
        id: data.id || '',
        phone: CustomPhoneNumber(data.dial_code, data.phone) || '',
        date_of_birth: moment(data.date_of_birth, 'YYYY-MM-DD').format(settings.date_format) || '',
        country: getCountryName(data.country_id, countries),
        note: data.note || '',
        age: AgeCalculation(data.date_of_birth, translate) || '',
        chat_user_id: data.chat_user_id || '',
        enabled: data.enabled
      });
      setIsSecondaryTherapist(data.secondary_therapists.includes(profile.id));
    }
  }, [id, users, countries, translate, profile]);

  useEffect(() => {
    if (therapist && therapist.chat_user_id && therapist.chat_rooms.length && authToken) {
      dispatch(getChatRooms());
    }
    dispatch(setIsOnChatPage(false));
  }, [authToken, dispatch, therapist]);

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
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
    const findIndex = chatRooms.findIndex(r => r.u._id === formFields.chat_user_id);
    if (findIndex !== -1) {
      dispatch(selectRoom(chatRooms[findIndex]));
      loadMessagesInRoom(chatSocket, chatRooms[findIndex].rid, therapist.id);
      setTimeout(() => {
        markMessagesAsRead(chatSocket, chatRooms[findIndex].rid, therapist.id);
      }, 1000);
      history.push(ROUTES.CHAT_OR_CALL);
    } else {
      dispatch(showErrorNotification('chat_or_call', 'error_message.chat_nonactivated'));
    }
  };

  const handleSelectRoomToCall = () => {
    const findIndex = chatRooms.findIndex(r => r.u._id === formFields.chat_user_id);
    if (findIndex !== -1) {
      const newMessage = {
        _id: generateHash(),
        rid: chatRooms[findIndex].rid,
        msg: CALL_STATUS.AUDIO_STARTED
      };
      sendNewMessage(chatSocket, newMessage, therapist.id);
      dispatch(selectRoom(chatRooms[findIndex]));
      loadMessagesInRoom(chatSocket, chatRooms[findIndex].rid, therapist.id);
      setTimeout(() => {
        markMessagesAsRead(chatSocket, chatRooms[findIndex].rid, therapist.id);
      }, 1000);
      history.push(ROUTES.CHAT_OR_CALL);
    } else {
      dispatch(showErrorNotification('chat_or_call', 'error_message.chat_nonactivated'));
    }
  };

  return (
    <>
      <div className="btn-toolbar mb-2 mb-md-0 d-flex float-right mt-3">
        <Button
          variant="link"
          className="mr-2 btn-circle-lg btn-light-blue"
          onClick={() => handleSelectRoomToCall()}
        >
          <FaPhoneAlt size={20} />
        </Button>
        <Button
          variant="link"
          className="mr-4 btn-circle-lg btn-light-blue"
          onClick={() => handleSelectRoomToChat()}
        >
          <BsFillChatSquareFill size={20} />
        </Button>
        {!isSecondaryTherapist &&
        <DropdownButton alignRight variant="primary" title={translate('common.action')} className="mr-3">
          <Dropdown.Item onClick={() => handleEdit(formFields.id)}>{translate('common.edit_info')}</Dropdown.Item>
          <Dropdown.Item onClick={handleActivateDeactivateAccount}>{formFields.enabled ? translate('patient.deactivate_account') : translate('patient.activate_account')}</Dropdown.Item>
          <Dropdown.Item disabled={formFields.enabled} onClick={handleDeleteAccount}>{translate('patient.delete_account')}</Dropdown.Item>
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
    </>
  );
};

PatientInfo.propTypes = {
  id: PropTypes.string,
  translate: PropTypes.func
};

export default PatientInfo;
