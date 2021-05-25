import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate, withLocalize } from 'react-localize-redux';
import {
  Button,
  Card,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { MdDescription } from 'react-icons/md';

import {
  BsX,
  BsHeart,
  BsHeartFill,
  BsPersonFill
} from 'react-icons/bs';

import { EducationMaterial } from 'services/educationMaterial';
import { useSelector } from 'react-redux';
import ViewEducationMaterial from './viewEducationMaterial';
import _ from 'lodash';
import { User } from 'services/user';
import { TYPE } from 'variables/activity';

const ListEducationMaterialCard = ({ materialIds, materialObjs, onSelectionRemove, readOnly, lang, therapistId, isOwnCreated, treatmentPlanSelectedMaterials, originData, day, week, showList, treatmentPlanId }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [materials, setMaterials] = useState([]);
  const [viewMaterial, setViewMaterial] = useState(false);
  const [material, setMaterial] = useState([]);
  const [treatmentPlanMaterials, setTreatmentPlanMaterials] = useState([]);

  useEffect(() => {
    if (materialObjs && materialObjs.length > 0) {
      setMaterials(materialObjs);
    } else if (materialIds && materialIds.length > 0) {
      if (showList) {
        User.getActivitiesByIds(materialIds, treatmentPlanId, TYPE.material, day, week, lang, therapistId).then(res => {
          if (res.data) {
            setMaterials(res.data);
          }
        });
      } else {
        EducationMaterial.getEducationMaterialsByIds(materialIds, lang, therapistId).then(res => {
          if (res.data) {
            setMaterials(res.data);
          }
        });
      }
    } else {
      setMaterials([]);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(materialIds), lang, materialObjs, therapistId, day, week, showList, treatmentPlanId]);

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
      { materials.map(material => (
        <div key={material.id} className="position-relative">
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
                        className="btn-circle-sm m-1"
                        variant="light"
                        onClick={() => onSelectionRemove(material.id)}
                      >
                        <BsX size={15} />
                      </Button>
                    ) : (
                      <>
                        {(!treatmentPlanMaterials.includes(material.id) || material.created_by === therapistId) && !readOnly &&
                        <Button
                          className="btn-circle-sm m-1"
                          variant="light"
                          onClick={() => onSelectionRemove(material.id)}
                        >
                          <BsX size={15} />
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
                <div className="w-100 h-100 px-2 py-4 text-white bg-primary text-center">
                  <MdDescription size={80} />
                  <p>{translate('activity.material').toUpperCase()}</p>
                </div>
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
      ))}
      { viewMaterial && <ViewEducationMaterial showView={viewMaterial} handleViewClose={handleViewMaterialClose} educationMaterial={material}/> }
    </>
  );
};

ListEducationMaterialCard.propTypes = {
  materialIds: PropTypes.array,
  materialObjs: PropTypes.array,
  onSelectionRemove: PropTypes.func,
  readOnly: PropTypes.bool,
  lang: PropTypes.any,
  therapistId: PropTypes.number,
  isOwnCreated: PropTypes.bool,
  treatmentPlanSelectedMaterials: PropTypes.array,
  originData: PropTypes.array,
  day: PropTypes.number,
  week: PropTypes.number,
  showList: PropTypes.bool,
  treatmentPlanId: PropTypes.number
};

export default withLocalize(ListEducationMaterialCard);
