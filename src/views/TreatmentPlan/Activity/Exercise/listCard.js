import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  Card,
  Form,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

import { Exercise } from 'services/exercise';

const ListExerciseCard = ({ exerciseIds, onSectionChange }) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (exerciseIds && exerciseIds.length > 0) {
      Exercise.getExercisesByIds(exerciseIds).then(res => {
        if (res.data) {
          setExercises(res.data);
        }
      });
    } else {
      setExercises([]);
    }
  }, [exerciseIds]);

  return (
    <>
      { exercises.map(exercise => (
        <Card key={exercise} className="exercise-card shadow-sm mb-4">
          <div className="card-img bg-light">
            {
              onSectionChange && (
                <div className="position-absolute w-100">
                  <Form.Check
                    type="checkbox"
                    className="float-right action"
                    checked={exerciseIds.includes(exercise.id)}
                    onChange={(e) => onSectionChange(e, exercise.id)}
                  />
                </div>
              )
            }

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
                  <video controls className="w-100 h-100">
                    <source src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} type="video/mp4" />
                  </video>
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
        </Card>
      ))}
    </>
  );
};

ListExerciseCard.propTypes = {
  exerciseIds: PropTypes.array,
  onSectionChange: PropTypes.func
};

export default withLocalize(ListExerciseCard);
