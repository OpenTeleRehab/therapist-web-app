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
  Accordion
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  BsCaretDownFill,
  BsCaretRightFill,
  BsDashSquare,
  BsSquare,
  BsPersonFill
} from 'react-icons/bs';

import Pagination from 'components/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import { MdDescription } from 'react-icons/md';
import { getEducationMaterials, deleteEducationMaterial } from 'store/educationMaterial/actions';
import ViewEducationMaterial from './viewEducationMaterial';
import CheckboxTree from 'react-checkbox-tree';
import SearchInput from 'components/Form/SearchInput';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import { FaRegCheckSquare } from 'react-icons/fa';
import _ from 'lodash';
import {
  FavoriteAction,
  NonFavoriteAction,
  DeleteAction
} from 'components/ActionIcons';
import * as ROUTES from 'variables/routes';
import { useHistory } from 'react-router-dom';
import Dialog from 'components/Dialog';

import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import { MATERIAL_TYPE } from '../../../variables/activity';
import customColorScheme from '../../../utils/customColorScheme';
import { TranslateAction } from '../../../components/ActionIcons/TranslateAction';
import { filterCategoryTreeDataByProperty } from '../../../utils/category';

let timer = null;
const EducationMaterial = ({ translate, handleSwitchFavorite, therapistId, allowCreateContent, onSectionChange, selectedMaterials, isShowPreviewList }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, educationMaterials, filters, totalCount } = useSelector(state => state.educationMaterial);
  const { categoryTreeData } = useSelector((state) => state.category);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(1);
  const [formFields, setFormFields] = useState({
    search_value: '',
    favorites_only: false,
    my_contents_only: false
  });

  const languages = useSelector(state => state.language.languages);
  const [language, setLanguage] = useState(undefined);
  const { profile } = useSelector((state) => state.auth);
  const [educationMaterial, setEducationMaterial] = useState([]);
  const [viewEducationMaterial, setViewEducationMaterial] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [showCopy, setShowCopy] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [id, setId] = useState();
  const [show, setShow] = useState(false);
  const [processedCategoryTreeData, setProcessedCategoryTreeData] = useState([]);

  useEffect(() => {
    if (filters && filters.lang) {
      setLanguage(filters.lang);
    } else if (profile && profile.language_id) {
      setLanguage(profile.language_id);
    } else {
      setLanguage('');
    }
  }, [filters, profile]);

  useEffect(() => {
    let serializedSelectedCats = [];
    Object.keys(selectedCategories).forEach(function (key) {
      serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
    });

    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getEducationMaterials({
        filter: formFields,
        page_size: pageSize,
        categories: serializedSelectedCats,
        therapist_id: therapistId,
        lang: language,
        page: currentPage
      }));
    }, 500);
  }, [language, formFields, selectedCategories, therapistId, currentPage, pageSize, dispatch]);

  useEffect(() => {
    if (language !== undefined) {
      dispatch(
        getCategoryTreeData({ type: CATEGORY_TYPES.MATERIAL, lang: language }));
    }
  }, [language, dispatch]);

  useEffect(() => {
    if (categoryTreeData.length) {
      const rootCategoryStructure = {};
      categoryTreeData.forEach(category => {
        rootCategoryStructure[category.value] = [];
      });
      setSelectedCategories(rootCategoryStructure);
      setProcessedCategoryTreeData(filterCategoryTreeDataByProperty([...categoryTreeData], 'hi_only', false));
    }
  }, [categoryTreeData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
    setCurrentPage(1);
  };

  const handleCheckBoxChange = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
    setCurrentPage(1);
  };

  const handleViewEducationMaterial = (id) => {
    const educationMaterial = educationMaterials.find(educationMaterial => educationMaterial.id === id);
    setViewEducationMaterial(true);
    setEducationMaterial(educationMaterial);

    setId(id);
    if (!educationMaterial.therapist_id && allowCreateContent) {
      setShowCopy(true);
    }

    if (educationMaterial.therapist_id === therapistId) {
      setShowEdit(true);
    }
  };

  const handleViewEducationMaterialClose = () => {
    setViewEducationMaterial(false);
    setShowEdit(false);
    setShowCopy(false);
  };

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    history.push(ROUTES.EDUCATION_MATERIAL_EDIT.replace(':id', id));
  };

  const handleCopy = (id) => {
    history.push(ROUTES.EDUCATION_MATERIAL_COPY.replace(':id', id));
  };

  const handleDelete = (id) => {
    setId(id);
    setShow(true);
  };

  const handleClose = () => {
    setId(null);
    setShow(false);
  };

  const handleConfirm = () => {
    dispatch(deleteEducationMaterial(id)).then(result => {
      if (result) {
        handleClose();
      }
    });
  };

  const handleTranslate = (id) => {
    history.push(ROUTES.EDUCATION_MATERIAL_TRANSLATE.replace(':id', id).replace(':lang', language));
  };

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  return (
    <>
      <Row>
        <Col sm={5} md={4} lg={3} className="library-panel__filter">
          <Card bg="info">
            <Card.Header>
              <SearchInput
                name="search_value"
                value={formFields.search_value}
                placeholder={translate('education_material.search')}
                onChange={handleChange}
                onClear={handleClearSearch}
              />
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Check
                  custom
                  type="checkbox"
                  name="favorites_only"
                  label={translate('library.show_favorites_only')}
                  id="showFavoritesOnly"
                  onChange={handleCheckBoxChange}
                />
                <Form.Check
                  custom
                  type="checkbox"
                  name="my_contents_only"
                  className="mt-3"
                  label={translate('library.show_my_contents_only')}
                  id="showMyContentsOnly"
                  onChange={handleCheckBoxChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{translate('common.language')}</Form.Label>
                <Select
                  classNamePrefix="filter"
                  value={languages.filter(option => option.id === language)}
                  getOptionLabel={option => option.name}
                  options={languages}
                  onChange={(e) => setLanguage(e.id)}
                  styles={customSelectStyles}
                  aria-label="Language"
                />
              </Form.Group>
              <Accordion>
                {
                  processedCategoryTreeData.map(category => (
                    <Card className="mb-3 rounded" key={category.value}>
                      <Accordion.Toggle eventKey={category.value} className="d-flex align-items-center card-header border-0">
                        <span className="text-truncate pr-2">{category.label}</span>
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
                            nodes={category.children || []}
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
        <Col sm={7} md={8} lg={isShowPreviewList ? 7 : 9}>
          { educationMaterials.length === 0 && (
            <div className="card h-100 d-flex justify-content-center align-items-center">
              <big className="text-muted">{translate('common.no_data')}</big>
            </div>
          )}
          { educationMaterials.length > 0 && (
            <>
              <Row>
                { educationMaterials.map(material => (
                  <Col key={material.id} md={6} lg={isShowPreviewList ? 4 : 3}>
                    <Card className="exercise-card shadow-sm mb-4" role="button" tabIndex="0" onKeyPress={(e) => e.key === 'Enter' && document.getElementById('material-' + material.id).click()}>
                      <div className="top-bar justify-content-start">
                        <div className="favorite-btn">
                          {material.is_favorite
                            ? <NonFavoriteAction onClick={() => handleSwitchFavorite(material.id, 0, CATEGORY_TYPES.MATERIAL)} />
                            : <FavoriteAction onClick={() => handleSwitchFavorite(material.id, 1, CATEGORY_TYPES.MATERIAL)} />
                          }
                        </div>
                        <div className="ml-2">
                          {material.auto_translated && therapistId !== material.therapist_id && (
                            <TranslateAction onClick={() => handleTranslate(material.id)} />
                          )}
                        </div>
                        <Form.Check
                          className="ml-auto"
                          type="checkbox"
                          id={material.id}
                          checked={selectedMaterials.includes(material.id)}
                          onChange={(e) => onSectionChange(e.currentTarget.checked, material.id)}
                          custom={true}
                          label={`material-${material.id}`}
                        />
                      </div>
                      <div id={`material-${material.id}`} className="card-container" onClick={() => handleViewEducationMaterial(material.id)}>
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
                                    <BsPersonFill size={20} className="owner-btn mr-1 mb-1"/>
                                  )}
                                  { material.title }
                                </h5>
                                : (
                                  <OverlayTrigger
                                    overlay={<Tooltip id="button-tooltip-2">{ material.title }</Tooltip>}
                                  >
                                    <h5 className="card-title">
                                      {therapistId === material.therapist_id && (
                                        <BsPersonFill size={20} className="owner-btn mr-1 mb-1"/>
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
                      <div className="d-flex justify-content-end">
                        {therapistId === material.therapist_id && (
                          <div className="delete-btn">
                            <DeleteAction className="ml-1" onClick={() => handleDelete(material.id)} />
                          </div>
                        )}
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
                pageSizes={[60, 120, 180, 240]}
              />
            </>
          )}
          { loading && <Spinner className="loading-icon" animation="border" variant="primary" /> }
          { viewEducationMaterial && <ViewEducationMaterial showView={viewEducationMaterial} handleViewClose={handleViewEducationMaterialClose} educationMaterial={educationMaterial} handleEdit={() => handleEdit(id)} handleCopy={() => handleCopy(id)} showEdit={showEdit} showCopy={showCopy} />}
        </Col>
      </Row>
      <Dialog
        show={show}
        title={translate('education.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

EducationMaterial.propTypes = {
  translate: PropTypes.func,
  handleSwitchFavorite: PropTypes.func,
  therapistId: PropTypes.number,
  allowCreateContent: PropTypes.bool,
  onSectionChange: PropTypes.func,
  selectedMaterials: PropTypes.array,
  isShowPreviewList: PropTypes.bool
};

export default withLocalize(EducationMaterial);
