import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import { MdSend } from 'react-icons/md';

const INPUT_MIN_HEIGHT = 50;

const InputToolbar = (props) => {
  const textAreaRef = useRef(null);
  const [parentHeight, setParentHeight] = useState(INPUT_MIN_HEIGHT);
  const [textAreaHeight, setTextAreaHeight] = useState(INPUT_MIN_HEIGHT);
  const [enterKeyIsPressed, setEnterKeyIsPressed] = useState(false);
  const [text, setText] = useState('');

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

  return (
    <Form.Group className="chat-input-toolbar mt-2 mb-0" style={{ minHeight: parentHeight }}>
      <Form.Control
        name="chatText"
        value={text}
        ref={textAreaRef}
        as="textarea"
        rows={1}
        onChange={(e) => onChangeHandler(e)}
        onKeyPress={(e) => onKeyPressHandler(e)}
        placeholder={props.placeholder}
        style={{ height: textAreaHeight }}
      />
      {text.length > 0 && (
        <Button variant="" className="chat-send-btn p-0" onClick={() => onSendHandler()}>
          <MdSend size={22} color="#0077C8" />
        </Button>
      )}
    </Form.Group>
  );
};

InputToolbar.propTypes = {
  placeholder: PropTypes.string,
  onSend: PropTypes.func,
  onInputSizeChanged: PropTypes.func
};

export default InputToolbar;
