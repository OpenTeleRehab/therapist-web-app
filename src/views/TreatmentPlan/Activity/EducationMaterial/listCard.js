import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate, withLocalize } from 'react-localize-redux';
import {
  Card,
  Form,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { MdDescription } from 'react-icons/md';

import { EducationMaterial } from 'services/educationMaterial';
import { useSelector } from 'react-redux';

const ListEducationMaterialCard = ({ materialIds, onSectionChange }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    if (materialIds && materialIds.length > 0) {
      EducationMaterial.getEducationMaterialsByIds(materialIds).then(res => {
        if (res.data) {
          setMaterials(res.data);
        }
      });
    } else {
      setMaterials([]);
    }
  }, [materialIds]);

  return (
    <>
      { materials.map(material => (
        <Card key={material} className="exercise-card shadow-sm mb-4">
          <div className="card-img bg-light">
            {
              onSectionChange && (
                <div className="position-absolute w-100">
                  <Form.Check
                    type="checkbox"
                    className="float-right action"
                    checked={materialIds.includes(material.id)}
                    onChange={(e) => onSectionChange(e, material.id)}
                  />
                </div>
              )
            }
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
              {material.file.fileExtension}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

ListEducationMaterialCard.propTypes = {
  materialIds: PropTypes.array,
  onSectionChange: PropTypes.func
};

export default withLocalize(ListEducationMaterialCard);
