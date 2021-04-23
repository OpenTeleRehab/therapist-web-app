import React, { useState, useEffect } from 'react';
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

import EllipsisText from 'react-ellipsis-text';

import { getCountryName } from 'utils/country';
import AgeCalculation from 'utils/age';
import { activateDeactivateAccount, getUsers, deleteAccount } from 'store/user/actions';
import CreatePatient from 'views/Patient/create';
import Dialog from 'components/Dialog';

const PatientInfo = ({ id, translate, breadcrumb }) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);
  const countries = useSelector(state => state.country.countries);
  const [editId, setEditId] = useState('');
  const [show, setShow] = useState(false);
  const [showActivateDeactivateDialog, setShowActivateDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [disabledConfirmButton, setDisabledConfirmButton] = useState(false);
  const history = useHistory();

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
        phone: data.phone || '',
        date_of_birth: moment(data.date_of_birth, 'YYYY-MM-DD').format(settings.date_format) || '',
        country: getCountryName(data.country_id, countries),
        note: data.note || '',
        age: AgeCalculation(data.date_of_birth, translate) || '',
        enabled: data.enabled
      });
    }
  }, [id, users, countries, translate]);

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

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pr-3 pl-3 pt-3">
        <span>{breadcrumb}</span>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="link" className="mr-2 btn-circle-lg btn-light-blue">
            <FaPhoneAlt size={20} />
          </Button>
          <Button variant="link" className="mr-4 btn-circle-lg btn-light-blue">
            <BsFillChatSquareFill size={20} />
          </Button>
          <DropdownButton alignRight variant="primary" title={translate('common.action')}>
            <Dropdown.Item onClick={() => handleEdit(formFields.id)}>{translate('common.edit_info')}</Dropdown.Item>
            <Dropdown.Item onClick={handleActivateDeactivateAccount}>{formFields.enabled ? translate('patient.deactivate_account') : translate('patient.activate_account')}</Dropdown.Item>
            <Dropdown.Item disabled={formFields.enabled} onClick={handleDeleteAccount}>{translate('patient.delete_account')}</Dropdown.Item>
          </DropdownButton>
        </div>
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
  translate: PropTypes.func,
  breadcrumb: PropTypes.string
};

export default PatientInfo;
