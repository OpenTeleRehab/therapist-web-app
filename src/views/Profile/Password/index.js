import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { updatePassword } from 'store/auth/actions';
import validatePassword from '../../../utils/validatePassword';

const passwordLength = 8;
const Password = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();

  const [formFields, setFormFields] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordError, setPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPasswordValidationError, setNewPasswordValidationError] = useState(false);
  const [newPasswordValidationExist, setNewPasswordValidationExit] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordNotMatchError, setConfirmPasswordNotMatchError] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSave = () => {
    let canSave = true;

    if (formFields.current_password === '') {
      canSave = false;
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    // eslint-disable-next-line no-self-compare
    if (formFields.current_password === formFields.new_password) {
      canSave = false;
      setNewPasswordValidationError(false);
      setNewPasswordValidationExit(true);
    } else {
      setNewPasswordValidationExit(false);
      if (formFields.new_password === '') {
        canSave = false;
        setNewPasswordValidationError(false);
        setNewPasswordError(true);
      } else {
        if (!validatePassword(formFields.new_password)) {
          canSave = false;
          setNewPasswordValidationError(true);
        } else { setNewPasswordValidationError(false); }
      }
    }
    if (formFields.confirm_password === '') {
      canSave = false;
      setConfirmPasswordNotMatchError(false);
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
      if (formFields.confirm_password !== formFields.new_password) {
        canSave = false;
        setConfirmPasswordNotMatchError(true);
      } else {
        setConfirmPasswordNotMatchError(false);
      }
    }

    if (canSave) {
      dispatch(updatePassword(formFields))
        .then((result) => {
          if (result) {
            history.goBack();
          }
        });
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <>
      <Form className="mt-4">
        <Form.Row >
          <Form.Group className="col-sm-4 md-4" controlId="formCurrentPassword">
            <Form.Label>{translate('profile.current_password')}</Form.Label>
            <Form.Control
              type="password"
              name="current_password"
              onChange={handleChange}
              isInvalid={passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.current_password')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formNewPassword">
            <Form.Label>{translate('profile.new_password')}</Form.Label>
            <Form.Control
              type="password"
              name="new_password"
              onChange={handleChange}
              isInvalid={newPasswordError || newPasswordValidationError || newPasswordValidationExist}
            />
            <Form.Control.Feedback type="invalid">
              {newPasswordError && translate('error.new_password')}
              {newPasswordValidationError && translate('error.new_password_validation', { passwordLength })}
              {newPasswordValidationExist && translate('error.new_password_validation_exist')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formConfirmNewPassword">
            <Form.Label>{translate('profile.confirm_new_password')}</Form.Label>
            <Form.Control
              type="password"
              name="confirm_password"
              onChange={handleChange}
              isInvalid={confirmPasswordError || confirmPasswordNotMatchError }
            />
            <Form.Control.Feedback type="invalid">
              {confirmPasswordError && translate('error.confirm_password')}
              {confirmPasswordNotMatchError && translate('error.confirm_password_not_match')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Button
            onClick={handleSave}
            disabled={!formFields.current_password && !formFields.new_password && !formFields.confirm_password}
          >
            {translate('common.save')}
          </Button>
          <Button
            className="ml-2"
            variant="outline-dark"
            onClick={handleCancel}
          >
            {translate('common.cancel')}
          </Button>
        </Form.Row>
      </Form>
    </>
  );
};

Password.propTypes = {
  handleEditPwd: PropTypes.func
};

export default Password;
