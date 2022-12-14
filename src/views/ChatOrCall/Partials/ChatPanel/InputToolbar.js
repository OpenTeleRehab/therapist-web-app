import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import { MdSend } from 'react-icons/md';
import { ImAttachment } from 'react-icons/im';
import { toMB, isValidFileSize, isValidFileMineType } from 'utils/file';
import AttachmentDialog from './AttachmentDialog';
import { useDispatch } from 'react-redux';
import { showErrorNotification } from 'store/notification/actions';
import settings from 'settings';

const INPUT_MIN_HEIGHT = 50;

const InputToolbar = (props) => {
  const dispatch = useDispatch();
  const textAreaRef = useRef(null);
  const [parentHeight, setParentHeight] = useState(INPUT_MIN_HEIGHT);
  const [textAreaHeight, setTextAreaHeight] = useState(INPUT_MIN_HEIGHT);
  const [enterKeyIsPressed, setEnterKeyIsPressed] = useState(false);
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setText(props.defaultValue || '');
  }, [props.defaultValue]);

  useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      setParentHeight(textAreaRef.current.scrollHeight);
      setTextAreaHeight(textAreaRef.current.scrollHeight);
    }
  }, [text, textAreaRef]);

  const onChangeHandler = (e) => {
    if (enterKeyIsPressed) {
      onSendHandler();
      setEnterKeyIsPressed(false);
      return true;
    }
    const value = e.target.value.trimLeft();
    setText(value);
    if (props.onInputChanged) {
      props.onInputChanged(value);
    }
    const { scrollHeight } = textAreaRef.current;
    if (value === '') {
      setParentHeight(INPUT_MIN_HEIGHT);
      setTextAreaHeight(INPUT_MIN_HEIGHT);
      props.onInputSizeChanged(-1);
    } else if ((scrollHeight > INPUT_MIN_HEIGHT) && (parentHeight !== scrollHeight)) {
      setParentHeight(scrollHeight);
      setTextAreaHeight('auto');
      if (scrollHeight < parentHeight) {
        props.onInputSizeChanged((scrollHeight - INPUT_MIN_HEIGHT) - 20);
      } else {
        props.onInputSizeChanged(scrollHeight - INPUT_MIN_HEIGHT);
      }
    }
  };

  const onKeyPressHandler = (e) => {
    const { key, shiftKey } = e.nativeEvent;
    if (!shiftKey && key === 'Enter' && e.target.value !== '') {
      setEnterKeyIsPressed(true);
    }
  };

  const onSendHandler = () => {
    setText('');
    setParentHeight(INPUT_MIN_HEIGHT);
    setTextAreaHeight(INPUT_MIN_HEIGHT);
    props.onSend(text);
  };

  const onAttachmentChangeHandler = (e) => {
    const file = e.target.files[0];
    const fileSize = toMB(file.size).toFixed(2);
    const fileMineType = file.type;
    const isValidSize = isValidFileSize(fileSize);
    const isValidMineType = isValidFileMineType(fileMineType);
    if (!isValidSize) {
      dispatch(showErrorNotification(
        'toast_title.error_message',
        props.translate('common.error_message_invalid_file_size', { size: settings.fileMaxUploadSize }))
      );
      return false;
    }
    if (!isValidMineType) {
      dispatch(showErrorNotification(
        'toast_title.error_message',
        props.translate('common.error_message_invalid_file_type'))
      );
      return false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAttachment({
        url: reader.result,
        type: file.type,
        caption: '',
        file
      });
      setShowDialog(true);
    };
  };

  const onCaptionChangeHandler = (e) => {
    setAttachment({ ...attachment, caption: e.target.value.trimLeft() });
  };

  const onCancelSendAttachment = () => {
    setShowDialog(false);
    setAttachment(null);
  };

  const onConfirmSendAttachment = () => {
    props.onSend('', attachment);
    setShowDialog(false);
    setAttachment(null);
  };

  return (
    <>
      <Form.Group className="d-flex align-items-end chat-input-toolbar" style={{ minHeight: parentHeight }}>
        <div className={`position-relative ${props.showAttachment ? 'chat-composer' : 'w-100'}`}>
          <Form.Control
            name="chatText"
            value={text}
            ref={textAreaRef}
            as="textarea"
            rows={1}
            onChange={(e) => onChangeHandler(e)}
            onKeyPress={(e) => onKeyPressHandler(e)}
            placeholder={props.translate('placeholder.type.message')}
            style={{ height: textAreaHeight }}
            aria-label="Chat text"
          />
          {text.length > 0 && (
            <Button variant="" className="chat-send-btn p-0" onClick={() => onSendHandler()}>
              <MdSend size={22} color="#0077C8" />
            </Button>
          )}
        </div>
        {props.showAttachment && (
          <Button as={Button} variant="light" className="chat-add-attachment-btn position-relative p-0" onKeyPress={(event) => event.key === 'Enter' && document.getElementById('file').click()}>
            <input
              type="file"
              name="attachments"
              className="position-absolute upload-btn"
              accept="video/*, image/*"
              onChange={(e) => onAttachmentChangeHandler(e)}
              aria-label="Attachment"
              id="file"
            />
            <ImAttachment size={20} color="#858585" />
            <span className="d-none d-md-block">{props.translate('common.attach_file')}</span>
          </Button>
        )}
      </Form.Group>
      {showDialog && (
        <AttachmentDialog
          translate={props.translate}
          show={showDialog}
          attachment={attachment}
          onCaptionChanged={onCaptionChangeHandler}
          onCancel={onCancelSendAttachment}
          onConfirm={onConfirmSendAttachment}
        />
      )}
    </>
  );
};

InputToolbar.defaultProps = {
  showAttachment: true
};

InputToolbar.propTypes = {
  translate: PropTypes.func,
  onSend: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  onInputChanged: PropTypes.func,
  showAttachment: PropTypes.bool,
  defaultValue: PropTypes.string
};

export default InputToolbar;
