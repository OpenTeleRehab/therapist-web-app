import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate, withLocalize } from 'react-localize-redux';
import {
  Button,
  Card,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

import { Questionnaire } from 'services/questionnaire';
import { useSelector } from 'react-redux';
import { BsX, BsHeartFill, BsHeart, BsPerson } from 'react-icons/bs';
import ViewQuestionnaire from './viewQuestionnaire';

const ListQuestionnaireCard = ({ questionnaireIds, questionnaireObjs, onSelectionRemove, readOnly, lang, therapistId }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [ids] = questionnaireIds;
  const [questionnaire, setQuestionnaire] = useState([]);
  const [viewQuestionnaire, setViewQuestionnaire] = useState(false);

  useEffect(() => {
    if (questionnaireObjs && questionnaireObjs.length > 0) {
      setQuestionnaires(questionnaireObjs);
    } else if (questionnaireIds && questionnaireIds.length > 0) {
      Questionnaire.getQuestionnairesByIds(questionnaireIds, lang, therapistId).then(res => {
        if (res.data) {
          setQuestionnaires(res.data);
        }
      });
    } else {
      setQuestionnaires([]);
    }
  }, [ids, questionnaireIds, lang, questionnaireObjs, therapistId]);

  const handleViewQuestionnaire = (questionnaire) => {
    setViewQuestionnaire(true);
    setQuestionnaire(questionnaire);
  };

  const handleViewQuestionnaireClose = () => {
    setViewQuestionnaire(false);
  };

  return (
    <>
      { questionnaires.map(questionnaire => (
        <div key={questionnaire.id} className="position-relative">
          <Card className="exercise-card material-card shadow-sm mb-4">
            <div className="top-bar">
              <div className="favorite-btn btn-link">
                {questionnaire.is_favorite
                  ? <BsHeartFill size={20} />
                  : <BsHeart size={20} />
                }
              </div>
              {therapistId === questionnaire.therapist_id && (
                <div className="owner-btn">
                  <BsPerson size={20} />
                </div>
              )}
              {
                onSelectionRemove && (
                  <div className="card-remove-btn-wrapper">
                    {!readOnly && <Button
                      className="btn-circle-sm m-1"
                      variant="light"
                      onClick={() => onSelectionRemove(questionnaire.id)}
                    >
                      <BsX size={15} />
                    </Button>
                    }
                  </div>
                )
              }
            </div>
            <div className="card-container" onClick={() => handleViewQuestionnaire(questionnaire)}>
              <div className="card-img bg-light">
                <div className="w-100 h-100 px-2 py-4 text-center questionnaire-header">
                  <img src={'/images/questionnaire.svg'} alt='questionnaire' />
                  <p>{translate('activity.questionnaire').toUpperCase()}</p>
                </div>
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title>
                  {
                    questionnaire.title.length <= 50
                      ? <h5 className="card-title">{ questionnaire.title }</h5>
                      : (
                        <OverlayTrigger
                          overlay={<Tooltip id="button-tooltip-2">{ questionnaire.title }</Tooltip>}
                        >
                          <h5 className="card-title">{ questionnaire.title }</h5>
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
      ))}
      { viewQuestionnaire && <ViewQuestionnaire show={viewQuestionnaire} questionnaire={questionnaire} handleClose={handleViewQuestionnaireClose}/> }
    </>
  );
};

ListQuestionnaireCard.propTypes = {
  questionnaireIds: PropTypes.array,
  questionnaireObjs: PropTypes.array,
  onSelectionRemove: PropTypes.func,
  readOnly: PropTypes.bool,
  lang: PropTypes.any,
  therapistId: PropTypes.string
};

export default withLocalize(ListQuestionnaireCard);
