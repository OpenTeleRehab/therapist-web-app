import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateProfile } from 'store/auth/actions';

import { getCountryName } from 'utils/country';
import { getClinicName } from 'utils/clinic';

const Edition = () => {
  const clinics = useSelector(state => state.clinic.clinics);
  const countries = useSelector(state => state.country.countries);
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();
  const { profile } = useSelector((state) => state.auth);
  const [formFields, setFormFields] = useState({
    last_name: '',
    first_name: ''
  });

  const [errorLastName, setErrorLastName] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormFields({
        last_name: profile.last_name,
        first_name: profile.first_name
      });
    }
  }, [profile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSave = () => {
    let canSave = true;

    if (formFields.first_name === '') {
      canSave = false;
      setErrorFirstName(true);
    } else {
      setErrorFirstName(false);
    }

    if (formFields.last_name === '') {
      canSave = false;
      setErrorLastName(true);
    } else {
      setErrorLastName(false);
    }

    if (canSave) {
      dispatch(updateProfile(profile.id, formFields))
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

  if (profile === undefined) {
    return React.Fragment;
  }

  return (
    <Form className="mt-4">
      <Form.Row>
        <Form.Group className="col-sm-2 md-4" controlId="formLastName">
          <Form.Label>{translate('common.last_name')}</Form.Label>
          <Form.Control
            name="last_name"
            onChange={handleChange}
            value={formFields.last_name}
            placeholder={translate('placeholder.last_name')}
            isInvalid={errorLastName}
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.last_name')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="col-sm-2 md-4" controlId="formFirstName">
          <Form.Label>{translate('common.first_name')}</Form.Label>
          <Form.Control
            name="first_name"
            onChange={handleChange}
            value={formFields.first_name}
            placeholder={translate('placeholder.first_name')}
            isInvalid={errorFirstName}
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.first_name')}
          </Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group className="col-sm-4 md-4" controlId="formEmail">
          <Form.Label>{translate('common.email')}</Form.Label>
          <Form.Control name="email" disabled value={profile.email} />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group className="col-sm-4 md-4" controlId="formCountry">
          <Form.Label>{translate('common.country')}</Form.Label>
          <Form.Control
            name="country_id"
            as="select"
            disabled
          >
            <option value={profile.country_id}>{getCountryName(profile.country_id, countries)}</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group className="col-sm-4 md-4" controlId="formClinic">
          <Form.Label>{translate('common.clinic')}</Form.Label>
          <Form.Control
            name="hospital_id"
            as="select"
            disabled
          >
            <option value={profile.clinic_id}>{getClinicName(profile.clinic_id, clinics)}</option>
          </Form.Control>
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
  );
};

export default Edition;
