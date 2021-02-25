import React, { useContext } from 'react';
import Dialog from 'components/Dialog';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { Accordion, AccordionContext, Card, Form } from 'react-bootstrap';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';

const ViewQuestionnaire = ({ show, handleClose, questionnaire }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <Dialog
      show={show}
      scrollable={true}
      title={questionnaire.title}
      onCancel={handleClose}
      cancelLabel={translate('common.close')}
      className="mt-3"
    >
      <div className="d-flex flex-column mb-2">
        <span className="font-weight-bold">{translate('questionnaire.description')}</span>
        <span>{questionnaire.description}</span>
      </div>
      <div className="d-flex flex-column mb-3">
        <span className="font-weight-bold">{translate('questionnaire.number_of_question')}</span>
        <span>{questionnaire.questions.length}</span>
      </div>
      {questionnaire.questions.map((question, index) => (
        <Accordion key={index}>
          <Card className="mb-3 question-card">
            <Accordion.Toggle as={Card.Header} eventKey={index + 1} className="card-header view-question-card-header d-flex justify-content-between">
              <h6>{translate('questionnaire.question_number', { number: index + 1 })}</h6>
              <ContextAwareToggle eventKey={index + 1} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index + 1}>
              <Card.Body>
                { question.file &&
                  <img src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${question.file.id}`} alt="..." className="img-thumbnail"/>
                }
                <div className="mb-2 mt-2">
                  {question.title}
                </div>
                <div>
                  {
                    question.type === 'checkbox' && (
                      question.answers.map((answer, index) => (
                        <div key={index}>
                          <Form.Check
                            inline label={answer.description}
                            type='checkbox'
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
                            inline label={answer.description}
                            type='radio'
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
                            type="text"
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
                          />
                        </Form.Group>
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

ViewQuestionnaire.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  questionnaire: PropTypes.array
};

export default ViewQuestionnaire;

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
