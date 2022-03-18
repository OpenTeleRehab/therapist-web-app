import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateProfile } from 'store/auth/actions';
import { FaGlobe } from 'react-icons/fa';

import { getCountryName } from 'utils/country';
import { getClinicName } from 'utils/clinic';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import customColorScheme from '../../../utils/customColorScheme';
import _ from 'lodash';

const Edition = () => {
  const clinics = useSelector(state => state.clinic.clinics);
  const countries = useSelector(state => state.country.countries);
  const languages = useSelector(state => state.language.languages);
  const professions = useSelector(state => state.profession.professions);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();
  const { profile } = useSelector((state) => state.auth);
  const [formFields, setFormFields] = useState({
    last_name: '',
    first_name: '',
    language_id: '',
    profession_id: '',
    show_guidance: ''
  });
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormFields({
        last_name: profile.last_name,
        first_name: profile.first_name,
        language_id: profile.language_id,
        profession_id: profile.profession_id,
        show_guidance: profile.show_guidance
      });
    }
  }, [profile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleCheckBoxChange = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
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
      const language = languages.find(item => item.id === formFields.language_id);
      const data = { ...formFields, language_code: (language ? language.code : null) };
      dispatch(updateProfile(profile.id, data))
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

  const handleSingleSelectChange = (key, value) => {
    setFormFields({ ...formFields, [key]: value });
  };

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <>
      <Form className="my-4" onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Row>
          <Form.Group className="col-sm-2 md-4" controlId="formLastName">
            <Form.Label>{translate('common.last_name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
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
            <span className="text-dark ml-1">*</span>
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
          <Form.Group className="col-sm-4 md-4" controlId="formLanguage">
            <Form.Label>
              <FaGlobe className="mr-1" />
              {translate('common.language')}
            </Form.Label>
            <Select
              placeholder={translate('placeholder.language')}
              classNamePrefix="filter"
              value={languages.filter(option => option.id === formFields.language_id)}
              getOptionLabel={option => option.name}
              options={[
                { id: '', name: translate('placeholder.language') },
                ...languages
              ]}
              onChange={(e) => handleSingleSelectChange('language_id', e.id)}
              styles={customSelectStyles}
              aria-label="Language"
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formProfession">
            <Form.Label>{translate('common.profession')}</Form.Label>
            <Select
              placeholder={translate('placeholder.profession')}
              classNamePrefix="filter"
              value={professions.filter(option => option.id === formFields.profession_id)}
              getOptionLabel={option => option.name}
              options={[
                {
                  id: '',
                  name: translate('placeholder.profession')
                },
                ...professions
              ]}
              onChange={(e) => handleSingleSelectChange('profession_id', e.id)}
              styles={customSelectStyles}
              aria-label="Profession"
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formCountry">
            <Form.Label>{translate('common.country')}</Form.Label>
            <Select
              aria-label={getCountryName(profile.country_id, countries)}
              value={formFields.country_id}
              placeholder={getCountryName(profile.country_id, countries)}
              classNamePrefix="filter"
              isDisabled={true}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formClinic">
            <Form.Label>{translate('common.clinic')}</Form.Label>
            <Select
              aria-label={getClinicName(profile.clinic_id, clinics)}
              value={formFields.clinic_id}
              placeholder={getClinicName(profile.clinic_id, clinics)}
              classNamePrefix="filter"
              isDisabled={true}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formShowGuidance">
            <Form.Check
              custom
              checked={formFields.show_guidance}
              name="show_guidance"
              type="checkbox"
              label={translate('common.guidance.hide')}
              onChange={handleCheckBoxChange}
            />
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
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default Edition;
