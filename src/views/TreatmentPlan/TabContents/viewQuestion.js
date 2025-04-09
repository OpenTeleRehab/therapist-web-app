import React, { useContext } from 'react';
import Dialog from 'components/Dialog';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import 'react-phone-input-2/lib/style.css';
import { Accordion, AccordionContext, Badge, Card, Form } from 'react-bootstrap';
import _ from 'lodash';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';

const ViewQuestion = ({ show, handleClose, questionnaire }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const answerValue = (questionId) => {
    const answer = questionnaire.answers.find(patientAnswer => patientAnswer.question_id === questionId);
    return answer ? answer.answer : '';
  };

  return (
    <Dialog
      show={show}
      size="lg"
      scrollable={true}
      title={questionnaire.title}
      onCancel={handleClose}
      cancelLabel={translate('common.close')}
    >
      <div className="d-flex flex-column mb-2">
        <span className="font-weight-bold">{translate('questionnaire.description')}</span>
        <span>{questionnaire.description}</span>
      </div>
      <div className="d-flex flex-column mb-3">
        <span className="font-weight-bold">{translate('questionnaire.number_of_question')}</span>
        <span>{questionnaire.questions.length}</span>
      </div>
      <div className="d-flex flex-column mb-3">
        <span className="font-weight-bold">{translate('questionnaire.total_score')}</span>
        <span>{questionnaire.score}</span>
      </div>
      {questionnaire.questions.map((question, index) => (
        <Accordion key={index}>
          <Card className="mb-3 question-card">
            <Accordion.Toggle as={Card.Header} eventKey={index + 1} className="card-header d-flex justify-content-between">
              <h6>{translate('questionnaire.question_number', { number: index + 1 })}</h6>
              <ContextAwareToggle eventKey={index + 1} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index + 1}>
              <Card.Body>
                { question.file &&
                  <img src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${question.file.id}`} alt="..." className="img-thumbnail" loading="lazy"/>
                }
                <div>
                  {question.title}
                </div>
                <div>
                  {
                    question.type === 'checkbox' && (
                      question.answers.map((answer, index) => (
                        <div key={index}>
                          <Form.Check
                            inline
                            label={
                              <>
                                {answer.description}
                                {answer.value && (
                                  <Badge className="ml-2" pill variant="warning">{translate('question.answer_value')}: {answer.value}</Badge>
                                )}
                              </>
                            }
                            type='checkbox'
                            checked={ questionnaire.answers.find(patientAnswer => _.includes(patientAnswer.answer, answer.id))}
                            disabled
                          />
                        </div>
                      ))
                    )
                  }
                  {
                    question.type === 'multiple' && (
                      question.answers.map((answer, index) => (
                        <div key={index}>
                          <Form.Check
                            inline
                            label={
                              <>
                                {answer.description}
                                {answer.value && (
                                  <Badge className="ml-2" pill variant="warning">{translate('question.answer_value')}: {answer.value}</Badge>
                                )}
                              </>
                            }
                            type='radio'
                            checked={questionnaire.answers.find(patientAnswer => patientAnswer.answer === answer.id)}
                            disabled
                          />
                        </div>
                      ))
                    )
                  }
                  {
                    question.type === 'open-text' && (
                      <div className="ml-1">
                        <Form.Group controlId='formValue'>
                          <Form.Control
                            disabled
                            as="textarea"
                            value={answerValue(question.id)}
                          />
                        </Form.Group>
                      </div>
                    )
                  }
                  {
                    question.type === 'open-number' && (
                      <div className="ml-1">
                        <Form.Group controlId='formValue'>
                          <Form.Control
                            disabled
                            type="number"
                            value={answerValue(question.id)}
                          />
                        </Form.Group>
                        {question.answers.map((answer, index) => (
                          <div key={index}>
                            {answer.value && (
                              <Badge pill variant="warning">{translate('question.answer_value')}: {answer.value}</Badge>
                            )}
                            {answer.threshold && (
                              <Badge className="ml-1" pill variant="danger">{translate('question.answer_threshold')}: {answer.threshold}</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  }
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      ))
      }
    </Dialog>
  );
};

ViewQuestion.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  questionnaire: PropTypes.array
};

export default ViewQuestion;

const ContextAwareToggle = ({ eventKey }) => {
  const currentEventKey = useContext(AccordionContext);

  if (currentEventKey === eventKey) {
    return <BsChevronDown className="ml-auto" />;
  }

  return <BsChevronRight className="ml-auto" />;
};

ContextAwareToggle.propTypes = {
  eventKey: PropTypes.string
};
