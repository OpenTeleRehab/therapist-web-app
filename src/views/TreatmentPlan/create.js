import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, Form, Button } from 'react-bootstrap';
import Datetime from 'react-datetime';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';
import settings from 'settings';
import { createTreatmentPlan, updateTreatmentPlan } from 'store/treatmentPlan/actions';
import { getTreatmentPlans } from '../../store/treatmentPlan/actions';
import moment from 'moment';

import CollapseToggle from 'views/TreatmentPlan/collapseToggle';
import ActivitySection from './activitySection';
import PatientInfo from 'views/Patient/Partials/patientInfo';

const CreateTreatmentPlan = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id, patientId } = useParams();
  const localize = useSelector((state) => state.localize);
  const treatmentPlans = useSelector((state) => state.treatmentPlan.treatmentPlans);
  const translate = getTranslate(localize);
  const patients = [
    {
      id: 1,
      name: 'Patient 1'
    },
    {
      id: 2,
      name: 'Patient 2'
    },
    {
      id: 3,
      name: 'Patient 3'
    }
  ];

  const validateDate = (current) => {
    const yesterday = moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  };

  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    patient_id: patientId,
    start_date: '',
    end_date: ''
  });
  const [weeks, setWeeks] = useState(1);

  const [errorName, setErrorName] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getTreatmentPlans({ id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (formFields.start_date) {
      setFormFields({ ...formFields, end_date: moment(formFields.start_date, settings.date_format).add(weeks, 'weeks').subtract(1, 'days').format(settings.date_format) });
    } else {
      setFormFields({ ...formFields, end_date: '' });
    }
    // eslint-disable-next-line
  }, [formFields.start_date, weeks]);

  useEffect(() => {
    if (id && treatmentPlans.length) {
      const editingData = treatmentPlans.find(treatmentPlan => treatmentPlan.id === parseInt(id));
      setFormFields({
        name: editingData.name,
        description: editingData.description,
        patient_id: editingData.patient_id,
        start_date: moment(editingData.start_date, settings.date_format).format(settings.date_format),
        end_date: moment(editingData.end_date, settings.date_format).format(settings.date_format)
      });
      setActivities(editingData.activities || []);
    } else {
      resetData();
    }
    // eslint-disable-next-line
  }, [id, treatmentPlans]);

  const resetData = () => {
    setErrorName(false);
    setErrorDescription(false);
    setErrorStartDate(false);
    setFormFields({
      name: '',
      description: '',
      patient_id: patientId,
      start_date: '',
      end_date: ''
    });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleChangeDate = (value) => {
    if (moment(value, settings.date_format).isValid()) {
      const date = moment(value).format(settings.date_format);
      setFormFields({ ...formFields, start_date: date });
    } else {
      setFormFields({ ...formFields, start_date: '' });
    }
  };

  const handleSaveAsPreset = () => {
    let canSave = true;
    setErrorStartDate(false);

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

    if (canSave) {
      dispatch(createTreatmentPlan({ ...formFields, type: 'preset', activities }));
    }
  };

  const handleAssign = () => {
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

    if (formFields.start_date === '') {
      canSave = false;
      setErrorStartDate(true);
    } else {
      setErrorStartDate(false);
    }

    if (canSave) {
      if (id) {
        dispatch(updateTreatmentPlan(id, { ...formFields, type: 'normal', activities }))
          .then(result => {
            if (result) {
              history.goBack();
            }
          });
      } else {
        dispatch(createTreatmentPlan({ ...formFields, type: 'normal', activities }))
          .then(result => {
            if (result) {
              history.goBack();
            }
          });
      }
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <span>Patient / Patient Detail / Treatment Plan</span>
      </div>
      <PatientInfo id={patientId} translate={translate} />
      <div className="d-flex mb-4">
        <h4 className="mb-">{translate('treatment_plan.treatment_planning')}</h4>
        <Button
          className="ml-auto"
          variant="outline-primary"
          onClick={handleCancel}
        >
          {translate('common.cancel')}
        </Button>
        {!id && (
          <Button
            className="ml-2"
            variant="primary"
            onClick={handleSaveAsPreset}
          >
            {translate('treatment_plan.save_as_preset')}
          </Button>
        )}
        <Button
          className="ml-2"
          variant="primary"
          onClick={handleAssign}
        >
          {translate(id ? 'common.save' : 'common.assign')}
        </Button>
      </div>
      <Accordion defaultActiveKey="0">
        <Accordion.Collapse eventKey="0">
          <Row>
            <Col md={3}>
              <h6 className="mb-4">{translate('treatment_plan.general_information')}</h6>
              <Form.Group>
                <Form.Label>{translate('common.name')}</Form.Label>
                <span className="text-dark ml-1">*</span>
                <Form.Control
                  type="text"
                  name="name"
                  maxLength={255}
                  value={formFields.name}
                  placeholder={translate('placeholder.name')}
                  onChange={handleChange}
                  isInvalid={errorName}
                />
                <Form.Control.Feedback type="invalid">
                  {translate('error.name')}
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
                  disabled={true}
                >
                  <option>{translate('placeholder.patient')}</option>
                  {patients.length && patients.map((patient, index) => {
                    return (<option key={index} value={patient.id}>{ patient.name }</option>);
                  })
                  }
                </Form.Control>
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
                  onChange={(e) => handleChangeDate(e)}
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
              <h6 className="mb-4">
                {translate('treatment_plan.treatment_goal_for_patient')} <small>{translate('treatment_plan.treatment_goal_for_patient_max_number')}</small>
              </h6>
            </Col>
          </Row>
        </Accordion.Collapse>
        <CollapseToggle title={translate('treatment_plan.treatment_information')} eventKey="0" />
      </Accordion>
      <ActivitySection weeks={weeks} setWeeks={setWeeks} startDate={formFields.start_date} activities={activities} setActivities={setActivities} />
    </>
  );
};

export default CreateTreatmentPlan;
