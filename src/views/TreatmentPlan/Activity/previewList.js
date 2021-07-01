import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Row, Col } from 'react-bootstrap';

import { BiChevronLeftCircle, BiChevronRightCircle } from 'react-icons/bi';
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
  const [previewListHeight, setPreviewListHeight] = useState('');

  const handleShow = () => {
    setShowPreview(!showPreview);
  };

  useEffect(() => {
    if (!selectedExercises.length && !selectedMaterials.length && !selectedQuestionnaires.length) {
      setShowPreview(false);
    }
    // eslint-disable-next-line
  }, [selectedExercises, selectedMaterials, selectedQuestionnaires]);

  useEffect(() => {
    if (showPreview) {
      const modalBody = document.getElementsByClassName('modal-body');
      setPreviewListHeight(modalBody[0].scrollHeight);
    }
  }, [showPreview]);

  return (
    <Row>
      <Col sm={5} md={4} lg={2} className={`library-preview pr-0 ${showPreview ? 'show' : ''}`}>
        <div className="library-preview-header mt-3">
          <span className="icon">
            {showPreview
              ? <BiChevronRightCircle size={26} onClick={handleShow} />
              : <BiChevronLeftCircle size={26} onClick={handleShow} />
            }
          </span>
        </div>
        { showPreview &&
          <div className="library-preview-body" style={{ height: previewListHeight }}>
            <ListExerciseCard exerciseIds={selectedExercises} onSelectionRemove={onExerciseRemove} therapistId={profile.id} isOwnCreated={isOwnCreated} originData={originData} day={day} week={week}/>
            <ListEducationMaterialCard materialIds={selectedMaterials} onSelectionRemove={onMaterialRemove} therapistId={profile.id} isOwnCreated={isOwnCreated} originData={originData} day={day} week={week}/>
            <ListQuestionnaireCard questionnaireIds={selectedQuestionnaires} onSelectionRemove={onQuestionnaireRemove} therapistId={profile.id} isOwnCreated={isOwnCreated} originData={originData} day={day} week={week} />
          </div>
        }
      </Col>
    </Row>
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
