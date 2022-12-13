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
import { getQuestionnaires, deleteQuestionnaire } from 'store/questionnaire/actions';
import ViewQuestionnaire from './viewQuestionnaire';
import CheckboxTree from 'react-checkbox-tree';
import SearchInput from 'components/Form/SearchInput';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import { FaRegCheckSquare } from 'react-icons/fa';
import {
  FavoriteAction,
  NonFavoriteAction,
  DeleteAction
} from 'components/ActionIcons';
import _ from 'lodash';
import * as ROUTES from 'variables/routes';
import { useHistory } from 'react-router-dom';
import Dialog from 'components/Dialog';

import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import customColorScheme from '../../../utils/customColorScheme';
import { TranslateAction } from '../../../components/ActionIcons/TranslateAction';

const Questionnaire = ({ translate, handleSwitchFavorite, therapistId, allowCreateContent, onSectionChange, selectedQuestionnaires, isShowPreviewList }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, questionnaires, filters, totalCount } = useSelector(state => state.questionnaire);
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
  const [questionnaire, setQuestionnaire] = useState([]);
  const [viewQuestionnaire, setViewQuestionnaire] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [showCopy, setShowCopy] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [id, setId] = useState();
  const [show, setShow] = useState(false);

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

    dispatch(getQuestionnaires({
      filter: formFields,
      categories: serializedSelectedCats,
      lang: language,
      page_size: pageSize,
      page: currentPage,
      therapist_id: therapistId
    }));
  }, [language, formFields, selectedCategories, currentPage, pageSize, dispatch, therapistId]);

  useEffect(() => {
    if (language !== undefined) {
      dispatch(getCategoryTreeData(
        { type: CATEGORY_TYPES.QUESTIONNAIRE, lang: language }));
    }
  }, [language, dispatch]);

  useEffect(() => {
    if (categoryTreeData.length) {
      const rootCategoryStructure = {};
      categoryTreeData.forEach(category => {
        rootCategoryStructure[category.value] = [];
      });
      setSelectedCategories(rootCategoryStructure);
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

  const handleViewQuestionnaire = (questionnaire) => {
    setViewQuestionnaire(true);
    setQuestionnaire(questionnaire);

    setId(questionnaire.id);
    if (!questionnaire.therapist_id && allowCreateContent) {
      setShowCopy(true);
    }

    if (questionnaire.therapist_id === therapistId) {
      setShowEdit(true);
    }
  };

  const handleViewQuestionnaireClose = () => {
    setViewQuestionnaire(false);
    setShowCopy(false);
    setShowEdit(false);
  };

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    history.push(ROUTES.QUESTIONNAIRE_EDIT.replace(':id', id));
  };

  const handleCopy = (id) => {
    history.push(ROUTES.QUESTIONNAIRE_COPY.replace(':id', id));
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
    dispatch(deleteQuestionnaire(id)).then(result => {
      if (result) {
        handleClose();
      }
    });
  };

  const handleTranslate = (id) => {
    history.push(ROUTES.QUESTIONNAIRE_TRANSLATE.replace(':id', id).replace(':lang', language));
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
                placeholder={translate('questionnaire.search')}
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
                  id="questionnaire-showFavoritesOnly"
                  onChange={handleCheckBoxChange}
                />
                <Form.Check
                  custom
                  type="checkbox"
                  name="my_contents_only"
                  className="mt-3"
                  label={translate('library.show_my_contents_only')}
                  id="questionnaire-showMyContentsOnly"
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
                  categoryTreeData.map(category => (
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
          { questionnaires.length === 0 && (
            <div className="card h-100 d-flex justify-content-center align-items-center">
              <big className="text-muted">{translate('common.no_data')}</big>
            </div>
          )}
          { questionnaires.length > 0 && (
            <>
              <Row>
                { questionnaires.map(questionnaire => (
                  <Col key={questionnaire.id} md={6} lg={isShowPreviewList ? 4 : 3}>
                    <Card className="exercise-card shadow-sm mb-4" role="button" tabIndex="0" onKeyPress={(e) => e.key === 'Enter' && document.getElementById('questionnaire-' + questionnaire.id).click()}>
                      <div className="top-bar justify-content-start align-items-center">
                        <div className="favorite-btn">
                          {questionnaire.is_favorite
                            ? <NonFavoriteAction onClick={() => handleSwitchFavorite(questionnaire.id, 0, CATEGORY_TYPES.QUESTIONNAIRE)} />
                            : <FavoriteAction onClick={() => handleSwitchFavorite(questionnaire.id, 1, CATEGORY_TYPES.QUESTIONNAIRE)} />
                          }
                        </div>
                        <div className="ml-2">
                          {questionnaire.auto_translated && therapistId !== questionnaire.therapist_id && (
                            <TranslateAction onClick={() => handleTranslate(questionnaire.id)} />
                          )}
                        </div>
                        <Form.Check
                          className="ml-auto"
                          type="checkbox"
                          checked={selectedQuestionnaires.includes(questionnaire.id)}
                          onChange={(e) => onSectionChange(e.currentTarget.checked, questionnaire.id)}
                          custom={true}
                          id={`questionnaire-${questionnaire.id}`}
                          label={`questionnaire-${questionnaire.id}`}
                        />
                      </div>
                      <div id={`questionnaire-${questionnaire.id}`} className="card-container" onClick={() => handleViewQuestionnaire(questionnaire)}>
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
                      <div className="d-flex justify-content-end">
                        {therapistId === questionnaire.therapist_id && (
                          <div className="delete-btn">
                            <DeleteAction onClick={() => handleDelete(questionnaire.id)} />
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
          { loading && <Spinner className="loading-spinner" animation="border" variant="primary" /> }
          { viewQuestionnaire && <ViewQuestionnaire show={viewQuestionnaire} handleClose={handleViewQuestionnaireClose} questionnaire={questionnaire} handleEdit={() => handleEdit(id)} handleCopy={() => handleCopy(id)} showEdit={showEdit} showCopy={showCopy} />}
        </Col>
      </Row>
      <Dialog
        show={show}
        title={translate('questionnaire.delete_confirmation_title')}
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

Questionnaire.propTypes = {
  translate: PropTypes.func,
  handleSwitchFavorite: PropTypes.func,
  therapistId: PropTypes.number,
  allowCreateContent: PropTypes.bool,
  onSectionChange: PropTypes.func,
  selectedQuestionnaires: PropTypes.array,
  isShowPreviewList: PropTypes.bool
};

export default withLocalize(Questionnaire);
