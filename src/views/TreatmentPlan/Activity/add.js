import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';

import Exercise from './Exercise';

const AddActivity = ({ show, handleClose, editId, day, week, setActivities, selectedExercises, setSelectedExercises, setDayExercises, dayExercises }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [exercises, setExercises] = useState([]);

  const handleConfirm = () => {
    for (let i = 0; i < selectedExercises.length; i++) {
      exercises.push(selectedExercises[i].id);
      dayExercises.push(selectedExercises[i]);
    }
    setExercises([...exercises]);
    setActivities([{ week: week, day: day, exercises: exercises }]);
    setDayExercises([...dayExercises]);
    handleClose();
  };

  return (
    <Dialog
      show={show}
      title={translate('activity.select_activities_to_add')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={translate('common.save')}
      size="xl"
    >
      <Tabs transition={false} className="mb-3">
        <Tab eventKey="exercise" title={translate('activity.exercises')}>
          <Exercise selectedExercises={selectedExercises} setSelectedExercises={setSelectedExercises} />
        </Tab>
        <Tab eventKey="education" title={translate('activity.education_materials')}>
          {translate('activity.education_materials')}
        </Tab>
        <Tab eventKey="questionnaire" title={translate('activity.questionnaires')}>
          {translate('activity.questionnaires')}
        </Tab>
      </Tabs>
    </Dialog>
  );
};

AddActivity.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  editId: PropTypes.string,
  day: PropTypes.number,
  week: PropTypes.number,
  setActivities: PropTypes.func,
  selectedExercises: PropTypes.array,
  setSelectedExercises: PropTypes.func,
  dayExercises: PropTypes.array,
  setDayExercises: PropTypes.func
};

export default AddActivity;
