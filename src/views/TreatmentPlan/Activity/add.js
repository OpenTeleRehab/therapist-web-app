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
import PresetTreatment from './PresetTreatment';
import _ from 'lodash';

const AddActivity = ({ show, handleClose, week, day, activities, setActivities, isPreset, isOwnCreated, originData }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { presetTreatmentPlans } = useSelector(state => state.treatmentPlan);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedQuestionnaires, setSelectedQuestionnaires] = useState([]);
  const [viewQuestionnaire, setViewQuestionnaire] = useState(false);
  const [viewExercise, setViewExercise] = useState(false);
  const [viewEducationMaterial, setViewEducationMaterial] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [presetId, setPresetId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewPreset, setViewPreset] = useState(false);
  const [totalSelectedActivity, setTotalSelectedActivity] = useState(0);
  const [oldSelectedExercises, setOldSelectedExercises] = useState([]);
  const [oldSelectedMaterials, setOldSelectedMaterials] = useState([]);
  const [oldSelectedQuestionnaires, setOldSelectedQuestionnaires] = useState([]);

  useEffect(() => {
    const dayActivity = _.findLast(activities, { week, day });
    const exerciseIds = dayActivity ? dayActivity.exercises || [] : [];
    const materialIds = dayActivity ? dayActivity.materials || [] : [];
    const questionnaireIds = dayActivity ? dayActivity.questionnaires || [] : [];
    setSelectedExercises(exerciseIds);
    setSelectedMaterials(materialIds);
    setSelectedQuestionnaires(questionnaireIds);
  }, [week, day, activities]);

  useEffect(() => {
    const originDayActivity = _.findLast(originData, { week, day });
    setOldSelectedExercises(originDayActivity ? originDayActivity.exercises : []);
    setOldSelectedMaterials(originDayActivity ? originDayActivity.materials : []);
    setOldSelectedQuestionnaires(originDayActivity ? originDayActivity.questionnaires : []);
  }, [week, day, originData]);

  const handleExercisesChange = (checked, id) => {
    setViewExercise(false);
    if (checked) {
      selectedExercises.push(id);
      setTotalSelectedActivity(totalSelectedActivity + 1);
    } else {
      _.remove(selectedExercises, n => n === id);
      setTotalSelectedActivity(totalSelectedActivity - 1);
    }
    setSelectedExercises([...selectedExercises]);
  };

  const handleMaterialsChange = (checked, id) => {
    setViewEducationMaterial(false);
    if (checked) {
      selectedMaterials.push(id);
      setTotalSelectedActivity(totalSelectedActivity + 1);
    } else {
      _.remove(selectedMaterials, n => n === id);
      setTotalSelectedActivity(totalSelectedActivity - 1);
    }
    setSelectedMaterials([...selectedMaterials]);
  };

  const handleQuestionnairesChange = (checked, id) => {
    setViewQuestionnaire(false);
    if (checked) {
      selectedQuestionnaires.push(id);
      setTotalSelectedActivity(totalSelectedActivity + 1);
    } else {
      _.remove(selectedQuestionnaires, n => n === id);
      setTotalSelectedActivity(totalSelectedActivity - 1);
    }
    setSelectedQuestionnaires([...selectedQuestionnaires]);
  };

  const handleConfirm = () => {
    if (presetId) {
      const presetTreatment = presetTreatmentPlans.find(p => p.id === presetId);
      const newActivities = [];
      for (let i = 1; i <= presetTreatment.total_of_weeks; i++) {
        for (let j = 1; j <= 7; j++) {
          const presetDayActivity = presetTreatment.activities.find(d => d.day === j && d.week === i);
          const dayActivity = activities.find(d => d.day === j && d.week === i);
          let exercises = null;
          let materials = null;
          let questionnaires = null;
          if (presetDayActivity) {
            if (dayActivity) {
              exercises = _.union(dayActivity.exercises, presetDayActivity.exercises);
              materials = _.union(dayActivity.materials, presetDayActivity.materials);
              questionnaires = _.union(dayActivity.questionnaires, presetDayActivity.questionnaires);
            } else {
              exercises = presetDayActivity.exercises;
              materials = presetDayActivity.materials;
              questionnaires = presetDayActivity.questionnaires;
            }
            newActivities.push({
              week: i,
              day: j,
              exercises: exercises,
              materials: materials,
              questionnaires: questionnaires
            });
          }
        }
      }
      const updatedActivities = _.unionWith([...newActivities], activities, (a, n) => {
        return a.week === n.week && a.day === n.day;
      });
      setActivities(updatedActivities);
    } else {
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
    }
    handleClose();
  };

  const handlePresetChange = (checked, id) => {
    setViewPreset(false);
    if (checked) {
      setPresetId(id);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPresetId(null);
  };

  return (
    <Dialog
      show={show}
      title={translate('activity.select_activities_to_add')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={translate('activity.add_to_day')}
      size="xl"
      scrollable={true}
    >
      <Tabs transition={false} className="mb-3">
        <Tab eventKey="exercise" title={translate('activity.exercises')}>
          <Exercise selectedExercises={selectedExercises} onSectionChange={handleExercisesChange} viewExercise={viewExercise} setViewExercise={setViewExercise} setShowPreview={setShowPreview} isOwnCreated={isOwnCreated} oldSelectedExercises={oldSelectedExercises} showPreview={showPreview}/>
        </Tab>
        <Tab eventKey="education" title={translate('activity.education_materials')}>
          <EducationMaterial selectedMaterials={selectedMaterials} onSectionChange={handleMaterialsChange} viewEducationMaterial={viewEducationMaterial} setViewEducationMaterial={setViewEducationMaterial} setShowPreview={setShowPreview} isOwnCreated={isOwnCreated} oldSelectedMaterials={oldSelectedMaterials} showPreview={showPreview} />
        </Tab>
        <Tab eventKey="questionnaire" title={translate('activity.questionnaires')}>
          <Questionnaire selectedQuestionnaires={selectedQuestionnaires} onSectionChange={handleQuestionnairesChange} viewQuestionnaire={viewQuestionnaire} setViewQuestionnaire={setViewQuestionnaire} setShowPreview={setShowPreview} isOwnCreated={isOwnCreated} oldSelectedQuestionnaires={oldSelectedQuestionnaires} showPreview={showPreview} />
        </Tab>
        {!isPreset && isOwnCreated &&
          <Tab eventKey="preset_treatment" title={translate('activity.preset_treatment')}>
            <PresetTreatment presetId={presetId} onSectionChange={handlePresetChange} setViewPreset={setViewPreset} viewPreset={viewPreset}/>
          </Tab>
        }
      </Tabs>
      <PreviewList
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        selectedExercises={selectedExercises}
        selectedMaterials={selectedMaterials}
        selectedQuestionnaires={selectedQuestionnaires}
        onExerciseRemove={id => handleExercisesChange(false, id)}
        onMaterialRemove={id => handleMaterialsChange(false, id)}
        onQuestionnaireRemove={id => handleQuestionnairesChange(false, id)}
        isOwnCreated={isOwnCreated}
        originData={originData}
        day={day}
        week={week}
      />
      <Dialog
        show={openDialog}
        title={translate('treatment_plan.add_preset_to_treatment_plan')}
        cancelLabel={translate('common.no')}
        onCancel={handleCloseDialog}
        confirmLabel={translate('common.yes')}
        onConfirm={handleConfirm}
      >
        <p>{ totalSelectedActivity ? translate('common.add_preset_to_treatment_plan_message_with_selected_activity', { number: totalSelectedActivity }) : translate('common.add_preset_to_treatment_plan_message_without_selected_activity')}</p>
      </Dialog>
    </Dialog>
  );
};

AddActivity.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  week: PropTypes.number,
  day: PropTypes.number,
  activities: PropTypes.array,
  setActivities: PropTypes.func,
  isPreset: PropTypes.bool,
  isOwnCreated: PropTypes.bool,
  originData: PropTypes.array
};

export default AddActivity;
