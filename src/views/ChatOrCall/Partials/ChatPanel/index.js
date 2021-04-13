import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';
import Message from './Message';
import InputToolbar from './InputToolbar';
import { BsChevronLeft } from 'react-icons/bs';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { CALL_STATUS } from 'variables/rocketchat';

const MIN_MSG_OUTER_HEIGHT = 205;
const ChatPanel = (
  {
    translate,
    userStatus,
    therapist,
    selectedRoom,
    messages,
    hideChatPanel,
    isVideoCall,
    onSendMessage
  }) => {
  const [msgOuterHeight, setMsgOuterHeight] = useState(MIN_MSG_OUTER_HEIGHT);

  const handleInputSizeChanged = (changedHeight) => {
    if (changedHeight < 0) {
      setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT);
    } else {
      setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT + changedHeight);
    }
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
            messages={messages}
            currentUser={therapist.chat_user_id}
            msgOuterHeight={msgOuterHeight}
          />
          <InputToolbar
            onSend={onSendMessage}
            onInputSizeChanged={handleInputSizeChanged}
            translate={translate}
            roomId={selectedRoom.rid}
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
  therapist: PropTypes.object,
  selectedRoom: PropTypes.object,
  messages: PropTypes.array,
  hideChatPanel: PropTypes.func,
  isVideoCall: PropTypes.func,
  onSendMessage: PropTypes.func
};

export default ChatPanel;
