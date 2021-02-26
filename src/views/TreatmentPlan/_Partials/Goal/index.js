import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Form
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { BsPlusCircle } from 'react-icons/all';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import CreateTreatmentGoal from './create';
import { DeleteAction, EditAction } from 'components/ActionIcons';
import Dialog from 'components/Dialog';

const TreatmentGoal = ({ goals, setGoals, readOnly }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(undefined);
  const [deleteIndex, setDeleteIndex] = useState(undefined);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleAddGoal = () => {
    setShow(true);
  };

  const handleEditGoal = (index) => {
    setEditIndex(index);
    setShow(true);
  };

  const handleClose = () => {
    setEditIndex(undefined);
    setShow(false);
  };

  const handleDeleteGoal = (index) => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteIndex(undefined);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    goals.splice(deleteIndex, 1);
    setGoals([...goals]);
    handleDeleteDialogClose();
  };

  return (
    <>
      <h6 className="mb-4">
        {translate('treatment_plan.treatment_goal_for_patient')}
        <small className="ml-1">
          {translate('treatment_plan.treatment_goal_for_patient_max_number')}
        </small>
      </h6>

      {goals.length > 0 ? (
        <>
          {goals.map((goal, i) => {
            return (
              <Card body key={i} className="mb-2">
                <Badge variant="info" className="mr-1">
                  {translate(`treatment_plan.goal.frequency.option.${goal.frequency}`)}
                </Badge>
                {goal.title}
                <div className="float-right">
                  <EditAction className="ml-1" onClick={() => handleEditGoal(i)} />
                  <DeleteAction className="ml-1" onClick={() => handleDeleteGoal(i)} />
                </div>
              </Card>
            );
          })}
        </>
      ) : (
        <span>{translate('treatment_plan.goal.no_goals')}</span>
      )}

      {!readOnly && goals.length < 4 && (
        <Form.Group className="my-4">
          <Button
            variant="link"
            onClick={handleAddGoal}
            className="p-0"
          >
            <BsPlusCircle size={20} /> {translate('treatment_plan.goal.add')}
          </Button>
        </Form.Group>
      )}

      {show && <CreateTreatmentGoal
        show={show}
        editIndex={editIndex}
        goals={goals}
        setGoals={setGoals}
        handleClose={handleClose} />
      }

      <Dialog
        show={showDeleteDialog}
        title={translate('user.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>
    </>
  );
};

TreatmentGoal.propTypes = {
  goals: PropTypes.array,
  setGoals: PropTypes.func,
  readOnly: PropTypes.bool
};

export default TreatmentGoal;
