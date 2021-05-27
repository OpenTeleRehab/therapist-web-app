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
  Button,
  Accordion
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  BsSearch,
  BsX,
  BsHeart,
  BsHeartFill,
  BsCaretDownFill,
  BsCaretRightFill,
  BsDashSquare,
  BsSquare, BsPersonFill
} from 'react-icons/bs';

import Pagination from 'components/Pagination';
import Spinner from 'react-bootstrap/Spinner';

import { MdDescription } from 'react-icons/md';
import { getEducationMaterials } from 'store/educationMaterial/actions';
import ViewEducationMaterial from './viewEducationMaterial';
import CheckboxTree from 'react-checkbox-tree';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import { FaRegCheckSquare } from 'react-icons/fa';
import _ from 'lodash';

let timer = null;
const EducationMaterial = ({ translate, selectedMaterials, onSectionChange, viewEducationMaterial, setViewEducationMaterial, setShowPreview, isOwnCreated, oldSelectedMaterials }) => {
  const dispatch = useDispatch();
  const { loading, educationMaterials, filters } = useSelector(state => state.educationMaterial);
  const { educationMaterialCategoryTreeData } = useSelector((state) => state.category);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formFields, setFormFields] = useState({
    search_value: '',
    favorites_only: false,
    my_contents_only: false
  });

  const languages = useSelector(state => state.language.languages);
  const [language, setLanguage] = useState('');
  const { profile } = useSelector((state) => state.auth);
  const [educationMaterial, setEducationMaterial] = useState([]);
  const [therapistId, setTherapistId] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);

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
    dispatch(getCategoryTreeData({ type: CATEGORY_TYPES.MATERIAL, lang: language }, CATEGORY_TYPES.MATERIAL));
  }, [language, dispatch]);

  useEffect(() => {
    if (educationMaterialCategoryTreeData.length) {
      const rootCategoryStructure = {};
      educationMaterialCategoryTreeData.forEach(category => {
        rootCategoryStructure[category.value] = [];
      });
      setSelectedCategories(rootCategoryStructure);
    }
  }, [educationMaterialCategoryTreeData]);

  useEffect(() => {
    let serializedSelectedCats = [];
    Object.keys(selectedCategories).forEach(function (key) {
      serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
    });

    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getEducationMaterials({
        filter: formFields,
        categories: serializedSelectedCats,
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
  }, [language, formFields, selectedCategories, currentPage, pageSize, dispatch, therapistId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
    setCurrentPage(1);
  };

  const handleLanguageChange = e => {
    const { value } = e.target;
    setLanguage(value);
  };

  const handleCheckBoxChange = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
    setCurrentPage(1);
  };

  const handleViewEducationMaterial = (educationMaterial) => {
    setViewEducationMaterial(true);
    setEducationMaterial(educationMaterial);
  };

  const handleViewEducationMaterialClose = () => {
    setViewEducationMaterial(false);
  };

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
    setCurrentPage(1);
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
                <Form.Check
                  custom
                  type="checkbox"
                  name="favorites_only"
                  label={translate('library.show_favorites_only')}
                  id="showFavoriteMaterialsOnly"
                  onChange={handleCheckBoxChange}
                />
                <Form.Check
                  custom
                  type="checkbox"
                  name="my_contents_only"
                  className="mt-3"
                  label={translate('library.show_my_contents_only')}
                  id="showMyMaterialsOnly"
                  onChange={handleCheckBoxChange}
                />
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
              <Accordion>
                {
                  educationMaterialCategoryTreeData.map(category => (
                    <Card key={category.value} className="mb-3 rounded">
                      <Accordion.Toggle as={Card.Header} eventKey={category.value} className="d-flex align-items-center">
                        {category.label}
                        <div className="ml-auto text-nowrap">
                          <span className="mr-3">
                            {selectedCategories[category.value] ? selectedCategories[category.value].length : 0}
                          </span>
                          <ContextAwareToggle eventKey={category.value} />
                        </div>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={category.value}>
                        <Card.Body>
                          <CheckboxTree
                            nodes={category.children}
                            checked={selectedCategories[category.value] ? selectedCategories[category.value] : []}
                            expanded={expanded}
                            onCheck={checked => handleSetSelectedCategories(category.value, checked)}
                            onExpand={expanded => setExpanded(expanded)}
                            icons={{
                              check: <FaRegCheckSquare size={40} color="black" />,
                              uncheck: <BsSquare size={40} color="black" />,
                              halfCheck: <BsDashSquare size={40} color="black" />,
                              expandClose: <BsCaretRightFill size={40} color="black" />,
                              expandOpen: <BsCaretDownFill size={40} color="black" />
                            }}
                            showNodeIcon={false}
                          />
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ))
                }
              </Accordion>
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
                    <Card className="exercise-card shadow-sm mb-4">
                      <div className="top-bar">
                        <div className="favorite-btn btn-link">
                          {material.is_favorite
                            ? <BsHeartFill size={20} />
                            : <BsHeart size={20} />
                          }
                        </div>
                        <Form.Check
                          type="checkbox"
                          className="float-right action"
                          checked={selectedMaterials.includes(material.id)}
                          onChange={(e) => { onSectionChange(e.currentTarget.checked, material.id); setShowPreview(true); }}
                          disabled={oldSelectedMaterials.includes(material.id) && !isOwnCreated}
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
                                ? <h5 className="card-title">
                                  {therapistId === material.therapist_id && (
                                    <BsPersonFill size={20} className=" owner-btn mr-1 mb-1"/>
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
  setViewEducationMaterial: PropTypes.func,
  setShowPreview: PropTypes.func,
  oldSelectedMaterials: PropTypes.array,
  isOwnCreated: PropTypes.bool
};

export default withLocalize(EducationMaterial);
