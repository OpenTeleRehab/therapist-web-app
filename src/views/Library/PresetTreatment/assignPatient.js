import React, { useEffect, useState } from 'react';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { Col, Form } from 'react-bootstrap';
import settings from 'settings';
import Datetime from 'components/DateTime';
import TreatmentGoal from 'views/TreatmentPlan/_Partials/Goal';
import moment from 'moment';
import { createTreatmentPlan } from 'store/treatmentPlan/actions';
import { getUsers } from '../../../store/user/actions';
import { getLastActivityDate } from '../../../utils/treatmentPlan';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import { getHealthConditionGroups } from '../../../store/healthConditionGroup/actions';
import { getHealthConditions } from '../../../store/healthCondition/actions';

const AssignPatient = ({ show, handleClose, weeks, activities }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const { users } = useSelector(state => state.user);
  const { profile } = useSelector(state => state.auth);
  const healthConditionGroups = useSelector((state) => state.healthConditionGroup.healthConditionGroups);
  const healthConditions = useSelector((state) => state.healthCondition.healthConditions);
  const [startDate, setStartDate] = useState('');
  const [errorHealthConditionGroup, setErrorHealthConditionGroup] = useState(false);
  const [errorHealthCondition, setErrorHealthCondition] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorPatient, setErrorPatient] = useState(false);
  const [goals, setGoals] = useState([]);
  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    patient_id: '',
    start_date: '',
    end_date: '',
    health_condition_group_id: '',
    health_condition_id: ''
  });

  useEffect(() => {
    dispatch(getHealthConditionGroups({ lang: profile.language_id }));
    dispatch(getHealthConditions({ lang: profile.language_id }));
  }, [dispatch, profile]);

  useEffect(() => {
    if (formFields.health_condition_group_id) {
      dispatch(getHealthConditions({ lang: profile.language_id, parent_id: formFields.health_condition_group_id }));
    }
  }, [formFields.health_condition_group_id]);

  useEffect(() => {
    if (healthConditions.length && formFields.health_condition_id && !formFields.health_condition_group_id) {
      const condition = healthConditions.find(item => item.id === formFields.health_condition_id);
      setFormFields({ ...formFields, health_condition_group_id: condition.parent_id });
    }
  }, [healthConditions, formFields.health_condition_group_id, formFields.health_condition_id]);

  useEffect(() => {
    const yesterday = moment().subtract(1, 'day');
    if (moment(startDate, settings.date_format, true).isValid() && startDate.isAfter(yesterday)) {
      const date = moment(startDate).locale('en').format(settings.date_format);
      setFormFields({ ...formFields, start_date: date });
    } else {
      setFormFields({ ...formFields, start_date: '' });
    }
    // eslint-disable-next-line
  }, [startDate]);

  useEffect(() => {
    if (formFields.start_date) {
      setFormFields({ ...formFields, end_date: moment(formFields.start_date, settings.date_format).add(weeks, 'weeks').subtract(1, 'days').locale('en').format(settings.date_format) });
    } else {
      setFormFields({ ...formFields, end_date: '' });
    }
    // eslint-disable-next-line
  }, [formFields.start_date, weeks]);

  useEffect(() => {
    if (profile) {
      dispatch(getUsers({ therapist_id: profile.id, page_size: 999 }));
    }
  }, [profile, dispatch]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const validateDate = (current) => {
    const yesterday = moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  };

  const handleConfirm = () => {
    let canSave = true;
    setErrorHealthConditionGroup(false);
    setErrorHealthCondition(false);

    if (formFields.name === '') {
      canSave = false;
      setErrorName(true);
    } else {
      setErrorName(false);
    }

    if (!formFields.patient_id) {
      canSave = false;
      setErrorPatient(true);
    } else {
      setErrorPatient(false);
    }

    if (formFields.start_date === '' || !moment(formFields.start_date, settings.date_format).isValid()) {
      canSave = false;
      setErrorStartDate(true);
    } else {
      setErrorStartDate(false);
    }

    if (!formFields.health_condition_group_id) {
      canSave = false;
      setErrorHealthConditionGroup(true);
    } else {
      setErrorHealthConditionGroup(false);
    }

    if (!formFields.health_condition_id) {
      canSave = false;
      setErrorHealthCondition(true);
    } else {
      setErrorHealthCondition(false);
    }

    if (canSave) {
      formFields.end_date = getLastActivityDate(formFields.start_date, activities);

      dispatch(createTreatmentPlan({
        ...formFields,
        total_of_weeks: weeks,
        type: 'normal',
        goals,
        activities,
        therapist_id: profile.id
      }))
        .then(result => {
          if (result) {
            handleClose();
          }
        });
    }
  };

  const handleSingleSelectChange = (key, value) => {
    if (key === 'health_condition_group_id') {
      setFormFields({ ...formFields, [key]: value, health_condition_id: '' });
    } else {
      setFormFields({ ...formFields, [key]: value });
    }
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
      handleConfirm();
    }
  };

  return (
    <Dialog
      show={show}
      title={translate('treatment_plan.preset.assign')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={translate('common.assign')}
      size="xl"
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Row>
          <Col md={12}>
            <Form.Group>
              <Form.Label>{translate('treatment_plan.choose_a_patient')}</Form.Label>
              <Form.Control
                as="select"
                name="patient_id"
                onChange={handleChange}
                value={formFields.patient_id}
              >
                <option>{translate('placeholder.patient')}</option>
                {users.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.last_name} {patient.first_name}
                  </option>
                ))}
              </Form.Control>
              {errorPatient && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {translate('error_message.treatment_plan_patient_required')}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>{translate('treatment_plan.health_condition_group')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Select
                placeholder={translate('placeholder.health_condition_group')}
                classNamePrefix="filter"
                className={errorHealthConditionGroup ? 'is-invalid' : ''}
                value={healthConditionGroups.filter(option => option.id === parseInt(formFields.health_condition_group_id))}
                getOptionLabel={option => `${option.title}`}
                options={[
                  { id: '', title: translate('placeholder.health_condition_group') },
                  ...healthConditionGroups
                ]}
                onChange={(e) => handleSingleSelectChange('health_condition_group_id', e.id)}
                styles={customSelectStyles}
                aria-label={translate('treatment_plan.health_condition_group')}
              />
              <Form.Control.Feedback type="invalid">
                {translate('error.treatment_plan.health_condition_group')}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>{translate('treatment_plan.health_condition')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Select
                isDisabled={!formFields.health_condition_group_id}
                placeholder={translate('placeholder.health_condition')}
                classNamePrefix="filter"
                className={errorHealthCondition ? 'is-invalid' : ''}
                value={healthConditions.filter(option => option.id === parseInt(formFields.health_condition_id))}
                getOptionLabel={option => `${option.title}`}
                options={[
                  { id: '', title: translate('placeholder.health_condition') },
                  ...healthConditions
                ]}
                onChange={(e) => handleSingleSelectChange('health_condition_id', e.id)}
                styles={customSelectStyles}
                aria-label={translate('treatment_plan.health_condition')}
              />
              <Form.Control.Feedback type="invalid">
                {translate('error.treatment_plan.health_condition')}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col lg={12}>
            <Form.Group>
              <Form.Label>{translate('treatment_plan.name')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Form.Control
                type="text"
                name="name"
                maxLength={255}
                value={formFields.name}
                placeholder={translate('placeholder.treatment_plan.name')}
                onChange={handleChange}
                isInvalid={errorName}
              />
              <Form.Control.Feedback type="invalid">
                {translate('error.treatment_plan.name')}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col lg={12}>
            <Form.Group>
              <Form.Label>{translate('treatment_plan.description')}</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                maxLength={255}
                rows={3}
                value={formFields.description}
                placeholder={translate('placeholder.description')}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col lg={12} className="text-center">
            <TreatmentGoal goals={goals} setGoals={setGoals} />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col lg={4}>
            <Form.Group>
              <Form.Label>{translate('common.start_date')}</Form.Label>
              <Datetime
                inputProps={{
                  name: 'start_date',
                  autoComplete: 'off',
                  className: errorStartDate ? 'form-control is-invalid' : 'form-control',
                  placeholder: translate('placeholder.start_date')
                }}
                dateFormat={settings.date_format}
                timeFormat={false}
                closeOnSelect={true}
                value={formFields.start_date}
                onChange={(value) => setStartDate(value)}
                isValidDate={ validateDate }
              />
              {errorStartDate && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {translate('error.start_date')}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Form.Row>
      </Form>
    </Dialog>
  );
};

AssignPatient.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  weeks: PropTypes.number,
  activities: PropTypes.array
};

export default AssignPatient;
