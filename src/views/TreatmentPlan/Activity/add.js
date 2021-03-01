import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';

import Exercise from './Exercise';
import EducationMaterial from './EducationMaterial';
import Questionnaire from './Questionnaire';
import PreviewList from './previewList';
import _ from 'lodash';

const AddActivity = ({ show, handleClose, week, day, activities, setActivities }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedQuestionnaires, setSelectedQuestionnaires] = useState([]);
  const [viewQuestionnaire, setViewQuestionnaire] = useState(false);
  const [viewExercise, setViewExercise] = useState(false);

  useEffect(() => {
    const dayActivity = _.findLast(activities, { week, day });
    const exerciseIds = dayActivity ? dayActivity.exercises || [] : [];
    const materialIds = dayActivity ? dayActivity.materials || [] : [];
    const questionnaireIds = dayActivity ? dayActivity.questionnaires || [] : [];
    setSelectedExercises(exerciseIds);
    setSelectedMaterials(materialIds);
    setSelectedQuestionnaires(questionnaireIds);
  }, [week, day, activities]);

  const handleExercisesChange = (checked, id) => {
    setViewExercise(false);
    if (checked) {
      selectedExercises.push(id);
    } else {
      _.remove(selectedExercises, n => n === id);
    }
    setSelectedExercises([...selectedExercises]);
  };

  const handleMaterialsChange = (checked, id) => {
    if (checked) {
      selectedMaterials.push(id);
    } else {
      _.remove(selectedMaterials, n => n === id);
    }
    setSelectedMaterials([...selectedMaterials]);
  };

  const handleQuestionnairesChange = (checked, id) => {
    setViewQuestionnaire(false);
    if (checked) {
      selectedQuestionnaires.push(id);
    } else {
      _.remove(selectedQuestionnaires, n => n === id);
    }
    setSelectedQuestionnaires([...selectedQuestionnaires]);
  };

  const handleConfirm = () => {
    const newActivity = {
      week,
      day,
      exercises: selectedExercises,
      materials: selectedMaterials,
      questionnaires: selectedQuestionnaires
    };
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
          <Exercise selectedExercises={selectedExercises} onSectionChange={handleExercisesChange} viewExercise={viewExercise} setViewExercise={setViewExercise} />
        </Tab>
        <Tab eventKey="education" title={translate('activity.education_materials')}>
          <EducationMaterial selectedMaterials={selectedMaterials} onSectionChange={handleMaterialsChange} />
        </Tab>
        <Tab eventKey="questionnaire" title={translate('activity.questionnaires')}>
          <Questionnaire selectedMaterials={selectedQuestionnaires} onSectionChange={handleQuestionnairesChange} viewQuestionnaire={viewQuestionnaire} setViewQuestionnaire={setViewQuestionnaire} />
        </Tab>
      </Tabs>
      <PreviewList
        selectedExercises={selectedExercises}
        selectedMaterials={selectedMaterials}
        selectedQuestionnaires={selectedQuestionnaires}
        onExerciseRemove={id => handleExercisesChange(false, id)}
        onMaterialRemove={id => handleMaterialsChange(false, id)}
        onQuestionnaireRemove={id => handleQuestionnairesChange(false, id)}
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
