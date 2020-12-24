import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';

import Exercise from './Exercise';
import PreviewExerciseList from './Exercise/previewList';
import _ from 'lodash';

const AddActivity = ({ show, handleClose, week, day, activities, setActivities }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    const dayActivity = _.findLast(activities, { week, day });
    const exerciseIds = dayActivity ? dayActivity.exercises : [];
    setSelectedExercises(exerciseIds);
  }, [week, day, activities]);

  const handleSelectionChange = (e, id) => {
    if (e.currentTarget.checked) {
      selectedExercises.push(id);
    } else {
      const index = selectedExercises.indexOf(id);
      if (index >= 0) {
        selectedExercises.splice(index, 1);
      }
    }
    setSelectedExercises([...selectedExercises]);
  };

  const handleConfirm = () => {
    const newActivity = { week, day, exercises: selectedExercises };
    const updatedActivities = _.unionWith(activities, [newActivity], (a, n) => {
      return a.week === n.week && a.day === n.day;
    });
    setActivities(updatedActivities);
    handleClose();
  };

  return (
    <Dialog
      show={show}
      title={translate('activity.select_activities_to_add')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={translate('activity.add_to_day')}
      size="xl"
    >
      <Tabs transition={false} className="mb-3">
        <Tab eventKey="exercise" title={translate('activity.exercises')}>
          <Exercise selectedExercises={selectedExercises} onSectionChange={handleSelectionChange} />
        </Tab>
        <Tab eventKey="education" title={translate('activity.education_materials')}>
          {translate('activity.education_materials')}
        </Tab>
        <Tab eventKey="questionnaire" title={translate('activity.questionnaires')}>
          {translate('activity.questionnaires')}
        </Tab>
      </Tabs>
      <PreviewExerciseList selectedExercises={selectedExercises} onSectionChange={handleSelectionChange} />
    </Dialog>
  );
};

AddActivity.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  week: PropTypes.number,
  day: PropTypes.number,
  activities: PropTypes.array,
  setActivities: PropTypes.func
};

export default AddActivity;
