import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Translate, getTranslate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { getPublishSurvey, submitSurvey, skipSurvey } from '../../store/survey/actions';

const Survey = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { languages } = useSelector(state => state.language);
  const { profile } = useSelector((state) => state.auth);
  const { publishSurvey } = useSelector(state => state.survey);
  const [showSurvey, setShowSurvey] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [hasMandatoryQuestion, setHasMandatoryQuestion] = useState(false);

  useEffect(() => {
    dispatch(getPublishSurvey({
      organization: process.env.REACT_APP_NAME,
      user_id: profile.id,
      type: 'therapist',
      country_id: profile.country_id,
      clinic_id: profile.clinic_id,
      lang: profile.language_id ? profile.language_id : languages.length ? languages[0].id : ''
    }));
  }, [profile, dispatch]);

  useEffect(() => {
    if (!publishSurvey.questionnaire) return;

    if (checkShowSurvey()) {
      setShowSurvey(true);
      localStorage.setItem('lastSurveyShownDate', new Date().toISOString());
    }

    setHasMandatoryQuestion(
      (publishSurvey.questionnaire.questions && publishSurvey.questionnaire.questions.some(question => question.mandatory)) || false
    );
  }, [publishSurvey]);

  useEffect(() => {
    if (publishSurvey.questionnaire && publishSurvey.questionnaire.questions) {
      setCurrentQuestion(publishSurvey.questionnaire.questions[currentIndex]);
    }
  }, [publishSurvey, currentIndex]);

  const checkShowSurvey = () => {
    const lastSurveyShownDate = localStorage.getItem('lastSurveyShownDate');

    if (!lastSurveyShownDate) {
      return true;
    }

    // Calculate interval time based on the frequency in days
    const frequencyInMs = publishSurvey.frequency * 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const lastShownDate = new Date(lastSurveyShownDate);
    const elapsedTime = currentDate - lastShownDate;

    return elapsedTime >= frequencyInMs;
  };

  const handleInputChange = (questionId, value, type) => {
    if (type === 'checkbox') {
      setAnswers((prev) => {
        const selectedValues = prev[questionId] || [];
        return {
          ...prev,
          [questionId]: selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value]
        };
      });
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }

    // Clear any existing validation error for the current question
    if (validationErrors[questionId]) {
      setValidationErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[questionId];
        return updatedErrors;
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    // Validate mandatory question before moving to next question
    if (currentQuestion.mandatory && (!answers[currentQuestion.id] || !answers[currentQuestion.id].length)) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [currentQuestion.id]: translate('survey.answer.required')
      }));
      return;
    }

    // If there are no errors, proceed to the next question
    if (currentIndex < (publishSurvey.questionnaire.questions.length - 1)) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    // Validate all mandatory questions before submitting
    publishSurvey.questionnaire.questions.forEach((question) => {
      if (question.mandatory && (!answers[question.id] || !answers[question.id].length)) {
        newErrors[question.id] = translate('survey.answer.required');
      }
      if (question.type === 'open-number') {
        const threshold = currentQuestion.answers[0].threshold;
        const minValue = 0;
        if (answers[question.id] && (answers[question.id] > threshold || answers[question.id] < minValue)) {
          newErrors[question.id] = translate('survey.error.thereshold_value', { minValue: minValue }, { threshold: threshold });
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: parseInt(questionId, 10),
      answer
    }));

    const payload = {
      user_id: profile.id,
      survey_id: publishSurvey.id,
      answers: JSON.stringify(formattedAnswers)
    };

    dispatch(submitSurvey(payload)).then(result => {
      if (result) {
        setShowSurvey(false);
      }
    });
  };

  const handleSkipSurvey = () => {
    const payload = {
      user_id: profile.id,
      survey_id: publishSurvey.id
    };
    dispatch(skipSurvey(payload)).then(result => {
      if (result) {
        setShowSurvey(false);
      }
    });
  };

  const questionsLength = publishSurvey && publishSurvey.questionnaire && publishSurvey.questionnaire.questions ? publishSurvey.questionnaire.questions.length : undefined;

  return (
    <Modal show={showSurvey} size="lg" scrollable={true} backdrop="static" keyboard={false} >
      <Modal.Header>
        <Modal.Title>
          {publishSurvey.questionnaire && publishSurvey.questionnaire.title}
          <h6 className="text-muted" >
            {publishSurvey.questionnaire && publishSurvey.questionnaire.description}
          </h6>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {currentQuestion && (
          <>
            <h5>{currentQuestion.title} {!!currentQuestion.mandatory && <span>*</span>}</h5>
            {currentQuestion.type === 'checkbox' && currentQuestion.answers.map((answer, index) => (
              <div key={index}>
                <Form.Check
                  aria-label={answer.description}
                  inline
                  label={answer.description}
                  type="checkbox"
                  checked={(answers[currentQuestion.id] || []).includes(answer.id)}
                  onChange={() =>
                    handleInputChange(currentQuestion.id, answer.id, 'checkbox')
                  }
                />
              </div>
            ))}

            {currentQuestion.type === 'multiple' && currentQuestion.answers.map((answer, index) => (
              <div key={index}>
                <Form.Check
                  aria-label={answer.description}
                  inline
                  label={answer.description}
                  type="radio"
                  name={`question_${currentQuestion.id}`}
                  checked={answers[currentQuestion.id] === answer.id}
                  onChange={() =>
                    handleInputChange(currentQuestion.id, answer.id, 'radio')
                  }
                />
              </div>
            ))}

            {currentQuestion.type === 'open-text' && (
              <div className="ml-1">
                <Form.Group controlId="formValue">
                  <Form.Control
                    type="text"
                    aria-label="Text input box"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) =>
                      handleInputChange(currentQuestion.id, e.target.value, 'text')
                    }
                  />
                </Form.Group>
              </div>
            )}

            {currentQuestion.type === 'open-number' && (
              <div className="ml-1">
                <Form.Group controlId="formValue">
                  <Form.Control
                    type="number"
                    aria-label="Number input box"
                    value={answers[currentQuestion.id] || ''}
                    min={0}
                    onChange={(e) =>
                      handleInputChange(currentQuestion.id, e.target.value, 'number')
                    }
                  />
                </Form.Group>
              </div>
            )}
          </>
        )}
        {validationErrors[currentQuestion && currentQuestion.id] && (
          <h6 className="text-danger">{validationErrors[currentQuestion && currentQuestion.id]}</h6>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div className="action">
          {currentIndex > 0 && (
            <Button variant="primary" onClick={handlePrevious} className='mr-1'>
              <Translate id="common.previous"/>
            </Button>
          )}
          {currentIndex < questionsLength - 1 && (
            <Button variant="primary" onClick={handleNext}>
              <Translate id="common.next"/>
            </Button>
          )}
        </div>
        <div>
          {!hasMandatoryQuestion && <Button variant="primary" onClick={handleSkipSurvey} className='mr-1'>
            <Translate id="common.skip"/>
          </Button>
          }
          {currentIndex === questionsLength - 1 && (
            <Button variant="primary" onClick={handleSubmit}>
              <Translate id="common.submit"/>
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default Survey;
