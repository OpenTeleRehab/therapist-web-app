import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import { BiChevronLeftCircle } from 'react-icons/bi';
import { useSelector } from 'react-redux';

import ListExerciseCard from 'views/TreatmentPlan/Activity/Exercise/listCard';
import ListEducationMaterialCard from 'views/TreatmentPlan/Activity/EducationMaterial/listCard';
import ListQuestionnaireCard from 'views/TreatmentPlan/Activity/Questionnaire/listCard';

const PreviewList = ({
  selectedExercises, selectedMaterials, selectedQuestionnaires,
  onExerciseRemove, onMaterialRemove, onQuestionnaireRemove
}) => {
  const [isShow, setIsShow] = useState(false);
  const { profile } = useSelector((state) => state.auth);

  const handleShow = () => {
    setIsShow(!isShow);
  };

  return (
    <>
      <div className="position-absolute p-2 show-select-exercise-button">
        <BiChevronLeftCircle size={25} onClick={handleShow}/>
      </div>
      { isShow &&
        <div className="position-absolute w-25 selected-exercise-wrapper">
          <ListExerciseCard exerciseIds={selectedExercises} onSelectionRemove={onExerciseRemove} therapistId={profile.id} />
          <ListEducationMaterialCard materialIds={selectedMaterials} onSelectionRemove={onMaterialRemove} therapistId={profile.id} />
          <ListQuestionnaireCard questionnaireIds={selectedQuestionnaires} onSelectionRemove={onQuestionnaireRemove} therapistId={profile.id} />
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
  onQuestionnaireRemove: PropTypes.func
};

export default withLocalize(PreviewList);
