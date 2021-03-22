import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  Row,
  Col,
  Card,
  Form,
  Tooltip,
  OverlayTrigger,
  Button
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { BsSearch, BsX, BsHeart, BsHeartFill } from 'react-icons/bs';
import { IoPerson } from 'react-icons/io5';

import Pagination from 'components/Pagination';
import Spinner from 'react-bootstrap/Spinner';

import { MdDescription } from 'react-icons/md';
import { getEducationMaterials } from 'store/educationMaterial/actions';
import ViewEducationMaterial from './viewEducationMaterial';

let timer = null;
const EducationMaterial = ({ translate, selectedMaterials, onSectionChange, viewEducationMaterial, setViewEducationMaterial }) => {
  const dispatch = useDispatch();
  const { loading, educationMaterials, filters } = useSelector(state => state.educationMaterial);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formFields, setFormFields] = useState({
    search_value: ''
  });

  const languages = useSelector(state => state.language.languages);
  const [language, setLanguage] = useState('');
  const { profile } = useSelector((state) => state.auth);
  const [educationMaterial, setEducationMaterial] = useState([]);
  const [therapistId, setTherapistId] = useState('');

  useEffect(() => {
    if (filters && filters.lang) {
      setLanguage(filters.lang);
    } else if (profile && profile.language_id) {
      setLanguage(profile.language_id);
    }
  }, [filters, profile]);

  useEffect(() => {
    if (profile !== undefined) {
      setTherapistId(profile.id);
    }
  }, [profile]);

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getEducationMaterials({
        filter: formFields,
        page_size: pageSize,
        lang: language,
        page: currentPage,
        therapist_id: therapistId
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }, 500);
  }, [language, formFields, currentPage, pageSize, dispatch, therapistId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
  };

  const handleLanguageChange = e => {
    const { value } = e.target;
    setLanguage(value);
  };

  const handleViewEducationMaterial = (educationMaterial) => {
    setViewEducationMaterial(true);
    setEducationMaterial(educationMaterial);
  };

  const handleViewEducationMaterialClose = () => {
    setViewEducationMaterial(false);
  };

  return (
    <>
      <Row>
        <Col sm={5} md={4} lg={3}>
          <Card bg="info">
            <Card.Header>
              <Form.Group className="search-box-with-icon">
                <BsSearch className="search-icon" />
                <Button
                  variant="light"
                  className="clear-btn"
                  onClick={handleClearSearch}
                >
                  <BsX size={18} />
                </Button>
                <Form.Control
                  name="search_value"
                  value={formFields.search_value}
                  onChange={handleChange}
                  placeholder={translate('education_material.search')}
                />
              </Form.Group>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>{translate('common.category')}</Form.Label>
                <Form.Control as="select" disabled>
                  <option>{translate('common.category_item')}</option>
                  <option>{translate('common.category_item')}</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>{translate('common.category')}</Form.Label>
                <Form.Control as="select" disabled>
                  <option>{translate('common.category_item')}</option>
                  <option>{translate('common.category_item')}</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>{translate('common.category')}</Form.Label>
                <Form.Control as="select" disabled>
                  <option>{translate('common.category_item')}</option>
                  <option>{translate('common.category_item')}</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>{translate('common.language')}</Form.Label>
                <Form.Control as="select" value={language} onChange={handleLanguageChange}>
                  {languages.map((language, index) => (
                    <option key={index} value={language.id}>
                      {language.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={7} md={8} lg={9}>
          { educationMaterials.length === 0 && (
            <div className="card h-100 d-flex justify-content-center align-items-center">
              <big className="text-muted">{translate('common.no_data')}</big>
            </div>
          )}
          { educationMaterials.length > 0 && (
            <>
              <Row>
                { educationMaterials.map(material => (
                  <Col key={material.id} md={6} lg={3}>
                    <Card className="exercise-card material-card shadow-sm mb-4">
                      <div className="top-bar">
                        <div className="favorite-btn btn-link">
                          {material.is_favorite
                            ? <BsHeartFill size={25} />
                            : <BsHeart size={25} />
                          }
                        </div>
                        {therapistId === material.therapist_id && (
                          <div className="owner-btn">
                            <IoPerson size={20} />
                          </div>
                        )}
                        <Form.Check
                          type="checkbox"
                          className="float-right action"
                          checked={selectedMaterials.includes(material.id)}
                          onChange={(e) => onSectionChange(e.currentTarget.checked, material.id)}
                        />
                      </div>
                      <div className="card-container" onClick={() => handleViewEducationMaterial(material)}>
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
                  </Col>
                ))}
              </Row>

              <Pagination
                totalCount={totalCount}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageSizes={[8, 16, 24, 32, 40]}
              />
            </>
          )}
          { loading && <Spinner className="loading-icon" animation="border" variant="primary" /> }
          { viewEducationMaterial && <ViewEducationMaterial showView={viewEducationMaterial} handleViewClose={handleViewEducationMaterialClose} educationMaterial={educationMaterial} />}
        </Col>
      </Row>
    </>
  );
};

EducationMaterial.propTypes = {
  translate: PropTypes.func,
  selectedMaterials: PropTypes.array,
  onSectionChange: PropTypes.func,
  viewEducationMaterial: PropTypes.bool,
  setViewEducationMaterial: PropTypes.func
};

export default withLocalize(EducationMaterial);
