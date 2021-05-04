import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import { BiChevronLeftCircle } from 'react-icons/bi';
import { useSelector } from 'react-redux';

import ListExerciseCard from 'views/TreatmentPlan/Activity/Exercise/listCard';
import ListEducationMaterialCard from 'views/TreatmentPlan/Activity/EducationMaterial/listCard';
import ListQuestionnaireCard from 'views/TreatmentPlan/Activity/Questionnaire/listCard';

const PreviewList = ({
  selectedExercises, selectedMaterials, selectedQuestionnaires,
  onExerciseRemove, onMaterialRemove, onQuestionnaireRemove, setShowPreview, showPreview, isOwnCreated,
  originData, day, week
}) => {
  const { profile } = useSelector((state) => state.auth);

  const handleShow = () => {
    setShowPreview(!showPreview);
  };

  useEffect(() => {
    if (!selectedExercises.length && !selectedMaterials.length && !selectedQuestionnaires.length) {
      setShowPreview(false);
    }
    // eslint-disable-next-line
  }, [selectedExercises, selectedMaterials, selectedQuestionnaires]);

  return (
    <>
      <div className="position-absolute p-2 show-select-exercise-button">
        <BiChevronLeftCircle size={25} onClick={handleShow}/>
      </div>
      { showPreview &&
        <div className="position-absolute w-25 selected-exercise-wrapper">
          <ListExerciseCard exerciseIds={selectedExercises} onSelectionRemove={onExerciseRemove} therapistId={profile.id} isOwnCreated={isOwnCreated} originData={originData} day={day} week={week}/>
          <ListEducationMaterialCard materialIds={selectedMaterials} onSelectionRemove={onMaterialRemove} therapistId={profile.id} isOwnCreated={isOwnCreated} originData={originData} day={day} week={week}/>
          <ListQuestionnaireCard questionnaireIds={selectedQuestionnaires} onSelectionRemove={onQuestionnaireRemove} therapistId={profile.id} isOwnCreated={isOwnCreated} originData={originData} day={day} week={week} />
        </div>
      }
    </>
  );
};

PreviewList.propTypes = {
  translate: PropTypes.func,
  selectedExercises: PropTypes.array,
  selectedMaterials: PropTypes.array,
  selectedQuestionnaires: PropTypes.array,
  onExerciseRemove: PropTypes.func,
  onMaterialRemove: PropTypes.func,
  onQuestionnaireRemove: PropTypes.func,
  setShowPreview: PropTypes.func,
  showPreview: PropTypes.bool,
  isOwnCreated: PropTypes.bool,
  originData: PropTypes.array,
  day: PropTypes.number,
  week: PropTypes.number
};

export default withLocalize(PreviewList);
