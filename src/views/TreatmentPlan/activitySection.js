import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { BsPlus, BsX } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import moment from 'moment';
import _ from 'lodash';

import settings from '../../settings';
import PropTypes from 'prop-types';
import Dialog from 'components/Dialog';
import AddActivity from 'views/TreatmentPlan/Activity/add';
import ListExerciseCard from 'views/TreatmentPlan/Activity/Exercise/listCard';

const ActivitySection = ({ weeks, setWeeks, startDate, activities, setActivities }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState('');
  const [show, setShow] = useState(false);
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [day, setDay] = useState(1);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercises, setExercises] = useState([]);

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

  const handleRemoveWeek = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleConfirm = () => {
    if (weeks > 1) {
      setCurrentWeek(1);
      setWeeks(weeks - 1);
      setShow(false);
    }
  };

  const weekElements = () => {
    const elements = [];
    for (let i = 1; i <= weeks; i++) {
      elements.push(
        <div className="position-relative mr-3" key={i}>
          <Button
            variant={currentWeek === i ? 'primary' : 'outline-primary'}
            onClick={() => setCurrentWeek(i)}
          >
            {translate('common.week')} {i}
          </Button>
          {i !== 1 && <Button
            className="btn-circle-sm btn-in-btn"
            variant="light"
            onClick={handleRemoveWeek}
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

  const handleCloseActivityDialog = () => {
    setOpenActivityDialog(false);
    setSelectedExercises([]);
  };

  const dayElements = () => {
    const elements = [];
    for (let i = 0; i < 7; i++) {
      const date = moment(currentWeekStartDate).add(i, 'days');
      const dayActivity = _.findLast(activities, { week: currentWeek, day: i + 1 });
      const exerciseIds = dayActivity ? dayActivity.exercises : [];
      elements.push(
        <div className="flex-fill flex-basic-0 d-flex flex-column align-items-center" key={i}>
          <div
            className={date.weekday() === 0 || date.weekday() === 6
              ? 'font-weight-bold w-100 text-center text-uppercase py-2 bg-danger'
              : 'font-weight-bold w-100 text-center text-uppercase py-2'}
          >
            {translate('common.day')} {i + 1}
            {date.isValid() && <small>({date.format(settings.date_format)})</small>}
          </div>
          <div className="p-2 activity-card-wrapper h-100">
            <ListExerciseCard exerciseIds={exerciseIds} />
            <Button
              variant="outline-primary"
              className="btn-circle-lg m-3"
              onClick={() => handleAddActivity(i + 1)}
            >
              <BsPlus size={15} />
            </Button>
          </div>
        </div>
      );
    }

    return elements;
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h6>{translate('treatment_plan.activities')}</h6>
        <div>
          <span className="mr-3">
            <b>{ _.sumBy(activities, a => a.exercises.length) }</b> {translate('common.exercises')}
          </span>
          <span className="mr-3"><b>0</b> {translate('common.education_materials')}</span>
          <span><b>0</b> {translate('common.questionnaire')}</span>
        </div>
        <div className="d-flex align-items-center my-4">
          {weekElements()}
          <Button
            variant="outline-primary"
            className="btn-circle"
            onClick={handleAddWeek}
          >
            <BsPlus size={15} />
          </Button>
        </div>
      </div>
      <div className="d-flex flex-column flex-lg-row bg-light mb-3">
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

      {openActivityDialog && <AddActivity handleClose={handleCloseActivityDialog} show={openActivityDialog} week={currentWeek} day={day} activities={activities} setActivities={setActivities} selectedExercises={selectedExercises} setSelectedExercises={setSelectedExercises} exercises={exercises} setExercises={setExercises}/>}
    </>
  );
};

ActivitySection.propTypes = {
  weeks: PropTypes.number,
  setWeeks: PropTypes.func,
  startDate: PropTypes.string,
  day: PropTypes.number,
  activities: PropTypes.array,
  setActivities: PropTypes.func
};

export default ActivitySection;
