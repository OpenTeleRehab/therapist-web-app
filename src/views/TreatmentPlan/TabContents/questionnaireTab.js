import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import CustomTable from '../../../components/Table';
import moment from 'moment/moment';
import settings from '../../../settings';
import { ViewAction } from 'components/ActionIcons';
import ViewQuestion from './viewQuestion';

const QuestionnaireTab = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [show, setShow] = useState(false);
  const [questionnaire, setQuestionnaire] = useState([]);
  const { activities } = useSelector((state) => state.treatmentPlan.treatmentPlansDetail);

  useEffect(() => {
    if (activities.length) {
      const questionnaires = activities.filter(activity => activity.type === 'questionnaire' && activity.completed);
      setQuestionnaires(questionnaires);
    }
  }, [activities]);

  const columns = [
    { name: 'submitted_date', title: translate('questionnaire.submitted_date') },
    { name: 'title', title: translate('questionnaire.title') + '/' + translate('questionnaire.description') },
    { name: 'number_of_question', title: translate('questionnaire.number_of_question') },
    { name: 'score', title: translate('questionnaire.total_score') },
    { name: 'action', title: translate('common.action') }
  ];

  const defaultSoringColumns = [
    { columnName: 'submitted_date', direction: 'desc' }
  ];

  const handleView = (questionnaire) => {
    setQuestionnaire(questionnaire);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className="mt-3">
      {show && <ViewQuestion show={show} handleClose={handleClose} questionnaire={questionnaire}/>}
      <CustomTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hideSearchFilter={true}
        columns={columns}
        defaultSoringColumns={defaultSoringColumns}
        remotePaging={false}
        rows={questionnaires.map(questionnaire => {
          const action = (
            <ViewAction onClick={() => handleView(questionnaire)}/>
          );
          return {
            submitted_date: questionnaire.submitted_date ? moment(questionnaire.submitted_date).format(settings.date_format) : '',
            title: <span
              className="questionnaire-title"
              dangerouslySetInnerHTML={{
                __html: `<strong class="title">${questionnaire.title}</strong><div class="description">${questionnaire.description}</div>`
              }}
            />,
            number_of_question: questionnaire.questions.length,
            score: questionnaire.score,
            action
          };
        })
        }
      />
    </div>
  );
};

export default QuestionnaireTab;
