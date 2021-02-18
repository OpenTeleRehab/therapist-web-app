import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate, withLocalize } from 'react-localize-redux';
import {
  Button,
  Card,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { FiTwitch } from 'react-icons/fi';

import { Questionnaire } from 'services/questionnaire';
import { useSelector } from 'react-redux';
import { BsX } from 'react-icons/bs';

const ListQuestionnaireCard = ({ materialIds, onSelectionRemove, readyOnly, lang }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [questionnaires, setQuestionnaires] = useState([]);

  useEffect(() => {
    if (materialIds && materialIds.length > 0) {
      Questionnaire.getQuestionnairesByIds(materialIds, lang).then(res => {
        if (res.data) {
          setQuestionnaires(res.data);
        }
      });
    } else {
      setQuestionnaires([]);
    }
  }, [materialIds, lang]);

  return (
    <>
      { questionnaires.map(questionnaire => (
        <Card key={questionnaire} className="exercise-card material-card shadow-sm mb-4">
          <div className="card-img bg-light">
            {
              onSelectionRemove && (
                <div className="position-absolute w-100">
                  {!readyOnly &&
                  <Button
                    className="btn-circle-sm float-right m-1"
                    variant="light"
                    onClick={() => onSelectionRemove(questionnaire.id)}
                  >
                    <BsX size={15} />
                  </Button>
                  }
                </div>
              )
            }
            <div className="w-100 h-100 px-2 py-4 text-center questionnaire-header">
              <FiTwitch size={80} />
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
        </Card>
      ))}
    </>
  );
};

ListQuestionnaireCard.propTypes = {
  materialIds: PropTypes.array,
  onSelectionRemove: PropTypes.func,
  readyOnly: PropTypes.bool,
  lang: PropTypes.string
};

export default withLocalize(ListQuestionnaireCard);
