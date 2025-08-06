import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate, withLocalize } from 'react-localize-redux';
import {
  Button,
  Card,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import _ from 'lodash';

import { useSelector } from 'react-redux';
import { BsX, BsHeartFill, BsHeart, BsPersonFill } from 'react-icons/bs';
import ViewQuestionnaire from './viewQuestionnaire';
import CardPlaceholder from '../_Partials/cardPlaceholder';

const ListQuestionnaireCard = ({ questionnaireIds, onSelectionRemove, readOnly, therapistId, isOwnCreated, treatmentPlanSelectedQuestionnaires, day, week, originData }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [questionnaire, setQuestionnaire] = useState([]);
  const [viewQuestionnaire, setViewQuestionnaire] = useState(false);
  const [treatmentPlanQuestionnaires, setTreatmentPlanQuestionnaires] = useState([]);
  const { previewData } = useSelector(state => state.treatmentPlan.treatmentPlansDetail);

  useEffect(() => {
    if (treatmentPlanSelectedQuestionnaires && treatmentPlanSelectedQuestionnaires.length > 0) {
      setTreatmentPlanQuestionnaires(treatmentPlanSelectedQuestionnaires);
    } else if (originData && originData.length > 0) {
      const originDayActivity = _.findLast(originData, { week, day });
      setTreatmentPlanQuestionnaires(originDayActivity ? originDayActivity.questionnaires : []);
    } else {
      setTreatmentPlanQuestionnaires([]);
    }
  }, [treatmentPlanSelectedQuestionnaires, originData, week, day]);

  const handleViewQuestionnaire = (questionnaire) => {
    setViewQuestionnaire(true);
    setQuestionnaire(questionnaire);
  };

  const handleViewQuestionnaireClose = () => {
    setViewQuestionnaire(false);
  };

  return (
    <>
      {questionnaireIds.map(id => {
        const questionnaire = previewData && previewData.questionnaires ? _.find(previewData.questionnaires, { id }) : undefined;

        if (!questionnaire) {
          return <CardPlaceholder key={id}/>;
        }

        return (
          <div key={id} className="position-relative">
            <Card className="exercise-card material-card shadow-sm mb-4">
              <div className="top-bar">
                <div className="favorite-btn btn-link">
                  {questionnaire.is_favorite
                    ? <BsHeartFill size={20} />
                    : <BsHeart size={20} />
                  }
                </div>
                {
                  (onSelectionRemove) && (
                    <div className="card-remove-btn-wrapper">
                      {isOwnCreated && !readOnly ? (
                        <Button
                          aria-label="Remove questionnaire"
                          className="btn-circle-sm"
                          variant="outline-primary"
                          onClick={() => onSelectionRemove(questionnaire.id)}
                        >
                          <BsX size={14} />
                        </Button>
                      ) : (
                        <>
                          {(!treatmentPlanQuestionnaires.includes(questionnaire.id) || questionnaire.created_by === therapistId) && !readOnly &&
                                      <Button
                                        aria-label="Remove questionnaire"
                                        className="btn-circle-sm"
                                        variant="outline-primary"
                                        onClick={() => onSelectionRemove(questionnaire.id)}
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
              <div className="card-container" onClick={() => handleViewQuestionnaire(questionnaire)}>
                <div className="card-img bg-light">
                  <div className="w-100 h-100 px-2 py-4 text-center questionnaire-header">
                    <img src={'/images/questionnaire.svg'} alt='questionnaire' loading="lazy"/>
                    <p>{translate('activity.questionnaire').toUpperCase()}</p>
                  </div>
                </div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title>
                    {
                      questionnaire.title.length <= 50
                        ? <h5 className="card-title">
                          {therapistId === questionnaire.therapist_id && (
                            <BsPersonFill size={20} className="owner-btn mr-1 mb-1" />
                          )}
                          { questionnaire.title }
                        </h5>
                        : (
                          <OverlayTrigger
                            overlay={<Tooltip id="button-tooltip-2">{ questionnaire.title }</Tooltip>}
                          >
                            <h5 className="card-title">
                              {therapistId === questionnaire.therapist_id && (
                                <BsPersonFill size={20} className="owner-btn mr-1 mb-1" />
                              )}
                              { questionnaire.title }
                            </h5>
                          </OverlayTrigger>
                        )
                    }
                  </Card.Title>
                  <Card.Text>
                    <b>{questionnaire.questions.length}</b> {translate('activity.questionnaire.questions')}
                  </Card.Text>
                </Card.Body>
              </div>
            </Card>
          </div>
        );
      })}
      { viewQuestionnaire && <ViewQuestionnaire show={viewQuestionnaire} id={questionnaire.id} handleClose={handleViewQuestionnaireClose}/> }
    </>
  );
};

ListQuestionnaireCard.propTypes = {
  questionnaireIds: PropTypes.array,
  onSelectionRemove: PropTypes.func,
  readOnly: PropTypes.bool,
  therapistId: PropTypes.number,
  isOwnCreated: PropTypes.bool,
  treatmentPlanSelectedQuestionnaires: PropTypes.array,
  originData: PropTypes.array,
  day: PropTypes.number,
  week: PropTypes.number
};

export default withLocalize(ListQuestionnaireCard);
