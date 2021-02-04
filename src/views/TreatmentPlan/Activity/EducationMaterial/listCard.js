import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate, withLocalize } from 'react-localize-redux';
import {
  Card,
  Form,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { MdDescription } from 'react-icons/md';

import { EducationMaterial } from 'services/educationMaterial';
import { useSelector } from 'react-redux';

const ListEducationMaterialCard = ({ materialIds, onSectionChange }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (materialIds && materialIds.length > 0) {
      EducationMaterial.getEducationMaterialsByIds(materialIds).then(res => {
        if (res.data) {
          setExercises(res.data);
        }
      });
    } else {
      setExercises([]);
    }
  }, [materialIds]);

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
                    checked={materialIds.includes(exercise.id)}
                    onChange={(e) => onSectionChange(e, exercise.id)}
                  />
                </div>
              )
            }
            <div className="w-100 h-100 px-2 py-4 text-white bg-primary text-center">
              <MdDescription size={80} />
              <p>{translate('activity.material').toUpperCase()}</p>
            </div>
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

ListEducationMaterialCard.propTypes = {
  materialIds: PropTypes.array,
  onSectionChange: PropTypes.func
};

export default withLocalize(ListEducationMaterialCard);
