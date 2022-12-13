import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/Dialog';
import { Form } from 'react-bootstrap';

const AttachmentDialog = (
  {
    translate,
    show,
    attachment,
    onCaptionChanged,
    onCancel,
    onConfirm
  }) => {
  return (
    <Dialog
      show={show}
      title={translate('chat_attachment.title')}
      onCancel={onCancel}
      onConfirm={onConfirm}
      confirmLabel={translate('common.send')}
      centered
    >
      <div className="chat-attachment-overview">
        {attachment.type.includes('video/') ? (
          <video className="w-100 img-thumbnail mb-1 hide-full-screen" controls disablePictureInPicture controlsList="nodownload">
            <source src={attachment.url} type="video/mp4" />
          </video>
        ) : (
          <img src={attachment.url} alt="" className="w-100 img-thumbnail mb-1" loading="lazy"/>
        )}
      </div>
      <Form onSubmit={onConfirm}>
        <Form.Group>
          <Form.Label>{translate('chat_attachment.caption')}</Form.Label>
          <Form.Control value={attachment.caption} onChange={onCaptionChanged} type="text" />
        </Form.Group>
      </Form>
    </Dialog>
  );
};

AttachmentDialog.propTypes = {
  translate: PropTypes.func,
  show: PropTypes.bool,
  attachment: PropTypes.object,
  onCaptionChanged: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func
};

export default AttachmentDialog;
