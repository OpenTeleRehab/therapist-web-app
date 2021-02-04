import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';

import Exercise from './Exercise';
import EducationMaterial from './EducationMaterial';
import PreviewList from './previewList';
import _ from 'lodash';

const AddActivity = ({ show, handleClose, week, day, activities, setActivities }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  useEffect(() => {
    const dayActivity = _.findLast(activities, { week, day });
    const exerciseIds = dayActivity ? dayActivity.exercises || [] : [];
    const materialIds = dayActivity ? dayActivity.materials || [] : [];
    setSelectedExercises(exerciseIds);
    setSelectedMaterials(materialIds);
  }, [week, day, activities]);

  const handleExercisesChange = (e, id) => {
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

  const handleMaterialsChange = (e, id) => {
    if (e.currentTarget.checked) {
      selectedMaterials.push(id);
    } else {
      const index = selectedMaterials.indexOf(id);
      if (index >= 0) {
        selectedMaterials.splice(index, 1);
      }
    }
    setSelectedMaterials([...selectedMaterials]);
  };

  const handleConfirm = () => {
    const newActivity = { week, day, exercises: selectedExercises, materials: selectedMaterials };
    const updatedActivities = _.unionWith([newActivity], activities, (a, n) => {
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
          <Exercise selectedExercises={selectedExercises} onSectionChange={handleExercisesChange} />
        </Tab>
        <Tab eventKey="education" title={translate('activity.education_materials')}>
          <EducationMaterial selectedMaterials={selectedMaterials} onSectionChange={handleMaterialsChange} />
        </Tab>
        <Tab eventKey="questionnaire" title={translate('activity.questionnaires')}>
          {translate('activity.questionnaires')}
        </Tab>
      </Tabs>
      <PreviewList
        selectedExercises={selectedExercises}
        selectedMaterials={selectedMaterials}
        onExercisesChange={handleExercisesChange}
        onMaterialsChange={handleMaterialsChange}
      />
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
