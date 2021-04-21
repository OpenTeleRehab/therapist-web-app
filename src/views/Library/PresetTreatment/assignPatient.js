import React, { useEffect, useState } from 'react';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';
import settings from 'settings';
import Datetime from 'components/DateTime';
import TreatmentGoal from 'views/TreatmentPlan/_Partials/Goal';
import moment from 'moment';
import { createTreatmentPlan } from 'store/treatmentPlan/actions';
import { getUsers } from '../../../store/user/actions';

const AssignPatient = ({ show, handleClose, weeks, activities }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const { users } = useSelector(state => state.user);
  const { profile } = useSelector(state => state.auth);
  const [startDate, setStartDate] = useState('');
  const [errorName, setErrorName] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorPatient, setErrorPatient] = useState(false);
  const [goals, setGoals] = useState([]);
  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    patient_id: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const yesterday = moment().subtract(1, 'day');
    if (moment(startDate, settings.date_format, true).isValid() && startDate.isAfter(yesterday)) {
      const date = moment(startDate).format(settings.date_format);
      setFormFields({ ...formFields, start_date: date });
    } else {
      setFormFields({ ...formFields, start_date: '' });
    }
    // eslint-disable-next-line
  }, [startDate]);

  useEffect(() => {
    if (formFields.start_date) {
      setFormFields({ ...formFields, end_date: moment(formFields.start_date, settings.date_format).add(weeks, 'weeks').subtract(1, 'days').format(settings.date_format) });
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

    if (formFields.name === '') {
      canSave = false;
      setErrorName(true);
    } else {
      setErrorName(false);
    }

    if (formFields.description === '') {
      canSave = false;
      setErrorDescription(true);
    } else {
      setErrorDescription(false);
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

    if (canSave) {
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

  return (
    <Dialog
      show={show}
      title={translate('treatment_plan.preset.assign')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={translate('common.assign')}
      size="xl"
    >
      <Row>
        <Col md={3}>
          <h6 className="mb-4">{translate('treatment_plan.general_information')}</h6>
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
          <Form.Group>
            <Form.Label>{translate('common.description')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              as="textarea"
              name="description"
              maxLength={255}
              rows={3}
              value={formFields.description}
              placeholder={translate('placeholder.description')}
              onChange={handleChange}
              isInvalid={errorDescription}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.description')}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={3}>
          <h6 className="mb-4">{translate('treatment_plan.assign_to_patient')}</h6>
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
          <Form.Group>
            <Form.Label>{translate('common.end_date')} {formFields.end_date}</Form.Label>
          </Form.Group>
        </Col>
        <Col md={6}>
          <TreatmentGoal goals={goals} setGoals={setGoals} />
        </Col>
      </Row>
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
