import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate, withLocalize } from 'react-localize-redux';
import {
  Button,
  Card,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {
  BsX,
  BsHeart,
  BsHeartFill,
  BsPersonFill
} from 'react-icons/bs';
import { MdDescription } from 'react-icons/md';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import ViewEducationMaterial from './viewEducationMaterial';
import { MATERIAL_TYPE } from 'variables/activity';
import CardPlaceholder from '../_Partials/cardPlaceholder';

const ListEducationMaterialCard = ({ materialIds, onSelectionRemove, readOnly, therapistId, isOwnCreated, treatmentPlanSelectedMaterials, originData, day, week }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [viewMaterial, setViewMaterial] = useState(false);
  const [material, setMaterial] = useState([]);
  const [treatmentPlanMaterials, setTreatmentPlanMaterials] = useState([]);
  const { previewData } = useSelector(state => state.treatmentPlan.treatmentPlansDetail);

  useEffect(() => {
    if (treatmentPlanSelectedMaterials && treatmentPlanSelectedMaterials.length > 0) {
      setTreatmentPlanMaterials(treatmentPlanSelectedMaterials);
    } else if (originData && originData.length > 0) {
      const originDayActivity = _.findLast(originData, { week, day });
      setTreatmentPlanMaterials(originDayActivity ? originDayActivity.materials : []);
    } else {
      setTreatmentPlanMaterials([]);
    }
  }, [treatmentPlanSelectedMaterials, originData, week, day]);

  const handleViewMaterial = (material) => {
    setMaterial(material);
    setViewMaterial(true);
  };

  const handleViewMaterialClose = () => {
    setViewMaterial(false);
  };

  return (
    <>
      {materialIds.map(id => {
        const material = previewData && previewData.materials ? _.find(previewData.materials, { id }) : undefined;

        if (!material) {
          return <CardPlaceholder key={id}/>;
        }

        return (
          <div key={id} className="position-relative">
            <Card className="exercise-card material-card shadow-sm mb-4">
              <div className="top-bar">
                <div className="favorite-btn btn-link">
                  {material.is_favorite
                    ? <BsHeartFill size={20} />
                    : <BsHeart size={20} />
                  }
                </div>
                {
                  (onSelectionRemove) && (
                    <div className="card-remove-btn-wrapper">
                      {isOwnCreated && !readOnly ? (
                        <Button
                          aria-label="Remove education material"
                          className="btn-circle-sm"
                          variant="outline-primary"
                          onClick={() => onSelectionRemove(material.id)}
                        >
                          <BsX size={14} />
                        </Button>
                      ) : (
                        <>
                          {(!treatmentPlanMaterials.includes(material.id) || material.created_by === therapistId) && !readOnly &&
                                      <Button
                                        aria-label="Remove education material"
                                        className="btn-circle-sm"
                                        variant="outline-primary"
                                        onClick={() => onSelectionRemove(material.id)}
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
              <div className="card-container" onClick={() => handleViewMaterial(material)}>
                <div className="card-img bg-light">
                  {(material.file && (material.file.hasThumbnail || material.file.fileGroupType === MATERIAL_TYPE.image)) ? (
                    <img
                      className="img-fluid mx-auto d-block"
                      src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${material.file.id}?thumbnail=${material.file.hasThumbnail}`}
                      alt="Material"
                    />
                  ) : (
                    <div className="w-100 h-100 px-2 py-4 text-white bg-primary text-center">
                      <MdDescription size={80} />
                      <p>{translate('activity.material').toUpperCase()}</p>
                    </div>
                  )}
                </div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title>
                    {
                      material.title.length <= 50
                        ? <h5 className="card-title">
                          {therapistId === material.therapist_id && (
                            <BsPersonFill size={20} className="owner-btn mr-1 mb-1" />
                          )}
                          { material.title }
                        </h5>
                        : (
                          <OverlayTrigger
                            overlay={<Tooltip id="button-tooltip-2">{ material.title }</Tooltip>}
                          >
                            <h5 className="card-title">
                              {therapistId === material.therapist_id && (
                                <BsPersonFill size={20} className="owner-btn mr-1 mb-1" />
                              )}
                              { material.title }
                            </h5>
                          </OverlayTrigger>
                        )
                    }
                  </Card.Title>
                  <Card.Text>
                    {material.file ? translate(material.file.fileGroupType) : ''}
                  </Card.Text>
                </Card.Body>
              </div>
            </Card>
          </div>
        );
      })}
      { viewMaterial && <ViewEducationMaterial showView={viewMaterial} handleViewClose={handleViewMaterialClose} educationMaterial={material}/> }
    </>
  );
};

ListEducationMaterialCard.propTypes = {
  materialIds: PropTypes.array,
  onSelectionRemove: PropTypes.func,
  readOnly: PropTypes.bool,
  therapistId: PropTypes.number,
  isOwnCreated: PropTypes.bool,
  treatmentPlanSelectedMaterials: PropTypes.array,
  originData: PropTypes.array,
  day: PropTypes.number,
  week: PropTypes.number
};

export default withLocalize(ListEducationMaterialCard);
