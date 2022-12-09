import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  Button,
  Card,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { BsX, BsHeart, BsHeartFill, BsPersonFill } from 'react-icons/bs';
import ViewExercise from 'views/Library/Exercise/view';

const ListExerciseCard = ({ translate, exerciseIds, customExercises, onSelectionRemove, onSelectionModify, readOnly, therapistId, isOwnCreated, treatmentPlanSelectedExercises, day, week, originData }) => {
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState([]);
  const [viewExercise, setViewExercise] = useState(false);
  const [treatmentPlanExercises, setTreatmentPlanExercises] = useState([]);
  const { previewData } = useSelector(state => state.treatmentPlan.treatmentPlansDetail);

  useEffect(() => {
    if (exerciseIds && exerciseIds.length && previewData && previewData.exercises) {
      const data = _.filter(previewData.exercises, o => _.includes(exerciseIds, o.id));
      setExercises(data);
    } else {
      setExercises([]);
    }
  }, [JSON.stringify(exerciseIds), previewData]);

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
      {exercises.map(exercise => (
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
                        aria-label="Remove exercise"
                        className="btn-circle-sm btn-circle-primary"
                        variant="outline-primary"
                        onClick={() => onSelectionRemove(exercise.id)}
                      >
                        <BsX size={14} />
                      </Button>
                    ) : (
                      <>
                        {(!treatmentPlanExercises.includes(exercise.id) || exercise.created_by === therapistId) && !readOnly &&
                        <Button
                          aria-label="Remove exercise"
                          className="btn-circle-sm"
                          variant="outline-primary"
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
                      <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}?thumbnail=1`} alt="Exercise" loading="lazy" />
                    ) ||
                    ((exercise.files[0].fileType !== 'audio/mpeg' && exercise.files[0].fileType !== 'video/mp4') &&
                      <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} alt="Exercise" loading="lazy" />
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
  therapistId: PropTypes.number,
  isOwnCreated: PropTypes.bool,
  treatmentPlanSelectedExercises: PropTypes.array,
  originData: PropTypes.array,
  day: PropTypes.number,
  week: PropTypes.number
};

export default withLocalize(ListExerciseCard);
