import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { BsPlus, BsX } from 'react-icons/bs';
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

const ActivitySection = ({ weeks, setWeeks, startDate, activities, setActivities, readOnly }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState('');
  const [show, setShow] = useState(false);
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [day, setDay] = useState(1);
  const [weekToRemove, setWeekToRemove] = useState(0);
  const { profile } = useSelector((state) => state.auth);
  const [lang, setLang] = useState('');

  useEffect(() => {
    if (profile) {
      setLang(profile.language_id);
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
            variant={currentWeek === i ? 'primary' : 'outline-primary'}
            onClick={() => setCurrentWeek(i)}
          >
            {translate('common.week')} {i}
          </Button>
          {i !== 1 && !readOnly && <Button
            className="btn-circle-sm btn-in-btn"
            variant="light"
            onClick={() => handleRemoveWeek(i)}
          >
            <BsX size={15} />
          </Button>
          }
        </div>
      );
    }
    return elements;
  };

  const handleAddActivity = (day) => {
    setOpenActivityDialog(true);
    setDay(day);
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

  const dayElements = () => {
    const elements = [];
    for (let i = 0; i < 7; i++) {
      let exercises = null;
      let materials = null;
      let questionnaires = null;
      const date = moment(currentWeekStartDate).add(i, 'days');
      const dayActivity = _.findLast(activities, { week: currentWeek, day: i + 1 });
      const exerciseIds = dayActivity ? dayActivity.exercises || [] : [];
      const materialIds = dayActivity ? dayActivity.materials || [] : [];
      const questionnaireIds = dayActivity ? dayActivity.questionnaires || [] : [];
      if (readOnly) {
        const dayActivities = activities.filter(activity => activity.week === currentWeek && activity.day === i + 1);
        exercises = dayActivities.filter(dayActivity => dayActivity.type === 'exercise');
        materials = dayActivities.filter(dayActivity => dayActivity.type === 'material');
        questionnaires = dayActivities.filter(dayActivity => dayActivity.type === 'questionnaire');
      }
      const isEven = i % 2 === 0;
      elements.push(
        <div className={'flex-fill flex-basic-0 d-flex flex-column align-items-center ' + (isEven ? 'bg-white' : 'bg-light') } key={`day-column-${i}`}>
          <div
            className={date.weekday() === 0 || date.weekday() === 6
              ? 'font-weight-bold w-100 text-center text-uppercase py-2 bg-danger'
              : 'font-weight-bold w-100 text-center text-uppercase py-2 bg-light'}
          >
            {translate('common.day')} {i + 1}
            {date.isValid() && <small>({date.format(settings.date_format)})</small>}
          </div>
          <div className="p-2 activity-card-wrapper h-100">
            <ListExerciseCard exerciseIds={exerciseIds} exerciseObjs={exercises} onSelectionRemove={id => handleExerciseRemove(id, dayActivity)} readOnly={readOnly} lang={lang} />
            <ListEducationMaterialCard materialIds={materialIds} materialObjs={materials} onSelectionRemove={id => handleMaterialRemove(id, dayActivity)} readOnly={readOnly} lang={lang} />
            <ListQuestionnaireCard questionnaireIds={questionnaireIds} questionnaireObjs={questionnaires} onSelectionRemove={id => handleQuestionnaireRemove(id, dayActivity)} readOnly={readOnly} lang={lang} />

            <div className="text-center">
              {!readOnly && <Button
                variant="outline-primary"
                className="btn-circle-lg m-3"
                onClick={() => handleAddActivity(i + 1)}
              >
                <BsPlus size={15} />
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
        {!readOnly && <h6 className="mb-0">{translate('treatment_plan.activities')}</h6>}
        <div className="mt-3">
          <span className="mr-3">
            <b>{ readOnly ? _.sumBy(activities, a => a.type === 'exercise') : _.sumBy(activities, a => a.exercises ? a.exercises.length : 0) }</b> {translate('activity.exercises')}
          </span>
          <span className="mr-3">
            <b>{ readOnly ? _.sumBy(activities, a => a.type === 'material') : _.sumBy(activities, a => a.materials ? a.materials.length : 0) }</b> {translate('activity.education_materials')}
          </span>
          <span>
            <b>{ readOnly ? _.sumBy(activities, a => a.type === 'questionnaire') : _.sumBy(activities, a => a.questionnaires ? a.questionnaires.length : 0) }</b> {translate('activity.questionnaires')}
          </span>
        </div>
        <div className="d-flex align-items-center my-4">
          {weekElements()}
          {!readOnly && <Button
            variant="outline-primary"
            className="btn-circle"
            onClick={handleAddWeek}
          >
            <BsPlus size={15} />
          </Button>
          }
        </div>
      </div>
      <div className="d-flex flex-column flex-lg-row mb-3">
        {!openActivityDialog && dayElements()}
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
        />
      }
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
  readOnly: PropTypes.bool
};

export default ActivitySection;