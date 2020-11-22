import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const Password = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();

  const [formFields, setFormFields] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSave = () => {
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
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formNewPassword">
            <Form.Label>{translate('profile.new_password')}</Form.Label>
            <Form.Control
              type="password"
              name="new_password"
              onChange={handleChange}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formConfirmNewPassword">
            <Form.Label>{translate('profile.confirm_new_password')}</Form.Label>
            <Form.Control
              type="password"
              name="confirm_password"
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.email')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Button onClick={handleSave}>
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
