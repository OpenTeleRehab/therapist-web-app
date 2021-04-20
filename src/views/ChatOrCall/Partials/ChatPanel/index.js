import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';
import Message from './Message';
import InputToolbar from './InputToolbar';
import { BsChevronLeft } from 'react-icons/bs';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { CALL_STATUS, CHAT_TYPES } from 'variables/rocketchat';
import { useDispatch } from 'react-redux';
import { postAttachmentMessage } from 'store/rocketchat/actions';
import { generateHash } from 'utils/general';

const MIN_MSG_OUTER_HEIGHT = 205;
const ChatPanel = (
  {
    translate,
    userStatus,
    chatUserId,
    selectedRoom,
    messages,
    hideChatPanel,
    isVideoCall,
    onSendMessage
  }) => {
  const dispatch = useDispatch();
  const [msgOuterHeight, setMsgOuterHeight] = useState(MIN_MSG_OUTER_HEIGHT);
  const [allMessages, setAllMessages] = useState(messages);

  useEffect(() => {
    setAllMessages(messages);
  }, [messages]);

  const handleInputSizeChanged = (changedHeight) => {
    if (changedHeight < 0) {
      setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT);
    } else {
      setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT + changedHeight);
    }
  };

  const handleSendMessage = (text = '', attachment = null) => {
    // pending message
    const newMessage = {
      _id: generateHash(),
      rid: selectedRoom.rid,
      _updatedAt: new Date(),
      u: { _id: chatUserId },
      received: false,
      isVideoCall: false
    };
    if (text !== '') {
      newMessage.msg = text;
      newMessage.type = CHAT_TYPES.TEXT;
      onSendMessage(text);
    } else if (attachment !== null) {
      const { type, url, caption, file } = attachment;
      newMessage.type = type.includes('video/') ? CHAT_TYPES.VIDEO : CHAT_TYPES.IMAGE;
      newMessage.attachment = {
        title: file.name,
        type,
        caption,
        url
      };
      dispatch(postAttachmentMessage(selectedRoom.rid, attachment));
    }
    setAllMessages(messages.concat([newMessage]));
  };

  const handleCall = (isVideo) => {
    onSendMessage(CALL_STATUS.STARTED);
    isVideoCall(isVideo);
  };

  return (
    <>
      {selectedRoom ? (
        <>
          <div className="chat-message-header d-flex justify-content-between align-items-center">
            <h4 className="font-weight-bold mb-0 d-flex align-items-center">
              <Button variant="link" className="d-md-none btn-back" onClick={() => hideChatPanel(true)}>
                <BsChevronLeft size={18} color="#0077C8" />
              </Button>
              {selectedRoom.name}
              {userStatus(selectedRoom, 'md')}
            </h4>
            <div className="d-flex justify-content-end">
              <Button variant="light" className="btn-audio-call bg-white rounded-circle mr-2" onClick={() => handleCall(false)}>
                <IoCallOutline size={18} color="#333333" />
              </Button>
              <Button variant="light" className="btn-video-call bg-white rounded-circle" onClick={() => handleCall(true)}>
                <IoVideocamOutline size={18} color="#333333" />
              </Button>
            </div>
          </div>
          <Message
            translate={translate}
            messages={allMessages.length > messages.length ? allMessages : messages}
            currentUser={chatUserId}
            msgOuterHeight={msgOuterHeight}
          />
          <InputToolbar
            onSend={handleSendMessage}
            onInputSizeChanged={handleInputSizeChanged}
            translate={translate}
          />
        </>
      ) : (
        <Alert variant="primary" className="mt-3">{translate('chat_message.please_select_patient')}</Alert>
      )}
    </>
  );
};

ChatPanel.propTypes = {
  translate: PropTypes.func,
  userStatus: PropTypes.func,
  chatUserId: PropTypes.string,
  selectedRoom: PropTypes.object,
  messages: PropTypes.array,
  hideChatPanel: PropTypes.func,
  isVideoCall: PropTypes.func,
  onSendMessage: PropTypes.func
};

export default ChatPanel;
