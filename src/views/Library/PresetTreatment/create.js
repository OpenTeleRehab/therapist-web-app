import React, { useState, useEffect } from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';
import {
  createTreatmentPlan, updateTreatmentPlan,
  getTreatmentPlansDetail, getPresetTreatmentPlans,
  resetTreatmentPlanDetailActivities
} from 'store/treatmentPlan/actions';

import ActivitySection from 'views/TreatmentPlan/_Partials/activitySection';
import AssignPatient from './assignPatient';
import customColorScheme from '../../../utils/customColorScheme';
import _ from 'lodash';

const CreatePresetTreatment = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const translate = getTranslate(localize);
  const { id } = useParams();

  const { profile } = useSelector((state) => state.auth);
  const { presetTreatmentPlans, treatmentPlansDetail } = useSelector((state) => state.treatmentPlan);
  const [formFields, setFormFields] = useState({ name: '' });
  const [weeks, setWeeks] = useState(1);
  const [errorName, setErrorName] = useState(false);
  const [activities, setActivities] = useState([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  useEffect(() => {
    if (id && presetTreatmentPlans.length === 0) {
      dispatch(getPresetTreatmentPlans({ id, type: 'preset' }));
    }
  }, [id, presetTreatmentPlans, dispatch]);

  useEffect(() => {
    if (id) {
      const additionalParams = { type: 'preset' };
      dispatch(getTreatmentPlansDetail({ id, lang: profile.language_id, ...additionalParams, therapist_id: profile.id }));
    }
  }, [id, dispatch, profile]);

  useEffect(() => {
    if (!id && treatmentPlansDetail.activities.length > 0) {
      dispatch(resetTreatmentPlanDetailActivities());
    }
  }, [id, dispatch, treatmentPlansDetail]);

  useEffect(() => {
    if (id && presetTreatmentPlans.length) {
      const editingData = presetTreatmentPlans.find(treatmentPlan => treatmentPlan.id === parseInt(id));
      setFormFields({ name: editingData.name });
      setActivities(editingData.activities || []);
      setWeeks(editingData.total_of_weeks);
    } else {
      setErrorName(false);
      setFormFields({ name: '' });
    }
    // eslint-disable-next-line
  }, [id, presetTreatmentPlans]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSaveAsPreset = () => {
    let canSave = true;

    if (formFields.name === '') {
      canSave = false;
      setErrorName(true);
    } else {
      setErrorName(false);
    }

    if (canSave) {
      if (id) {
        dispatch(updateTreatmentPlan(id, {
          ...formFields,
          activities,
          total_of_weeks: weeks,
          type: 'preset'
        }))
          .then(result => {
            if (result) {
              history.goBack();
            }
          });
      } else {
        dispatch(createTreatmentPlan({
          ...formFields,
          activities,
          total_of_weeks: weeks,
          type: 'preset'
        })).then(result => {
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

  const handleAssign = () => {
    setShowAssignDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setShowAssignDialog(false);
  };

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveAsPreset();
    }
  };

  return (
    <>
      <div className="d-flex mb-4">
        <h4>{translate('treatment_plan.preset')}</h4>
        <Button
          className="ml-auto"
          variant="outline-primary"
          onClick={handleCancel}
        >
          {translate('common.cancel')}
        </Button>
        <Button
          className="ml-2"
          variant="outline-primary"
          onClick={handleAssign}
        >
          {translate('common.assign')}
        </Button>
        <Button
          className="ml-2"
          variant="primary"
          onClick={handleSaveAsPreset}
        >
          {translate('common.save')}
        </Button>
      </div>

      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Row>
          <Col md={6}>
            <Form.Group controlId="formName">
              <Form.Label>{translate('treatment_plan.preset.name')}</Form.Label>
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
      </Form>
      <hr/>

      <ActivitySection
        isPreset
        isOwnCreated
        weeks={weeks}
        setWeeks={setWeeks}
        activities={activities}
        setActivities={setActivities}
        treatmentPlanId={id}
      />

      { showAssignDialog && (
        <AssignPatient
          handleClose={handleCloseAssignDialog}
          show={showAssignDialog}
          weeks={weeks}
          activities={activities}
        />
      )}
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default CreatePresetTreatment;
