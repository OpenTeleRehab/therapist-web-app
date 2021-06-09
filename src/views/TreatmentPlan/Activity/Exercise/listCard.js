import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  Button,
  Card,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

import { Exercise } from 'services/exercise';
import { User } from 'services/user';
import { BsX, BsHeart, BsHeartFill, BsPersonFill } from 'react-icons/bs';
import ViewExercise from 'views/Library/Exercise/view';
import _ from 'lodash';
import { TYPE } from 'variables/activity';

const ListExerciseCard = ({ translate, exerciseIds, exerciseObjs, customExercises, onSelectionRemove, onSelectionModify, readOnly, lang, therapistId, isOwnCreated, treatmentPlanSelectedExercises, day, week, originData, showList, treatmentPlanId }) => {
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState([]);
  const [viewExercise, setViewExercise] = useState(false);
  const [treatmentPlanExercises, setTreatmentPlanExercises] = useState([]);

  useEffect(() => {
    if (exerciseObjs && exerciseObjs.length > 0) {
      setExercises(exerciseObjs);
    } else if (exerciseIds && exerciseIds.length > 0) {
      if (showList) {
        User.getActivitiesByIds(exerciseIds, treatmentPlanId, TYPE.exercise, day, week, lang, therapistId).then(res => {
          if (res.data) {
            setExercises(res.data);
          }
        });
      } else {
        Exercise.getExercisesByIds(exerciseIds, lang, therapistId).then(res => {
          if (res.data) {
            setExercises(res.data);
          }
        });
      }
    } else {
      setExercises([]);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(exerciseIds), lang, exerciseObjs, therapistId, day, week, treatmentPlanId, showList]);

  useEffect(() => {
    if (treatmentPlanSelectedExercises && treatmentPlanSelectedExercises.length > 0) {
      setTreatmentPlanExercises(treatmentPlanSelectedExercises);
    } else if (originData && originData.length > 0) {
      const originDayActivity = _.findLast(originData, { week, day });
      setTreatmentPlanExercises(originDayActivity ? originDayActivity.exercises : []);
    } else {
      setTreatmentPlanExercises([]);
    }
  }, [treatmentPlanSelectedExercises, originData, week, day]);

  const handleView = (exercise) => {
    setExercise(exercise);
    setViewExercise(true);
  };

  const handleViewClose = () => {
    setViewExercise(false);
  };

  const renderSetsAndRepsvalue = (exercise, translate) => {
    let { sets, reps } = exercise;
    const customExercise = _.find(customExercises, { id: exercise.id });
    if (customExercise) {
      sets = customExercise.sets;
      reps = customExercise.reps;
    }

    return (
      <>
        {sets > 0 && (
          <Card.Text>
            {translate('exercise.number_of_sets_and_reps', { sets, reps })}
          </Card.Text>
        )}
      </>
    );
  };

  return (
    <>
      { exercises.map(exercise => (
        <div key={exercise.id} className="position-relative">
          <Card className="exercise-card shadow-sm mb-4">
            <div className="top-bar">
              <div className="favorite-btn btn-link">
                {exercise.is_favorite
                  ? <BsHeartFill size={20} />
                  : <BsHeart size={20} />
                }
              </div>
              {
                (onSelectionRemove) && (
                  <div className="card-remove-btn-wrapper">
                    {isOwnCreated && !readOnly ? (
                      <Button
                        className="btn-circle-sm btn-circle-primary m-1"
                        variant="outline-primary"
                        onClick={() => onSelectionRemove(exercise.id)}
                      >
                        <BsX size={14} />
                      </Button>
                    ) : (
                      <>
                        {(!treatmentPlanExercises.includes(exercise.id) || exercise.created_by === therapistId) && !readOnly &&
                        <Button
                          className="btn-circle-sm m-1"
                          variant="primary"
                          onClick={() => onSelectionRemove(exercise.id)}
                        >
                          <BsX size={14} />
                        </Button>
                        }
                      </>
                    )
                    }
                  </div>
                )
              }
            </div>
            <div className="card-container" onClick={() => handleView(exercise)}>
              <div className="card-img bg-light">
                {
                  exercise.files.length > 0 && (
                    (exercise.files[0].fileType === 'audio/mpeg' &&
                      <div className="w-100">
                        <audio controls className="w-100">
                          <source src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} type="audio/ogg" />
                        </audio>
                      </div>
                    ) ||
                    (exercise.files[0].fileType === 'video/mp4' &&
                      <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}?thumbnail=1`} alt="Exercise"
                      />
                    ) ||
                    ((exercise.files[0].fileType !== 'audio/mpeg' && exercise.files[0].fileType !== 'video/mp4') &&
                      <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} alt="Exercise"
                      />
                    )
                  )
                }
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title>
                  {
                    exercise.title.length <= 50
                      ? <h5 className="card-title">
                        {therapistId === exercise.therapist_id && (
                          <BsPersonFill size={20} className="owner-btn mr-1 mb-1" />
                        )}
                        { exercise.title }
                      </h5>
                      : (
                        <OverlayTrigger
                          overlay={<Tooltip id="button-tooltip-2">{ exercise.title }</Tooltip>}
                        >
                          <h5 className="card-title">
                            {therapistId === exercise.therapist_id && (
                              <BsPersonFill size={20} className="owner-btn mr-1 mb-1" />
                            )}
                            { exercise.title }
                          </h5>
                        </OverlayTrigger>
                      )
                  }
                </Card.Title>
                {renderSetsAndRepsvalue(exercise, translate)}
              </Card.Body>
            </div>
          </Card>
        </div>
      ))}
      { viewExercise && <ViewExercise showView={viewExercise} customExercises={customExercises} handleViewClose={handleViewClose} handleViewSave={onSelectionModify} exercise={exercise} readOnly={readOnly && !isOwnCreated} /> }
    </>
  );
};

ListExerciseCard.propTypes = {
  translate: PropTypes.func,
  exerciseIds: PropTypes.array,
  exerciseObjs: PropTypes.array,
  customExercises: PropTypes.array,
  onSelectionRemove: PropTypes.func,
  onSelectionModify: PropTypes.func,
  readOnly: PropTypes.bool,
  lang: PropTypes.any,
  therapistId: PropTypes.number,
  isOwnCreated: PropTypes.bool,
  treatmentPlanSelectedExercises: PropTypes.array,
  originData: PropTypes.array,
  day: PropTypes.number,
  week: PropTypes.number,
  showList: PropTypes.bool,
  treatmentPlanId: PropTypes.number
};

export default withLocalize(ListExerciseCard);
