import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Button, Col, Form, Row, Accordion, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import * as ROUTES from '../../../variables/routes';
import {
  createEducationMaterial,
  getEducationMaterial, translateEducationMaterial, updateEducationMaterial
} from '../../../store/educationMaterial/actions';
import { formatFileSize, toMB } from '../../../utils/file';
import settings from '../../../settings';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import {
  BsCaretDownFill,
  BsCaretRightFill,
  BsSquare,
  BsDashSquare
} from 'react-icons/bs';
import { FaRegCheckSquare } from 'react-icons/fa';
import CheckboxTree from 'react-checkbox-tree';
import _ from 'lodash';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import customColorScheme from '../../../utils/customColorScheme';

const CreateEducationMaterial = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id, lang } = useParams();
  const isCopy = useRouteMatch(ROUTES.EDUCATION_MATERIAL_COPY);
  const isTranslate = useRouteMatch(ROUTES.EDUCATION_MATERIAL_TRANSLATE);
  const { maxFileSize } = settings.educationMaterial;

  const { languages } = useSelector(state => state.language);
  const { educationMaterial, filters } = useSelector(state => state.educationMaterial);
  const { categoryTreeData } = useSelector((state) => state.category);
  const { profile } = useSelector((state) => state.auth);
  const { colorScheme } = useSelector(state => state.colorScheme);

  const [language, setLanguage] = useState('');
  const [formFields, setFormFields] = useState({
    title: '',
    file: undefined
  });
  const [materialFile, setMaterialFile] = useState(undefined);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const [titleError, setTitleError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [therapistId, setTherapistId] = useState('');

  useEffect(() => {
    if (languages.length) {
      if (id && ((filters && filters.lang) || lang)) {
        setLanguage(lang || filters.lang);
      } else {
        setLanguage(languages[0].id);
      }
    }
  }, [languages, filters, id, lang]);

  useEffect(() => {
    dispatch(getCategoryTreeData({ type: CATEGORY_TYPES.MATERIAL, lang: language }));
  }, [language, dispatch]);

  useEffect(() => {
    if (id && language) {
      dispatch(getEducationMaterial(id, language));
    }
  }, [id, language, dispatch]);

  useEffect(() => {
    if (profile !== undefined) {
      setTherapistId(profile.id);
    }
  }, [profile]);

  useEffect(() => {
    if (id && educationMaterial.id) {
      setFormFields({
        title: isCopy ? `${educationMaterial.title} (${translate('common.copy')})` : educationMaterial.title
      });
      setMaterialFile(educationMaterial.file);
      if (categoryTreeData.length) {
        const rootCategoryStructure = {};
        categoryTreeData.forEach(category => {
          const ids = [];
          JSON.stringify(category, (key, value) => {
            if (key === 'value') ids.push(value);
            return value;
          });
          rootCategoryStructure[category.value] = _.intersectionWith(educationMaterial.categories, ids);
        });
        setSelectedCategories(rootCategoryStructure);
      }
    }
    // eslint-disable-next-line
  }, [id, educationMaterial, categoryTreeData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormFields({ ...formFields, [name]: files[0] });
  };

  const handleSave = () => {
    let canSave = true;

    if (formFields.title === '') {
      canSave = false;
      setTitleError(true);
    } else {
      setTitleError(false);
    }

    setFileError(false);
    if (!isTranslate) {
      if (!materialFile && formFields.file === undefined) {
        canSave = false;
        setFileError(true);
      } else if (formFields.file !== undefined && toMB(formFields.file.size) > maxFileSize) {
        canSave = false;
        setFileError(true);
      }
    }

    let serializedSelectedCats = [];
    Object.keys(selectedCategories).forEach(function (key) {
      serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
    });

    if (canSave) {
      setIsLoading(true);
      if (id && !isCopy && !isTranslate) {
        dispatch(updateEducationMaterial(id, { ...formFields, categories: serializedSelectedCats, lang: language, therapist_id: therapistId }))
          .then(result => {
            if (result) {
              history.push(ROUTES.LIBRARY_EDUCATION);
            }
            setIsLoading(false);
          });
      } else {
        if (isTranslate) {
          dispatch(translateEducationMaterial({ ...formFields, lang: language, id, file_id: educationMaterial.file_id, therapist_id: therapistId })).then(result => {
            if (result) {
              history.push(ROUTES.LIBRARY_EDUCATION);
            }
            setIsLoading(false);
          });
        } else {
          dispatch(createEducationMaterial({
            ...formFields,
            categories: serializedSelectedCats,
            lang: language,
            therapist_id: therapistId,
            copy_id: isCopy ? id : ''
          })).then(result => {
            if (result) {
              history.push(ROUTES.LIBRARY_EDUCATION);
            }
            setIsLoading(false);
          });
        }
      }
    }
  };

  const renderUploadFileName = () => {
    const file = formFields.file;
    if (file) {
      return `${file.name} (${formatFileSize(file.size)})`;
    }
    return translate('education_material.upload_file.placeholder');
  };

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
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

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  const handleFileUpload = (e) => {
    if (e.key === 'Enter') {
      document.getElementById('file').click();
      e.stopPropagation();
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{id ? isTranslate ? translate('education_material.translate') : isCopy ? translate('education_material.copy') : translate('education_material.edit') : translate('education_material.create')}</h1>
      </div>

      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Row>
          <Col sm={12} xl={11}>
            <Form.Group controlId="formLanguage">
              <Form.Label>{translate('common.show_language.version')}</Form.Label>
              <Select
                isDisabled={!id || isTranslate}
                classNamePrefix="filter"
                value={languages.filter(option => option.id.toString() === language.toString())}
                getOptionLabel={option => option.name}
                options={languages}
                onChange={(e) => setLanguage(e.id)}
                styles={customSelectStyles}
                aria-label="Language"
              />
            </Form.Group>
            <Form.Group controlId="formTitle">
              <Form.Label>{translate('education_material.title')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Form.Control
                name="title"
                onChange={handleChange}
                value={formFields.title}
                placeholder={translate('education_material.title.placeholder')}
                maxLength={settings.textMaxLength}
                isInvalid={titleError}
              />
              <Form.Control.Feedback type="invalid">
                {translate('education_material.title.required')}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>{translate('education_material.upload_file')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Form.File custom>
                <Form.File.Input
                  name='file'
                  onChange={handleFileChange}
                  isInvalid={fileError}
                  accept={settings.educationMaterial.acceptFileTypes}
                  aria-label="File"
                  id="file"
                  onKeyPress={(event) => handleFileUpload(event)}
                  disabled={isTranslate}
                />
                <Form.File.Label>{renderUploadFileName()}</Form.File.Label>
                <Form.Control.Feedback type="invalid">
                  {formFields.file === undefined
                    ? translate('education_material.upload_file.required')
                    : translate('education_material.upload_file.max_size', { size: maxFileSize })
                  }
                </Form.Control.Feedback>

                {materialFile && (
                  <Form.Text className="text-muted">
                    {translate(materialFile.fileGroupType)}:
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a
                      href={`${process.env.REACT_APP_API_BASE_URL}/file/${materialFile.id}`}
                      /* eslint-disable-next-line react/jsx-no-target-blank */
                      target="_blank"
                      className="pl-2"
                    >
                      {materialFile.fileName}
                    </a>
                  </Form.Text>
                )}
              </Form.File>
            </Form.Group>

            <Accordion className="material-category-wrapper" defaultActiveKey={1}>
              {
                categoryTreeData.map((category, index) => (
                  <Card key={index}>
                    <Accordion.Toggle eventKey={index + 1} className="d-flex align-items-center card-header border-0" onKeyPress={(event) => event.key === 'Enter' && event.stopPropagation()} disabled={isTranslate}>
                      {category.label}
                      <div className="ml-auto">
                        <span className="mr-3">
                          {selectedCategories[category.value] ? selectedCategories[category.value].length : 0} {translate('category.selected')}
                        </span>
                        <ContextAwareToggle eventKey={index + 1} />
                      </div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={!isTranslate ? index + 1 : ''}>
                      <Card.Body>
                        <CheckboxTree
                          nodes={category.children || []}
                          checked={selectedCategories[category.value] ? selectedCategories[category.value] : []}
                          expanded={expanded}
                          onCheck={(checked) => handleSetSelectedCategories(category.value, checked)}
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
          </Col>
        </Row>
        <Row>
          <Col sm={12} xl={11} className="question-wrapper">
            <div className="sticky-btn d-flex justify-content-end">
              <div className="py-2 questionnaire-save-cancel-wrapper px-3">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {translate('common.save')}
                </Button>
                <Button
                  className="ml-2"
                  variant="outline-dark"
                  as={Link}
                  to={ROUTES.LIBRARY_EDUCATION}
                  disabled={isLoading}
                >
                  {translate('common.cancel')}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

CreateEducationMaterial.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(CreateEducationMaterial);
