import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, Form, Button } from 'react-bootstrap';
import Datetime from 'components/DateTime';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';
import settings from 'settings';
import {
  createTreatmentPlan, updateTreatmentPlan,
  getTreatmentPlans
} from 'store/treatmentPlan/actions';
import moment from 'moment';

import CollapseToggle from './_Partials/collapseToggle';
import ActivitySection from './_Partials/activitySection';
import PatientInfo from 'views/Patient/Partials/patientInfo';
import TreatmentGoal from './_Partials/Goal';
import { getUsers } from '../../store/user/actions';
import Dialog from '../../components/Dialog';
import _ from 'lodash';
import * as ROUTES from '../../variables/routes';
import { getLastActivityDate } from '../../utils/treatmentPlan';

const CreateTreatmentPlan = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { id, patientId } = useParams();
  const { state } = useLocation();

  const { treatmentPlans } = useSelector(state => state.treatmentPlan);
  const { users } = useSelector(state => state.user);
  const { profile } = useSelector(state => state.auth);
  const validateDate = (current) => {
    const yesterday = moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  };
  const activity = state ? state.activity : '';
  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    patient_id: patientId,
    start_date: '',
    end_date: ''
  });
  const [weeks, setWeeks] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [editingTreatmentPlan, setEditingTreatmentPlan] = useState([]);

  const [errorName, setErrorName] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorPatient, setErrorPatient] = useState(false);
  const [goals, setGoals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [readOnly] = useState(false);
  const [show, setShow] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [errorPresetName, setErrorPresetName] = useState(false);
  const [isOwnCreated, setIsOwnCreated] = useState(false);
  const [originData, setOriginData] = useState([]);
  const [originGoals, setOriginGoals] = useState([]);
  const [treatmentPlanId, setTreatmentPlanId] = useState();

  useEffect(() => {
    if (activity) {
      setActivities([activity]);
    }
  }, [activity]);

  useEffect(() => {
    if (id) {
      const additionalParams = patientId ? {} : { type: 'preset' };
      dispatch(getTreatmentPlans({ id, ...additionalParams }));
    }
  }, [id, patientId, dispatch]);

  useEffect(() => {
    if (!patientId && profile) {
      dispatch(getUsers({ therapist_id: profile.id, page_size: 999 }));
    }
  }, [patientId, profile, dispatch]);

  useEffect(() => {
    if (!isPast()) {
      const yesterday = moment().subtract(1, 'day');
      if (moment(startDate, settings.date_format, true).isValid() && startDate.isAfter(yesterday)) {
        const date = moment(startDate).format(settings.date_format);
        setFormFields({ ...formFields, start_date: date });
      } else {
        setFormFields({ ...formFields, start_date: '' });
      }
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
    if (id && treatmentPlans.length) {
      const editingData = treatmentPlans.find(treatmentPlan => treatmentPlan.id === parseInt(id));
      setFormFields({
        name: editingData.name,
        description: editingData.description,
        patient_id: editingData.patient_id,
        start_date: moment(editingData.start_date, settings.date_format).format(settings.date_format),
        end_date: moment(editingData.end_date, settings.date_format).format(settings.date_format)
      });
      setEditingTreatmentPlan(editingData);
      setStartDate(moment(editingData.start_date, settings.date_format));
      setGoals(editingData.goals || []);
      setActivities(editingData.activities || []);
      setWeeks(editingData.total_of_weeks);
      setIsOwnCreated(editingData.created_by === profile.id);
      setOriginData(_.cloneDeep(editingData.activities) || []);
      setOriginGoals(_.cloneDeep(editingData.goals || []));
      setTreatmentPlanId(editingData.id);
    } else {
      resetData();
      setIsOwnCreated(true);
    }
    // eslint-disable-next-line
  }, [id, treatmentPlans, profile]);

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

  const handleSaveAsPreset = () => {
    let canSave = true;
    setErrorPatient(false);
    setErrorStartDate(false);

    if (presetName === '') {
      canSave = false;
      setErrorPresetName(true);
    } else {
      setErrorPresetName(false);
    }

    if (canSave) {
      if (id) {
        dispatch(updateTreatmentPlan(id, {
          name: presetName,
          goals,
          activities,
          total_of_weeks: weeks,
          type: 'preset'
        }))
          .then(result => {
            if (result && !patientId) {
              history.goBack();
            }
          });
      } else {
        dispatch(createTreatmentPlan({
          name: presetName,
          goals,
          activities,
          total_of_weeks: weeks,
          type: 'preset'
        })).then(result => {
          if (result && !patientId) {
            history.goBack();
          }
        });
      }
      setShow(false);
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
      formFields.end_date = getLastActivityDate(formFields.start_date, activities);

      if (id && patientId) {
        dispatch(updateTreatmentPlan(id, {
          ...formFields,
          total_of_weeks: weeks,
          type: 'normal',
          goals,
          activities,
          therapist_id: profile.id
        }))
          .then(result => {
            if (result) {
              history.push(ROUTES.VIEW_TREATMENT_PLAN_DETAIL.replace(':patientId', patientId).replace(':id', id));
            }
          });
      } else {
        dispatch(createTreatmentPlan({
          ...formFields,
          total_of_weeks: weeks,
          type: 'normal',
          goals,
          activities,
          therapist_id: profile.id
        }))
          .then(result => {
            if (result && !patientId) {
              history.goBack();
            } else if (result && (patientId || activity)) {
              history.push(ROUTES.VIEW_PATIENT_DETAIL.replace(':patientId', patientId));
            }
          });
      }
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  const isPast = () => {
    return moment().diff(moment(editingTreatmentPlan.start_date, settings.date_format), 'days', true) >= 0;
  };

  const handleShowPresetDialog = () => {
    setShow(true);
  };

  const handleClosePresetDialog = () => {
    setShow(false);
  };

  return (
    <>
      {patientId && (
        <div className="top-content mb-4">
          <PatientInfo id={patientId} translate={translate} />
        </div>
      )}
      <div className="d-flex mb-4">
        <h4>{translate(`${patientId || activity ? 'treatment_plan.treatment_planning' : 'treatment_plan.preset'}`)}</h4>
        <Button
          className="ml-auto"
          variant="outline-primary"
          onClick={handleCancel}
        >
          {translate('common.cancel')}
        </Button>
        {(!id || !patientId) && (
          <Button
            className="ml-2"
            variant="primary"
            onClick={handleShowPresetDialog}
          >
            {translate(`${patientId || activity ? 'treatment_plan.save_as_preset' : 'common.save'}`)}
          </Button>
        )}
        <Button
          className="ml-2"
          variant="primary"
          onClick={handleAssign}
        >
          {translate(id && patientId ? 'common.save' : 'common.assign')}
        </Button>
      </div>
      <Accordion defaultActiveKey="0">
        <Accordion.Collapse eventKey="0">
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>{translate('treatment_plan.patient')}</Form.Label>
                <span className="text-dark ml-1">*</span>
                <Form.Control
                  as="select"
                  name="patient_id"
                  onChange={handleChange}
                  value={formFields.patient_id}
                  disabled={patientId}
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
            <Col md={4}>
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
                  disabled={!isOwnCreated}
                />
                <Form.Control.Feedback type="invalid">
                  {translate('error.treatment_plan.name')}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>{translate('treatment_plan.international_classification')}</Form.Label>
                <Form.Control
                  as="select"
                  name="patient_id"
                  onChange={handleChange}
                  value={formFields.international_classification}
                >
                  <option></option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Accordion.Collapse>
        <CollapseToggle eventKey="0" />
      </Accordion>
      <Accordion defaultActiveKey="1">
        <Accordion.Collapse eventKey="1">
          <Row>
            <Col md={6}>
              <TreatmentGoal goals={goals} setGoals={setGoals} readOnly={readOnly} isOwnCreated={isOwnCreated} originGoals={originGoals} />
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{translate('treatment_plan.description')}</Form.Label>
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
                  disabled={!isOwnCreated}
                />
                <Form.Control.Feedback type="invalid">
                  {translate('error.description')}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Accordion.Collapse>
        <CollapseToggle eventKey="1" />
      </Accordion>
      <div className="treatment-plan-date">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>{translate('common.start_date')}</Form.Label>
              <Datetime
                inputProps={{
                  name: 'start_date',
                  autoComplete: 'off',
                  className: errorStartDate ? 'form-control is-invalid' : 'form-control',
                  placeholder: translate('placeholder.start_date'),
                  disabled: (id && isPast()) || !isOwnCreated
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
        </Row>
      </div>
      <ActivitySection isOwnCreated={isOwnCreated} weeks={weeks} setWeeks={setWeeks} startDate={formFields.start_date} activities={activities} setActivities={setActivities} readOnly={readOnly} originData={originData} treatmentPlanId={treatmentPlanId} />
      {show &&
        <Dialog
          show={show}
          title={translate('treatment_plan.save_as_preset_title')}
          onCancel={handleClosePresetDialog}
          onConfirm={handleSaveAsPreset}
          confirmLabel={translate('common.save')}
        >
          <Form onSubmit={handleSaveAsPreset}>
            <Form.Row>
              <Col>
                <Form.Group>
                  <Form.Label>{translate('treatment_plan.preset.name')}</Form.Label>
                  <span className="text-dark ml-1">*</span>
                  <Form.Control
                    type="text"
                    name="preset_name"
                    maxLength={255}
                    value={presetName}
                    placeholder={translate('placeholder.treatment_plan.name')}
                    onChange={(e) => setPresetName(e.target.value)}
                    isInvalid={errorPresetName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {translate('error.treatment_plan.name')}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Form.Row>
          </Form>
        </Dialog>
      }
    </>
  );
};

export default CreateTreatmentPlan;
