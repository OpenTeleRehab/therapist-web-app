import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import CustomTable from '../../../components/Table';

const QuestionnaireTab = ({ activities }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [questionnaires, setQuestionnaires] = useState([]);

  useEffect(() => {
    if (activities.length) {
      const questionnaires = activities.filter(activity => activity.type === 'questionnaire' && activity.completed);
      setQuestionnaires(questionnaires);
    }
  }, [activities]);

  const columns = [
    { name: 'submitted_date', title: translate('questionnaire.submitted_date') },
    { name: 'title', title: translate('questionnaire.title') + '/' + translate('questionnaire.description') },
    { name: 'number_of_question', title: translate('questionnaire.number_of_question') }
  ];

  return (
    <div className="mt-3">
      <CustomTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hideSearchFilter={true}
        columns={columns}
        remotePaging={false}
        rows={questionnaires.map(questionnaire => {
          return {
            title: <span
              className="questionnaire-title"
              dangerouslySetInnerHTML={{
                __html: `<strong class="title">${questionnaire.title}</strong><div class="description">${questionnaire.description}</div>`
              }}
            />,
            number_of_question: questionnaire.questions.length
          };
        })}
      />
    </div>
  );
};
QuestionnaireTab.propTypes = {
  activities: PropTypes.array
};

export default QuestionnaireTab;
