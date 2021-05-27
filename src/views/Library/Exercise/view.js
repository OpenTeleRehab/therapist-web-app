import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate } from 'react-localize-redux';
import { Col, Form } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Dialog from 'components/Dialog';

const ViewExercise = ({ customExercises, showView, handleViewClose, handleViewSave, exercise, readOnly }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [index, setIndex] = useState(0);
  const [formFields, setFormFields] = useState({
    sets: 0,
    reps: 0,
    additional_information: ''
  });
  const [setsError, setSetsError] = useState(false);
  const [repsError, setRepsError] = useState(false);

  useEffect(() => {
    if (exercise) {
      const customExercise = _.find(customExercises, { id: exercise.id });
      if (customExercise) {
        setFormFields({
          sets: customExercise.sets,
          reps: customExercise.reps,
          additional_information: customExercise.additional_information
        });
      } else {
        setFormFields({
          sets: exercise.sets,
          reps: exercise.reps,
          additional_information: exercise.additional_information
        });
      }
    }
  }, [exercise, customExercises]);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSave = () => {
    let canSave = true;

    if (formFields.sets < 0 || formFields.sets > 99) {
      canSave = false;
      setSetsError(true);
    }
    if (formFields.reps < 0 || formFields.reps > 99) {
      canSave = false;
      setRepsError(true);
    }

    if (canSave) {
      handleViewSave({ ...formFields, id: exercise.id });
      handleViewClose();
    }
  };

  return (
    <Dialog
      show={showView}
      title={exercise.title}
      cancelLabel={translate('common.close')}
      confirmLabel={translate('common.save')}
      onCancel={handleViewClose}
      onConfirm={!readOnly ? handleSave : null}
    >
      <Form onSubmit={handleSave}>
        <Carousel activeIndex={index} onSelect={handleSelect} controls={exercise.files.length > 1} indicators={exercise.files.length > 1} className="view-exercise-carousel">
          { exercise.files.map((file, index) => (
            <Carousel.Item key={index}>
              { file.fileType === 'audio/mpeg' &&
              <div className="img-thumbnail w-100 pt-2 pl-5 pr-5 bg-light audio-wrapper">
                <audio controls className="w-100 mt-4">
                  <source src={file.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${file.id}`} type="audio/ogg" />
                </audio>
              </div>
              }
              { (file.fileType !== 'audio/mpeg' && file.fileType !== 'video/mp4') &&
              <img
                className="d-block w-100"
                src={file.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${file.id}`} alt="..."
              />
              }

              { file.fileType === 'video/mp4' &&
              <video className="w-100 img-thumbnail" controls>
                <source src={file.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${file.id}`} type="video/mp4" />
              </video>
              }
            </Carousel.Item>
          ))}
        </Carousel>

        {readOnly && exercise.sets > 0 && (
          <p className="mt-2">
            {translate('exercise.number_of_sets_and_reps', { sets: exercise.sets, reps: exercise.reps })}
          </p>
        )}
        {!readOnly && exercise.sets >= 0 && (
          <Form.Row className="mt-2">
            <Form.Group as={Col} controlId="formSets">
              <Form.Label>{translate('exercise.sets')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Form.Control
                type="number"
                min={0}
                max={99}
                name="sets"
                placeholder={translate('exercise.sets.placeholder')}
                value={formFields.sets}
                onChange={handleChange}
                isInvalid={setsError}
              />
              <Form.Control.Feedback type="invalid">
                {translate('exercise.sets.required')}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="formReps">
              <Form.Label>{translate('exercise.reps')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Form.Control
                type="number"
                min={0}
                max={99}
                name="reps"
                placeholder={translate('exercise.reps.placeholder')}
                value={formFields.reps}
                onChange={handleChange}
                isInvalid={repsError}
              />
              <Form.Control.Feedback type="invalid">
                {translate('exercise.reps.required')}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
        )}

        <div className="mt-2">
          { exercise.additional_fields && exercise.additional_fields.map((additionalField, index) => (
            <div key={index}>
              <strong>{additionalField.field}</strong>
              <p style={{ whiteSpace: 'pre-wrap' }}>{additionalField.value}</p>
            </div>
          ))}
        </div>

        {readOnly && exercise.additional_information && (
          <div>
            <strong>{translate('exercise.additional_information')}</strong>
            <p>{exercise.additional_information}</p>
          </div>
        )}
        {!readOnly && (
          <Form.Group controlId="formAdditionalInfo">
            <Form.Label>{translate('exercise.additional_information')}</Form.Label>
            <Form.Control
              as="textarea"
              name="additional_information"
              rows={3}
              value={formFields.additional_information}
              placeholder={translate('exercise.additional_information.placeholder')}
              onChange={handleChange}
              // isInvalid={errorDescription}
            />
          </Form.Group>
        )}
      </Form>
    </Dialog>
  );
};

ViewExercise.propTypes = {
  showView: PropTypes.bool,
  handleViewClose: PropTypes.func,
  handleViewSave: PropTypes.func,
  exercise: PropTypes.object,
  readOnly: PropTypes.bool,
  customExercises: PropTypes.array
};

ViewExercise.defaultProps = {
  readOnly: true
};

export default ViewExercise;
