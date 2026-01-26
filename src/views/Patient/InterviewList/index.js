import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BackButton from '../Partials/backButton';
import Dialog from 'components/Dialog';
import { getTranslate } from 'react-localize-redux';
import settings from 'settings';
import { END_POINTS } from 'variables/endPoint';
import { useList } from 'hooks/useList';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import moment from 'moment';
import QuestionRenderer from '../../../components/ScreeningQuestionnaire/QuestionRenderer';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from 'react-bootstrap';

const calculateScoreBySection = (section, answers) => {
  let totalScore = 0;

  section?.questions?.forEach((question) => {
    // Find answer for this question
    const answerObj = Array.isArray(answers)
      ? answers.find((answer) => answer.question_id === question.id)
      : null;

    if (!answerObj) return;

    const { answer } = answerObj;

    switch (question.question_type) {
      case 'radio':
      case 'checkbox': {
        const selectedOptionIds = Array.isArray(answer) ? answer : [answer];

        selectedOptionIds.forEach((optionId) => {
          const option = question.options.find((opt) => opt.id === Number(optionId));

          if (option && option.option_point) {
            totalScore += option.option_point;
          }
        });
        break;
      }

      case 'open-number': {
        const optionPoint = question.options?.[0]?.option_point;
        if (optionPoint && answer) {
          totalScore += Number(optionPoint);
        }
        break;
      }

      case 'rating': {
        if (answer) {
          totalScore += Number(answer);
        }
        break;
      }
      // Note, Open Text => No Score
      default:
        break;
    }
  });

  return totalScore;
};

const mapScore = (sectionTotalScore, actions) => {
  if (!actions) return null;
  const match = actions.find(
    (item) => sectionTotalScore >= item.from && sectionTotalScore <= item.to,
  );

  return match ? match.action_text : null;
};

const InterviewHistory = () => {
  const { patientId } = useParams();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [showDetail, setShowDetail] = useState(false);
  const [step, setStep] = useState(0);
  const { data: interviewHistorys } = useList(END_POINTS.INTERVIEW_HISTORY, { user_id: patientId });
  const [interviewHistoryDetail, setInterviewHistoryDetail] = useState();
  const methods = useForm();
  const { reset } = methods;
  const currentQuestionnaire = interviewHistoryDetail?.questionnaire;
  const currentAnswers = interviewHistoryDetail?.answers;
  const currentSection = currentQuestionnaire?.sections[step];
  const totalScore = currentSection ? calculateScoreBySection(currentSection, JSON.parse(currentAnswers)) : 0;
  const actionText = currentSection ? mapScore(totalScore, currentSection.actions) : null;

  useEffect(() => {
    if (currentAnswers) {
      try {
        const parsedAnswers = Array.isArray(currentAnswers) ? currentAnswers : JSON.parse(currentAnswers);
        const formValues = {};
        parsedAnswers.forEach((ans) => {
          formValues[`question_${ans.question_id}`] = ans.answer;
        });
        reset(formValues);
      } catch (e) {
        console.error('Failed to parse answers', e);
      }
    }
  }, [currentAnswers, reset]);

  const handleNext = () => {
    if (step < currentQuestionnaire.sections.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <>
      <div className='mt-4 d-flex'>
        <h5>{translate('common.interview_history')}</h5>
        <BackButton />
      </div>
      <div className='mt-4'>
        {interviewHistorys?.data?.length > 0
          ? interviewHistorys?.data?.map((interviewHistory) => {
            const TotalScoreFirstSection = calculateScoreBySection(interviewHistory.questionnaire.sections[0], JSON.parse(interviewHistory.answers));
            return (
              <div
                key={interviewHistory.id}
                onClick={() => {
                  setInterviewHistoryDetail(interviewHistory);
                  setShowDetail(true);
                  setStep(0);
                }}
                className="card p-3 mb-2"
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex justify-content-between">
                  <p className="m-0">
                    {interviewHistory.questionnaire.title}
                  </p>
                  <p className="m-0">
                    {mapScore(TotalScoreFirstSection, interviewHistory.questionnaire.sections[0].actions)}
                  </p>
                </div>
                <div className="d-flex">
                  <p className="m-0">
                  ( {moment(interviewHistory.created_at).format(settings.date_format)} )
                  </p>
                </div>
              </div>
            );
          })
          : <div className="d-flex justify-content-center align-items-center">
            <big className="text-muted">{translate('common.no_data')}</big>
          </div>
        }
      </div>

      <Dialog
        show={showDetail}
        title={currentQuestionnaire?.title}
        onCancel={() => setShowDetail(false)}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '10px' }}>
          {currentSection && (
            <div>
              <h6 className="font-weight-bold mb-3">{currentSection?.title}</h6>
              <FormProvider {...methods}>
                {currentSection.questions.map((question) => (
                  <QuestionRenderer
                    key={question.id}
                    question={question}
                    disabled
                  />
                ))}
              </FormProvider>
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="font-weight-bold text-center">
                  {translate('phc.interview_summary_information')}
                </h6>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span>{currentSection.title}</span>
                  <span className="font-weight-bold">
                    {translate('phc.interview_total_score', { total_score: totalScore })}
                  </span>
                </div>
                {actionText && (
                  <div className="alert alert-info mt-2 text-center mb-0">
                    {actionText}
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <Button
                  variant="outline-dark"
                  disabled={step === 0}
                  onClick={handleBack}
                >
                  {translate('common.back')}
                </Button>
                <span className="font-weight-bold">
                  {step + 1} / {currentQuestionnaire?.sections?.length}
                </span>
                <Button
                  variant="primary"
                  disabled={step === currentQuestionnaire?.sections?.length - 1}
                  onClick={handleNext}
                >
                  {translate('common.next')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default InterviewHistory;
