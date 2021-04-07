import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';
import { generateHash } from 'utils/general';
import { sendNewMessage } from 'utils/rocketchat';
import Message from './Message';
import InputToolbar from './InputToolbar';
import { BsChevronLeft } from 'react-icons/bs';

const MIN_MSG_OUTER_HEIGHT = 205;
const ChatPanel = (
  {
    translate,
    userStatus,
    therapist,
    socket,
    selectedRoom,
    messages,
    hideChatPanel
  }) => {
  const [msgOuterHeight, setMsgOuterHeight] = useState(MIN_MSG_OUTER_HEIGHT);

  const handleInputSizeChanged = (changedHeight) => {
    if (changedHeight < 0) {
      setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT);
    } else {
      setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT + changedHeight);
    }
  };

  const handleSendMessage = (msg) => {
    const newMessage = {
      _id: generateHash(),
      rid: selectedRoom.rid,
      msg
    };
    sendNewMessage(socket, newMessage, therapist.id);
  };

  return (
    <>
      {selectedRoom ? (
        <>
          <div className="chat-message-header">
            <h4 className="font-weight-bold mb-0 d-flex align-items-center">
              <Button variant="link" className="d-md-none btn-back" onClick={() => hideChatPanel(true)}>
                <BsChevronLeft size={18} color="#0077C8" />
              </Button>
              {selectedRoom.name}
              {userStatus(selectedRoom, 'md')}
            </h4>
          </div>
          <Message
            translate={translate}
            messages={messages}
            currentUser={therapist.chat_user_id}
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
  therapist: PropTypes.object,
  socket: PropTypes.object,
  selectedRoom: PropTypes.object,
  messages: PropTypes.array,
  hideChatPanel: PropTypes.func
};

export default ChatPanel;
