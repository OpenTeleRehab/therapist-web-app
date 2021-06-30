import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { Row, Col } from 'react-bootstrap';

import { BiChevronLeftCircle, BiChevronRightCircle } from 'react-icons/bi';
import { useSelector } from 'react-redux';

import ListExerciseCard from '../../TreatmentPlan/Activity/Exercise/listCard';
import ListEducationMaterialCard from '../../TreatmentPlan/Activity/EducationMaterial/listCard';
import ListQuestionnaireCard from '../../TreatmentPlan/Activity/Questionnaire/listCard';
import { Button } from 'react-bootstrap/esm/index';
import * as ROUTES from '../../../variables/routes';
import { useHistory } from 'react-router-dom';

const PreviewList = ({
  selectedExercises, selectedMaterials, selectedQuestionnaires,
  onExerciseRemove, onMaterialRemove, onQuestionnaireRemove, showPreviewList
}) => {
  const [isShow, setIsShow] = useState(false);
  const { profile } = useSelector((state) => state.auth);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();

  const [activity, setActivity] = useState();

  useEffect(() => {
    if (selectedExercises.length || selectedMaterials.length || selectedQuestionnaires.length) {
      setIsShow(true);
      showPreviewList(true);
    } else {
      setIsShow(false);
      showPreviewList(false);
    }
  }, [selectedExercises, selectedMaterials, selectedQuestionnaires, showPreviewList]);

  const handleShow = () => {
    setIsShow(!isShow);
    showPreviewList(!isShow);
  };

  useEffect(() => {
    setActivity({
      week: 1,
      day: 1,
      exercises: selectedExercises,
      materials: selectedMaterials,
      questionnaires: selectedQuestionnaires
    });
  }, [selectedExercises, selectedMaterials, selectedQuestionnaires]);

  const handleCreate = () => {
    history.push({ pathname: ROUTES.LIBRARY_TREATMENT_PLAN_CREATE, state: { activity: activity } });
  };

  return (
    <>
      <Row>
        <Col sm={5} md={4} lg={2} className={`library-preview pr-0 ${isShow ? 'show' : ''}`}>
          <div className="library-preview-header">
            <span className="icon">
              {isShow
                ? <BiChevronRightCircle size={26} onClick={handleShow} />
                : <BiChevronLeftCircle size={26} onClick={handleShow} />
              }
            </span>
          </div>
          { isShow &&
            <div className="library-preview-body">
              <ListExerciseCard exerciseIds={selectedExercises} onSelectionRemove={onExerciseRemove} therapistId={profile.id} />
              <ListEducationMaterialCard materialIds={selectedMaterials} onSelectionRemove={onMaterialRemove} therapistId={profile.id} />
              <ListQuestionnaireCard questionnaireIds={selectedQuestionnaires} onSelectionRemove={onQuestionnaireRemove} therapistId={profile.id} />
              {(selectedExercises.length > 0 || selectedMaterials.length > 0 || selectedQuestionnaires.length > 0) &&
                <Button className="btn-block" onClick={handleCreate}>{translate('patient.create_treatment')}</Button>
              }
            </div>
          }
        </Col>
      </Row>
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
  showPreviewList: PropTypes.func
};

export default withLocalize(PreviewList);
