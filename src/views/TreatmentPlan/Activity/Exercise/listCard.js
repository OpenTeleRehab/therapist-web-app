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
import { BsX, BsHeart, BsHeartFill } from 'react-icons/bs';
import ViewExercise from './viewExercise';
import { IoPerson } from 'react-icons/io5';

const ListExerciseCard = ({ exerciseIds, exerciseObjs, onSelectionRemove, readOnly, lang, therapistId }) => {
  const [exercises, setExercises] = useState([]);
  const [ids] = exerciseIds;
  const [exercise, setExercise] = useState([]);
  const [viewExercise, setViewExercise] = useState(false);

  useEffect(() => {
    if (exerciseObjs && exerciseObjs.length > 0) {
      setExercises(exerciseObjs);
    } else if (exerciseIds && exerciseIds.length > 0) {
      Exercise.getExercisesByIds(exerciseIds, lang, therapistId).then(res => {
        if (res.data) {
          setExercises(res.data);
        }
      });
    } else {
      setExercises([]);
    }
  }, [ids, exerciseIds, lang, exerciseObjs, therapistId]);

  const handleView = (exercise) => {
    setExercise(exercise);
    setViewExercise(true);
  };

  const handleViewClose = () => {
    setViewExercise(false);
  };

  return (
    <>
      { exercises.map(exercise => (
        <div key={exercise.id} className="position-relative">
          <Card className="exercise-card shadow-sm mb-4">
            <div className="top-bar">
              <div className="favorite-btn btn-link">
                {exercise.is_favorite
                  ? <BsHeartFill size={25} />
                  : <BsHeart size={25} />
                }
              </div>
              {therapistId === exercise.therapist_id && (
                <div className="owner-btn">
                  <IoPerson size={20} />
                </div>
              )}
              {
                onSelectionRemove && (
                  <div className="card-remove-btn-wrapper">
                    {!readOnly && <Button
                      className="btn-circle-sm m-1"
                      variant="light"
                      onClick={() => onSelectionRemove(exercise.id)}
                    >
                      <BsX size={15} />
                    </Button>
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
                      <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}/?thumbnail=1`} alt="Exercise"
                      />
                    ) ||
                    ((exercise.files[0].fileType !== 'audio/mpeg' && exercise.files[0].fileType !== 'video/mp4') &&
                      <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} alt="Exercise"
                      />
                    )
                  )
                }
              </div>
              <Card.Body>
                <Card.Title>
                  {
                    exercise.title.length <= 50
                      ? <h5 className="card-title">{ exercise.title }</h5>
                      : (
                        <OverlayTrigger
                          overlay={<Tooltip id="button-tooltip-2">{ exercise.title }</Tooltip>}
                        >
                          <h5 className="card-title">{ exercise.title }</h5>
                        </OverlayTrigger>
                      )
                  }
                </Card.Title>
              </Card.Body>
            </div>
          </Card>
        </div>
      ))}
      { viewExercise && <ViewExercise showView={viewExercise} handleViewClose={handleViewClose} exercise={exercise} /> }
    </>
  );
};

ListExerciseCard.propTypes = {
  exerciseIds: PropTypes.array,
  exerciseObjs: PropTypes.array,
  onSelectionRemove: PropTypes.func,
  readOnly: PropTypes.bool,
  lang: PropTypes.any,
  therapistId: PropTypes.string
};

export default withLocalize(ListExerciseCard);
