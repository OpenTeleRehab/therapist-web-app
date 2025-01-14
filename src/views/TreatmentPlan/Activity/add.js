import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Exercise from './Exercise';
import EducationMaterial from './EducationMaterial';
import Questionnaire from './Questionnaire';
import PreviewList from './previewList';
import PresetTreatment from './PresetTreatment';
import {
  addExerciseDataPreview,
  addMaterialDataPreview, addPresetDataPreview,
  addQuestionnaireDataPreview
} from '../../../store/treatmentPlan/actions';
import { getQuestionnaires } from 'store/questionnaire/actions';

const AddActivity = ({ show, handleClose, week, day, activities, setActivities, isPreset, isOwnCreated, originData }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const { presetTreatmentPlans } = useSelector(state => state.treatmentPlan);
  const { questionnaires } = useSelector(state => state.questionnaire);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedQuestionnaires, setSelectedQuestionnaires] = useState([]);
  const [startQuestionnaires, setStartQuestionnaires] = useState([]);
  const [endQuestionnaires, setEndQuestionnaires] = useState([]);
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
    const exerciseIds = dayActivity ? [...dayActivity.exercises] || [] : [];
    const materialIds = dayActivity ? [...dayActivity.materials] || [] : [];
    const questionnaireIds = dayActivity ? [...dayActivity.questionnaires] || [] : [];
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

  useEffect(() => {
    dispatch(getQuestionnaires({
      page_size: 9999,
      therapist_id: profile ? profile.id : ''
    }));
  }, [dispatch]);

  const handleExercisesChange = (checked, id) => {
    setViewExercise(false);
    if (checked) {
      selectedExercises.push(id);
      setTotalSelectedActivity(totalSelectedActivity + 1);
      dispatch(addExerciseDataPreview(id));
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
      dispatch(addMaterialDataPreview(id));
    } else {
      _.remove(selectedMaterials, n => n === id);
      setTotalSelectedActivity(totalSelectedActivity - 1);
    }
    setSelectedMaterials([...selectedMaterials]);
  };

  const handleQuestionnairesChange = (checked, id, includeAtTheStart, includeAtTheEnd) => {
    setViewQuestionnaire(false);
    if (checked) {
      if (includeAtTheStart) {
        startQuestionnaires.push(id);
      }
      if (includeAtTheEnd) {
        endQuestionnaires.push(id);
      }
      selectedQuestionnaires.push(id);
      setTotalSelectedActivity(totalSelectedActivity + 1);
      dispatch(addQuestionnaireDataPreview(id));
    } else {
      _.remove(selectedQuestionnaires, n => n === id);
      _.remove(startQuestionnaires, n => n === id);
      _.remove(endQuestionnaires, n => n === id);
      setTotalSelectedActivity(totalSelectedActivity - 1);
    }
    setSelectedQuestionnaires([...selectedQuestionnaires]);
    setStartQuestionnaires([...startQuestionnaires]);
    setEndQuestionnaires([...endQuestionnaires]);
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
      const foundStartQuestionnaires = getQuestionnaireByPhase(updatedActivities, 'start');
      const foundEndQuestionnaires = getQuestionnaireByPhase(updatedActivities, 'end');
      const lastDayActivity = getLastDayActivityOfTreatment(updatedActivities);
      const firstDayActivity = getFirstDayActivityOfTreatment(updatedActivities);
      const finalActivities = updatedActivities.map((ac) => {
        let updatedQuestionnaires = [...ac.questionnaires];
        // Remove the start or end questinnaires from other day
        if (
          !(firstDayActivity && ac.day === firstDayActivity.day && ac.week === firstDayActivity.week) &&
          !(lastDayActivity && ac.day === lastDayActivity.day && ac.week === lastDayActivity.week)
        ) {
          updatedQuestionnaires = updatedQuestionnaires.filter((id) => {
            const shouldRemove =
              foundStartQuestionnaires.includes(id) ||
              foundEndQuestionnaires.includes(id);
            return !shouldRemove;
          });
        }

        return { ...ac, questionnaires: updatedQuestionnaires };
      });
      setActivities(finalActivities);
      dispatch(addPresetDataPreview(presetId));
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
      const lastDayActivity = getLastDayActivityOfTreatment(updatedActivities);
      const firstDayActivity = getFirstDayActivityOfTreatment(updatedActivities);
      const foundStartQuestionnaires = getQuestionnaireByPhase(updatedActivities, 'start');
      const foundEndQuestionnaires = getQuestionnaireByPhase(updatedActivities, 'end');
      // Add the start and end questionnaires to the start and end day of treatment if have
      const finalActivities = updatedActivities.map((ac) => {
        let updatedQuestionnaires = [...ac.questionnaires];

        if (firstDayActivity && ac.day === firstDayActivity.day && ac.week === firstDayActivity.week) {
          if (startQuestionnaires.length) {
            updatedQuestionnaires = _.union(updatedQuestionnaires, startQuestionnaires);
          }
          // Move the existing start questionnaire to the start day of treatment
          updatedQuestionnaires = _.union(updatedQuestionnaires, foundStartQuestionnaires);
        }

        if (lastDayActivity && ac.week === lastDayActivity.week && ac.day === lastDayActivity.day) {
          if (endQuestionnaires.length) {
            updatedQuestionnaires = _.union(updatedQuestionnaires, endQuestionnaires);
          }
          // Move the existing end questionnaire to the end day of treatment if new last day have activitiest assign to
          updatedQuestionnaires = _.union(updatedQuestionnaires, foundEndQuestionnaires);
        }

        // Remove the start or end questinnaires from other day
        if (
          !(firstDayActivity && ac.day === firstDayActivity.day && ac.week === firstDayActivity.week) &&
          !(lastDayActivity && ac.day === lastDayActivity.day && ac.week === lastDayActivity.week)
        ) {
          updatedQuestionnaires = updatedQuestionnaires.filter((id) => {
            const shouldRemove =
              endQuestionnaires.includes(id) ||
              startQuestionnaires.includes(id) ||
              foundStartQuestionnaires.includes(id) ||
              foundEndQuestionnaires.includes(id);

            return !shouldRemove;
          });
        }

        // Remove the start questinnaires from last day
        if (!(lastDayActivity && firstDayActivity && firstDayActivity.day === lastDayActivity.day && firstDayActivity.week === lastDayActivity.week) &&
          lastDayActivity && ac.day === lastDayActivity.day && ac.week === lastDayActivity.week
        ) {
          const startQuestionniareIds = questionnaires
            .filter(questionnaire =>
              !questionnaire.include_at_the_end
            )
            .map(questionnaire => questionnaire.id);

          updatedQuestionnaires = updatedQuestionnaires.filter((id) => {
            return !startQuestionniareIds.includes(id);
          });
        }

        // Remove the end questinnaires from first day
        if (!(lastDayActivity && firstDayActivity && firstDayActivity.day === lastDayActivity.day && firstDayActivity.week === lastDayActivity.week) &&
        firstDayActivity && ac.day === firstDayActivity.day && ac.week === firstDayActivity.week
        ) {
          const endQuestionniareIds = questionnaires
            .filter(questionnaire =>
              !questionnaire.include_at_the_start
            )
            .map(questionnaire => questionnaire.id);

          updatedQuestionnaires = updatedQuestionnaires.filter((id) => {
            return !endQuestionniareIds.includes(id);
          });
        }

        return { ...ac, questionnaires: updatedQuestionnaires };
      });
      setActivities(finalActivities);
    }
    handleClose();
  };

  const getQuestionnaireByPhase = (treatmentActivities, includeAt) => {
    const allActivityQuestionnaires = treatmentActivities.flatMap(activity => activity.questionnaires);
    // Filter the start and end questionnaire ids if present in the treatment activities
    const foundQuestionnaires = questionnaires
      .filter(q => (includeAt === 'start' ? q.include_at_the_start : q.include_at_the_end) && allActivityQuestionnaires.includes(q.id))
      .map(q => q.id);
    return foundQuestionnaires;
  };

  const getLastDayActivityOfTreatment = (treatmentActivities) => {
    let lastDayActivity = null;
    const activityDayWithActivities = treatmentActivities.filter(
      (activity) => activity.exercises.length > 0 || activity.materials.length > 0 || activity.questionnaires.length > 0
    );
    if (activityDayWithActivities.length > 0) {
      lastDayActivity = activityDayWithActivities.reduce((last, current) => {
        if (current.week > last.week || (current.week === last.week && current.day > last.day)) {
          return current;
        }
        return last;
      });
    }
    return lastDayActivity;
  };

  const getFirstDayActivityOfTreatment = (treatmentActivities) => {
    let firstDayActivity = null;
    const activityDayWithActivities = treatmentActivities.filter(
      (activity) => activity.exercises.length > 0 || activity.materials.length > 0 || activity.questionnaires.length > 0
    );
    if (activityDayWithActivities.length > 0) {
      firstDayActivity = activityDayWithActivities.reduce((first, current) => {
        if (current.week < first.week || (current.week === first.week && current.day < first.day)) {
          return current;
        }
        return first;
      });
    }
    return firstDayActivity;
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
      <Tabs mountOnEnter className="mb-3">
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
