import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Col, Form, Row } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { useSelector } from 'react-redux';
import Dialog from 'components/Dialog';
import { getTranslate } from 'react-localize-redux/lib/index';

const ViewExercise = ({ showView, handleViewClose, exercise }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Dialog
      show={showView}
      title={exercise.title}
      cancelLabel={translate('common.close')}
      onCancel={handleViewClose}
    >
      <Form>
        <Row>
          <Col sm={12} xl={12}>
            <Carousel activeIndex={index} onSelect={handleSelect} controls={exercise.files.length > 1} indicators={exercise.files.length > 1} className="view-exercise-carousel">
              { exercise.files.map((file, index) => (
                <Carousel.Item key={index}>
                  { file.fileType === 'audio/mpeg' &&
                    <div className="img-thumbnail w-100 pt-2 pl-5 pr-5 bg-light audio-wrapper">
                      <audio controls className="w-100 mt-4">
                        <source src={file.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${file.id}`} type="audio/ogg" />
                      </audio>
                    </div>
                  }
                  { (file.fileType !== 'audio/mpeg' && file.fileType !== 'video/mp4') &&
                    <img
                      className="d-block w-100"
                      src={file.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${file.id}`} alt="..."
                    />
                  }

                  { file.fileType === 'video/mp4' &&
                    <video className="w-100 img-thumbnail" controls>
                      <source src={file.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${file.id}`} type="video/mp4" />
                    </video>
                  }
                </Carousel.Item>
              ))}
            </Carousel>
            <div className="mt-4">
              { exercise.additional_fields && exercise.additional_fields.map((additionalField, index) => (
                <div key={index}>
                  <strong>{additionalField.field}</strong>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{additionalField.value}</p>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};

ViewExercise.propTypes = {
  showView: PropTypes.bool,
  handleViewClose: PropTypes.func,
  exercise: PropTypes.array
};

export default withLocalize(ViewExercise);
