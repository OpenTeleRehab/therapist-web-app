import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Form,
  ListGroup
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { BsPlusCircle } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import CreateTreatmentGoal from './create';
import { DeleteAction, EditAction } from 'components/ActionIcons';
import Dialog from 'components/Dialog';

const TreatmentGoal = ({ goals, setGoals, readOnly, isOwnCreated, originGoals }) => {
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

      {goals.length > 0 && (
        <Card className="mb-2">
          <ListGroup variant="flush">
            {goals.map((goal, i) => {
              return (
                <ListGroup.Item key={i} >
                  <Badge variant="info" className="mr-1">
                    {translate(`treatment_plan.goal.frequency.option.${goal.frequency}`)}
                  </Badge>
                  {goal.title}
                  <>
                    {!readOnly ? (
                      <div className="float-right">
                        <EditAction className="ml-1" onClick={() => handleEditGoal(i)} onKeyPress={(event) => event.key === 'Enter' && event.stopPropagation()} />
                        <DeleteAction className="ml-1" onClick={() => handleDeleteGoal(i)} onKeyPress={(event) => event.key === 'Enter' && event.stopPropagation()} />
                      </div>
                    ) : (
                      <>
                        {!originGoals.find(g => g.id === goal.id) && !readOnly &&
                          <div className="float-right">
                            <EditAction className="ml-1" onClick={() => handleEditGoal(i)} onKeyPress={(event) => event.key === 'Enter' && event.stopPropagation()} />
                            <DeleteAction className="ml-1" onClick={() => handleDeleteGoal(i)} onKeyPress={(event) => event.key === 'Enter' && event.stopPropagation()} />
                          </div>
                        }
                      </>
                    )
                    }
                  </>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card>
      )}

      {!readOnly && goals.length < 4 && (
        <Form.Group className="my-4">
          <Button
            variant="link"
            onClick={handleAddGoal}
            className="p-0"
            onKeyPress={(event) => event.key === 'Enter' && event.stopPropagation()}
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
        title={translate('treatment_plan.goal.delete_confirmation_title')}
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
  readOnly: PropTypes.bool,
  isOwnCreated: PropTypes.bool,
  originGoals: PropTypes.array
};

export default TreatmentGoal;
