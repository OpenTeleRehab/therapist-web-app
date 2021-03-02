import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import settings from 'settings';
import Dialog from 'components/Dialog';

const CreateTreatmentGoal = ({ show, editIndex, goals, setGoals, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [formFields, setFormFields] = useState({
    title: '',
    frequency: ''
  });
  const [errorFrequency, setErrorFrequency] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);

  useEffect(() => {
    if (editIndex !== undefined) {
      const goal = goals[editIndex];
      setFormFields({ ...goal });
    }
  }, [editIndex, goals]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.title === '') {
      canSave = false;
      setErrorTitle(true);
    } else {
      setErrorTitle(false);
    }

    if (formFields.frequency === '') {
      canSave = false;
      setErrorFrequency(true);
    } else {
      setErrorFrequency(false);
    }

    if (canSave) {
      if (editIndex !== undefined) {
        goals[editIndex] = formFields;
        setGoals(goals);
      } else {
        setGoals([...goals, formFields]);
      }

      handleClose();
    }
  };

  return (
    <Dialog
      show={show}
      title={translate(editIndex !== undefined ? 'treatment_plan.goal.edit' : 'treatment_plan.goal.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editIndex !== undefined ? translate('common.save') : translate('common.add')}
    >
      <Form>
        <Form.Group controlId="formFrequency">
          <Form.Label>{translate('treatment_plan.goal.frequency')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Form.Control
            name="frequency"
            onChange={handleChange}
            value={formFields.frequency}
            placeholder={translate('treatment_plan.goal.frequency.placeholder')}
            isInvalid={errorFrequency}
            as="select"
          >
            <option value="">{translate('treatment_plan.goal.frequency.placeholder')}</option>
            <option value="weekly">{translate('treatment_plan.goal.frequency.option.weekly')}</option>
            <option value="daily">{translate('treatment_plan.goal.frequency.option.daily')}</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {translate('treatment_plan.goal.frequency.error')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formTitle">
          <Form.Label>{translate('treatment_plan.goal.title')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Form.Control
            name="title"
            onChange={handleChange}
            value={formFields.title}
            placeholder={translate('treatment_plan.goal.title.placeholder')}
            isInvalid={errorTitle}
            maxLength={settings.textMaxLength}
          />
          <Form.Control.Feedback type="invalid">
            {translate('treatment_plan.goal.title.error')}
          </Form.Control.Feedback>
        </Form.Group>
      </Form>
    </Dialog>
  );
};

CreateTreatmentGoal.propTypes = {
  show: PropTypes.bool,
  editIndex: PropTypes.number,
  readOnly: PropTypes.bool,
  goals: PropTypes.array,
  setGoals: PropTypes.func,
  handleClose: PropTypes.func
};

export default CreateTreatmentGoal;
