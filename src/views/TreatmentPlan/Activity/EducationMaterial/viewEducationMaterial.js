import React from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Col, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Dialog from 'components/Dialog';
import { getTranslate } from 'react-localize-redux/lib/index';
import GoogleTranslationAttribute from '../../../../components/GoogleTranslationAttribute';

const ViewEducationMaterial = ({ showView, handleViewClose, educationMaterial }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <Dialog
      show={showView}
      title={educationMaterial.title}
      cancelLabel={translate('common.close')}
      onCancel={handleViewClose}
    >
      <Form>
        <Row>
          <Col sm={12} xl={12}>
            { educationMaterial &&
              <>
                {educationMaterial.file ? (
                  <div className = "exercise-media">
                    { educationMaterial.file.fileType === 'audio/mpeg' &&
                    <div className="img-thumbnail w-100 pt-2">
                      <audio controls className="w-100">
                        <source src={educationMaterial.file.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${educationMaterial.file.id}`} type="audio/ogg" />
                      </audio>
                    </div>
                    }

                    { (educationMaterial.file.fileType !== 'audio/mpeg' && educationMaterial.file.fileType !== 'video/mp4' && educationMaterial.file.fileType !== 'application/pdf') &&
                    <img src={educationMaterial.file.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${educationMaterial.file.id}`} alt="..." className="w-100 img-thumbnail"/>
                    }

                    { educationMaterial.file.fileType === 'video/mp4' &&
                    <video className="w-100 img-thumbnail" controls>
                      <source src={educationMaterial.file.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${educationMaterial.file.id}`} type="video/mp4" />
                    </video>
                    }

                    { educationMaterial.file.fileType === 'application/pdf' &&
                    <object
                      data={educationMaterial.file.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${educationMaterial.file.id}`}
                      type="application/pdf"
                      width="480"
                      height="678"
                    >
                      <iframe
                        src={educationMaterial.file.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${educationMaterial.file.id}`}
                        width="480"
                        height="678"
                        title={educationMaterial.file.fileName}
                      >
                        <p>This browser does not support PDF!</p>
                      </iframe>
                    </object>
                    }

                    <Form.Text className="text-muted">
                      {translate(educationMaterial.file.fileGroupType)}:
                      <a
                        href={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${educationMaterial.file.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pl-2"
                      >
                        {educationMaterial.file.fileName}
                      </a>
                    </Form.Text>
                  </div>
                ) : (
                  <div>{translate('common.no_file_translate')}</div>
                )}
              </>
            }
          </Col>
        </Row>
      </Form>
      { educationMaterial.auto_translated === true && (
        <GoogleTranslationAttribute />
      )}
    </Dialog>
  );
};

ViewEducationMaterial.propTypes = {
  showView: PropTypes.bool,
  handleViewClose: PropTypes.func,
  educationMaterial: PropTypes.array
};

export default withLocalize(ViewEducationMaterial);
