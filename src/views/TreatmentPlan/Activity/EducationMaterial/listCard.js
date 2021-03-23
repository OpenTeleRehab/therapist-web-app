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

import { BsX, BsHeart, BsHeartFill, BsPerson } from 'react-icons/bs';

import { EducationMaterial } from 'services/educationMaterial';
import { useSelector } from 'react-redux';
import ViewEducationMaterial from './viewEducationMaterial';

const ListEducationMaterialCard = ({ materialIds, materialObjs, onSelectionRemove, readOnly, lang, therapistId }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [materials, setMaterials] = useState([]);
  const [ids] = materialIds;
  const [viewMaterial, setViewMaterial] = useState(false);
  const [material, setMaterial] = useState([]);

  useEffect(() => {
    if (materialObjs && materialObjs.length > 0) {
      setMaterials(materialObjs);
    } else if (materialIds && materialIds.length > 0) {
      EducationMaterial.getEducationMaterialsByIds(materialIds, lang, therapistId).then(res => {
        if (res.data) {
          setMaterials(res.data);
        }
      });
    } else {
      setMaterials([]);
    }
  }, [ids, materialIds, lang, materialObjs, therapistId]);

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
              {therapistId === material.therapist_id && (
                <div className="owner-btn">
                  <BsPerson size={20} />
                </div>
              )}
              {
                onSelectionRemove && (
                  <div className="card-remove-btn-wrapper">
                    {!readOnly && <Button
                      className="btn-circle-sm m-1"
                      variant="light"
                      onClick={() => onSelectionRemove(material.id)}
                    >
                      <BsX size={15} />
                    </Button>
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
                      ? <h5 className="card-title">{ material.title }</h5>
                      : (
                        <OverlayTrigger
                          overlay={<Tooltip id="button-tooltip-2">{ material.title }</Tooltip>}
                        >
                          <h5 className="card-title">{ material.title }</h5>
                        </OverlayTrigger>
                      )
                  }
                </Card.Title>
                <Card.Text>
                  {translate(material.file.fileGroupType)}
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
  therapistId: PropTypes.string
};

export default withLocalize(ListEducationMaterialCard);
