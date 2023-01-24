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
  BsPersonFill,
  BsCaretDownFill,
  BsCaretRightFill,
  BsDashSquare,
  BsSquare
} from 'react-icons/bs';

import Pagination from 'components/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import { getQuestionnaires } from 'store/questionnaire/actions';
import ViewQuestionnaire from './viewQuestionnaire';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import CheckboxTree from 'react-checkbox-tree';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import { FaRegCheckSquare } from 'react-icons/fa';
import _ from 'lodash';
import scssColors from '../../../../scss/custom.scss';
import Select from 'react-select';

const Questionnaire = ({ translate, selectedQuestionnaires, onSectionChange, viewQuestionnaire, setViewQuestionnaire, setShowPreview, isOwnCreated, oldSelectedQuestionnaires, showPreview }) => {
  const dispatch = useDispatch();
  const { loading, questionnaires, filters, totalCount } = useSelector(state => state.questionnaire);
  const { questionnaireCategoryTreeData } = useSelector((state) => state.category);
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
  const [questionnaire, setQuestionnaire] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const therapistId = profile ? profile.id : '';

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
    if (language !== undefined) {
      dispatch(getCategoryTreeData({ type: CATEGORY_TYPES.QUESTIONNAIRE, lang: language }, CATEGORY_TYPES.QUESTIONNAIRE));
    }
  }, [language, dispatch]);

  useEffect(() => {
    if (language !== undefined) {
      let serializedSelectedCats = [];
      Object.keys(selectedCategories).forEach(function (key) {
        serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
      });

      dispatch(getQuestionnaires({
        filter: formFields,
        categories: serializedSelectedCats,
        lang: language,
        page_size: pageSize,
        page: currentPage,
        therapist_id: therapistId
      }));
    }
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

  const handleCheckBoxChange = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
    setCurrentPage(1);
  };

  const handleViewQuestionnaire = (questionnaire) => {
    setViewQuestionnaire(true);
    setQuestionnaire(questionnaire);
  };

  const handleViewQuestionnaireClose = () => {
    setViewQuestionnaire(false);
  };

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
    setCurrentPage(1);
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
              <Form.Group className="search-box-with-icon">
                <BsSearch className="search-icon" />
                <Button
                  aria-label="Clear search"
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
                  placeholder={translate('questionnaire.search')}
                  aria-label="Search"
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
                  questionnaireCategoryTreeData.map(category => (
                    <Card key={category.value} className="mb-3 rounded">
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
        <Col sm={7} md={8} lg={showPreview ? 7 : 9}>
          { questionnaires.length === 0 && (
            <div className="card h-100 d-flex justify-content-center align-items-center">
              <big className="text-muted">{translate('common.no_data')}</big>
            </div>
          )}
          { questionnaires.length > 0 && (
            <>
              <Row>
                { questionnaires.map(questionnaire => (
                  <Col key={questionnaire.id} md={6} lg={ showPreview ? 4 : 3}>
                    <Card className="exercise-card shadow-sm mb-4" role="button" tabIndex="0" onKeyPress={(e) => e.key === 'Enter' && document.getElementById('view-questionnaire-' + questionnaire.id).click()}>
                      <div className="top-bar">
                        <div className="favorite-btn btn-link">
                          {questionnaire.is_favorite
                            ? <BsHeartFill size={20} />
                            : <BsHeart size={20} />
                          }
                        </div>
                        {oldSelectedQuestionnaires.includes(questionnaire.id) && !isOwnCreated ? (
                          <Form.Check
                            type="checkbox"
                            id={`questionnaire-${questionnaire.id}`}
                            checked={selectedQuestionnaires.includes(questionnaire.id)}
                            onChange={(e) => {
                              onSectionChange(e.currentTarget.checked, questionnaire.id); setShowPreview(true);
                            }}
                            custom={true}
                            disabled={oldSelectedQuestionnaires.includes(questionnaire.id) && !isOwnCreated}
                            label={`questionnaire-${questionnaire.id}`}
                          />
                        ) : (
                          <Form.Check
                            type="checkbox"
                            id={`questionnaire-${questionnaire.id}`}
                            checked={selectedQuestionnaires.includes(questionnaire.id)}
                            onChange={(e) => {
                              onSectionChange(e.currentTarget.checked, questionnaire.id); setShowPreview(true);
                            }}
                            custom={true}
                            disabled={oldSelectedQuestionnaires.includes(questionnaire.id) && !isOwnCreated}
                            label={`questionnaire-${questionnaire.id}`}
                          />
                        )
                        }
                      </div>
                      <div id={`view-questionnaire-${questionnaire.id}`} className="card-container" onClick={() => handleViewQuestionnaire(questionnaire)}>
                        <div className="card-img bg-light">
                          <div className="w-100 h-100 px-2 py-4 text-center questionnaire-header">
                            <img src={'/images/questionnaire.svg'} alt='questionnaire' loading="lazy"/>
                            <p>{translate('activity.questionnaire').toUpperCase()}</p>
                          </div>
                        </div>
                        <Card.Body className="d-flex flex-column justify-content-between">
                          <Card.Title>
                            {
                              questionnaire.title.length <= 50
                                ? <h5 className="card-title">
                                  {therapistId === questionnaire.therapist_id && (
                                    <BsPersonFill size={20} className="owner-btn mr-1 mb-1" />
                                  )}
                                  { questionnaire.title }
                                </h5>
                                : (
                                  <OverlayTrigger
                                    overlay={<Tooltip id="button-tooltip-2">{ questionnaire.title }</Tooltip>}
                                  >
                                    <h5 className="card-title">
                                      {therapistId === questionnaire.therapist_id && (
                                        <BsPersonFill size={20} className="owner-btn mr-1 mb-1" />
                                      )}
                                      { questionnaire.title }
                                    </h5>
                                  </OverlayTrigger>
                                )
                            }
                          </Card.Title>
                          <Card.Text>
                            <b>{questionnaire.questions.length}</b> {translate('activity.questionnaire.questions')}
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
                pageSizes={[60, 120, 180, 240]}
              />
            </>
          )}
          { loading && <Spinner className="loading-spinner" animation="border" variant="primary" /> }
          { viewQuestionnaire && <ViewQuestionnaire show={viewQuestionnaire} handleClose={handleViewQuestionnaireClose} questionnaire={questionnaire}/> }
        </Col>
      </Row>
    </>
  );
};

Questionnaire.propTypes = {
  translate: PropTypes.func,
  selectedQuestionnaires: PropTypes.array,
  onSectionChange: PropTypes.func,
  viewQuestionnaire: PropTypes.bool,
  setViewQuestionnaire: PropTypes.func,
  setShowPreview: PropTypes.func,
  oldSelectedQuestionnaires: PropTypes.array,
  isOwnCreated: PropTypes.bool,
  showPreview: PropTypes.bool
};

export default withLocalize(Questionnaire);
