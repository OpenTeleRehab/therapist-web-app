import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { BsPlus, BsX } from 'react-icons/bs';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import moment from 'moment';
import _ from 'lodash';

import settings from 'settings';
import PropTypes from 'prop-types';
import Dialog from 'components/Dialog';
import AddActivity from 'views/TreatmentPlan/Activity/add';
import ListExerciseCard from 'views/TreatmentPlan/Activity/Exercise/listCard';
import ListEducationMaterialCard from 'views/TreatmentPlan/Activity/EducationMaterial/listCard';
import ListQuestionnaireCard from 'views/TreatmentPlan/Activity/Questionnaire/listCard';
import { BiCopyAlt } from 'react-icons/bi';
import CopyActivity from './copyActivity';
import customColorScheme from '../../../utils/customColorScheme';

const ActivitySection = ({ weeks, setWeeks, startDate, activities, setActivities, readOnly, isPreset, isOwnCreated, originData, treatmentPlanId }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState('');
  const [show, setShow] = useState(false);
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [day, setDay] = useState(1);
  const [weekToRemove, setWeekToRemove] = useState(0);
  const { profile } = useSelector((state) => state.auth);
  const { colorScheme } = useSelector((state) => state.colorScheme);
  const [lang, setLang] = useState('');
  const [therapistId, setTherapistId] = useState();
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [dayActivityToCopy, setDayActivityToCopy] = useState();
  const [newWeeks, setNewWeeks] = useState([]);

  useEffect(() => {
    if (profile) {
      setLang(profile.language_id);
      setTherapistId(profile.id);
    }
  }, [profile]);

  useEffect(() => {
    if (moment(startDate, settings.date_format).isValid()) {
      const date = moment(startDate, settings.date_format).add(currentWeek - 1, 'weeks');
      setCurrentWeekStartDate(date);
    } else {
      setCurrentWeekStartDate('');
    }
  }, [startDate, currentWeek]);

  const handleAddWeek = () => {
    setWeeks(weeks + 1);
    newWeeks.push(weeks + 1);
    setNewWeeks([...newWeeks]);
  };

  const handleRemoveWeek = (week) => {
    setShow(true);
    setWeekToRemove(week);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleConfirm = () => {
    if (weeks > 1 && weekToRemove > 0) {
      setCurrentWeek(1);
      setWeeks(weeks - 1);
      setShow(false);
      _.remove(activities, a => a.week === weekToRemove);
      activities.map(activity => {
        if (activity.week > weekToRemove) {
          activity.week--;
        }
        return activity;
      });
      setActivities([...activities]);
      setWeekToRemove(0);
    }
  };

  const weekElements = () => {
    const elements = [];
    for (let i = 1; i <= weeks; i++) {
      elements.push(
        <div className="position-relative mr-3" key={`week-tab-${i}`}>
          <Button
            aria-label="Current week"
            variant={currentWeek === i ? 'primary' : 'outline-primary'}
            onClick={() => setCurrentWeek(i)}
          >
            {translate('common.week')} {i}
          </Button>
          {i !== 1 && !readOnly && (isOwnCreated || newWeeks.includes(i)) && (
            <Button
              aria-label="Remove week"
              className="btn-circle-sm btn-in-btn btn-circle-primary"
              variant="outline-primary"
              onClick={() => handleRemoveWeek(i)}
            >
              <BsX size={12} />
            </Button>
          )}
        </div>
      );
    }
    return elements;
  };

  const handleAddActivity = (day) => {
    setOpenActivityDialog(true);
    setDay(day);
  };

  const handleExerciseModify = (custom, dayActivity) => {
    const customExercises = dayActivity.customExercises || [];
    dayActivity.customExercises = _.unionWith([custom], customExercises, (a, n) => {
      return a.id === n.id;
    });
    const updatedActivities = _.unionWith([dayActivity], activities, (a, n) => {
      return a.week === n.week && a.day === n.day;
    });
    setActivities(updatedActivities);
  };

  const handleExerciseRemove = (id, dayActivity) => {
    _.remove(dayActivity.exercises, n => n === id);
    const updatedActivities = _.unionWith([dayActivity], activities, (a, n) => {
      return a.week === n.week && a.day === n.day;
    });
    setActivities(updatedActivities);
  };

  const handleMaterialRemove = (id, dayActivity) => {
    _.remove(dayActivity.materials, n => n === id);
    const updatedActivities = _.unionWith([dayActivity], activities, (a, n) => {
      return a.week === n.week && a.day === n.day;
    });
    setActivities(updatedActivities);
  };

  const handleQuestionnaireRemove = (id, dayActivity) => {
    _.remove(dayActivity.questionnaires, n => n === id);
    const updatedActivities = _.unionWith([dayActivity], activities, (a, n) => {
      return a.week === n.week && a.day === n.day;
    });
    setActivities(updatedActivities);
  };

  const handleCloseActivityDialog = () => {
    setOpenActivityDialog(false);
  };

  const handleClearDayActivity = (dayActivity) => {
    _.remove(activities, a => a.week === dayActivity.week && a.day === dayActivity.day);
    setActivities([...activities]);
  };

  const handleCopyDayActivity = (dayActivity) => {
    setOpenCopyDialog(true);
    setDayActivityToCopy(dayActivity);
  };

  const handleCloseCopyDialog = () => {
    setOpenCopyDialog(false);
  };

  const dayElements = () => {
    const elements = [];
    for (let i = 0; i < 7; i++) {
      const date = moment(currentWeekStartDate).add(i, 'days');
      const dayActivity = _.findLast(activities, { week: currentWeek, day: i + 1 });
      const exerciseIds = dayActivity ? dayActivity.exercises || [] : [];
      const materialIds = dayActivity ? dayActivity.materials || [] : [];
      const questionnaireIds = dayActivity ? dayActivity.questionnaires || [] : [];
      const customExercises = dayActivity ? dayActivity.customExercises || [] : [];
      const isEven = i % 2 === 0;
      let showCopyAndClear = false;
      if (dayActivity && (dayActivity.exercises || dayActivity.materials || dayActivity.questionnaires)) {
        if (dayActivity.exercises.length || dayActivity.materials.length || dayActivity.questionnaires.length) {
          showCopyAndClear = true;
        }
      }
      const originDayActivity = _.findLast(originData, { week: currentWeek, day: i + 1 });
      const treatmentPlanSelectedMaterials = originDayActivity ? originDayActivity.materials : [];
      const treatmentPlanSelectedExercises = originDayActivity ? originDayActivity.exercises : [];
      const treatmentPlanSelectedQuestionnaires = originDayActivity ? originDayActivity.questionnaires : [];

      elements.push(
        <div className={'flex-fill flex-basic-0 d-flex flex-column align-items-center ' + (isEven ? 'bg-white' : 'bg-light') } key={`day-column-${i}`}>
          <div
            className={date.weekday() === 0 || date.weekday() === 6
              ? 'font-weight-bold w-100 text-center text-uppercase py-2 activity-weekend-header-column-background'
              : 'font-weight-bold w-100 text-center text-uppercase py-2 bg-light'}
          >
            {translate('common.day')} {i + 1}
            {date.isValid() && <small>({date.format(settings.date_format)})</small>}
          </div>
          <div className="p-2 activity-card-wrapper h-100">
            {(showCopyAndClear && !readOnly) &&
              <div className="d-flex justify-content-between mb-2">
                {(isOwnCreated || isPreset) &&
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0"
                    onClick={() => handleClearDayActivity(dayActivity)}
                  >
                    <RiDeleteBin5Line size={16} /> {translate('common.clear_all')}
                  </Button>
                }
                <Button
                  variant="link"
                  size="sm"
                  className="p-0"
                  onClick={() => handleCopyDayActivity(dayActivity)}
                >
                  <BiCopyAlt size={16} /> {translate('common.copy_all')}
                </Button>
              </div>
            }

            <ListExerciseCard exerciseIds={exerciseIds} customExercises={customExercises} onSelectionRemove={id => handleExerciseRemove(id, dayActivity)} onSelectionModify={custom => handleExerciseModify(custom, dayActivity)} readOnly={readOnly} lang={lang} therapistId={therapistId} isOwnCreated={isOwnCreated} treatmentPlanSelectedExercises={treatmentPlanSelectedExercises} week={currentWeek} day={i + 1} treatmentPlanId={treatmentPlanId} />
            <ListEducationMaterialCard materialIds={materialIds} onSelectionRemove={id => handleMaterialRemove(id, dayActivity)} readOnly={readOnly} lang={lang} therapistId={therapistId} isOwnCreated={isOwnCreated} treatmentPlanSelectedMaterials={treatmentPlanSelectedMaterials} week={currentWeek} day={i + 1} treatmentPlanId={treatmentPlanId} />
            <ListQuestionnaireCard questionnaireIds={questionnaireIds} onSelectionRemove={id => handleQuestionnaireRemove(id, dayActivity)} readOnly={readOnly} lang={lang} therapistId={therapistId} isOwnCreated={isOwnCreated} treatmentPlanSelectedQuestionnaires={treatmentPlanSelectedQuestionnaires} week={currentWeek} day={i + 1} treatmentPlanId={treatmentPlanId} />

            <div className="d-flex justify-content-center">
              {!readOnly && <Button
                aria-label="Add activity"
                variant="outline-primary"
                className="d-flex justify-content-center align-items-center btn-circle-lg btn-circle-primary m-3"
                onClick={() => handleAddActivity(i + 1)}
              >
                <span><BsPlus size={24} /></span>
              </Button>
              }
            </div>
          </div>
        </div>
      );
    }

    return elements;
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="d-flex align-items-center my-4">
          {weekElements()}
          {!readOnly && <Button
            aria-label="Add week"
            variant="outline-primary"
            className="btn-circle btn-circle-primary"
            onClick={handleAddWeek}
          >
            <BsPlus size={16} />
          </Button>
          }
        </div>
      </div>
      <div className="d-flex flex-column flex-lg-row mb-3">
        {dayElements()}
      </div>
      <Dialog
        show={show}
        title={translate('treatment_plan.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>

      {openActivityDialog &&
        <AddActivity
          handleClose={handleCloseActivityDialog}
          show={openActivityDialog}
          week={currentWeek}
          day={day}
          activities={activities}
          setActivities={setActivities}
          isPreset={isPreset}
          isOwnCreated={isOwnCreated}
          originData={originData}
        />
      }

      {openCopyDialog &&
        <CopyActivity
          handleClose={handleCloseCopyDialog}
          show={openCopyDialog}
          activities={activities}
          setActivities={setActivities}
          dayActivityToCopy={dayActivityToCopy}
          weeks={weeks}
          treatmentPlanId={treatmentPlanId}
          lang={lang}
          therapistId={therapistId}
        />
      }
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

ActivitySection.propTypes = {
  weeks: PropTypes.number,
  setWeeks: PropTypes.func,
  startDate: PropTypes.string,
  day: PropTypes.number,
  activities: PropTypes.array,
  setActivities: PropTypes.func,
  readOnly: PropTypes.bool,
  isPreset: PropTypes.bool,
  isOwnCreated: PropTypes.bool,
  originData: PropTypes.array,
  treatmentPlanId: PropTypes.number
};

export default ActivitySection;
