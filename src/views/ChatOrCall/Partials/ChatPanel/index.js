import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { generateHash } from 'utils/general';
import { sendNewMessage } from 'utils/rocketchat';
import Message from './Message';
import InputToolbar from './InputToolbar';

const MIN_MSG_OUTER_HEIGHT = 200;
const ChatPanel = (
  {
    translate,
    userStatus,
    therapist,
    socket,
    selectedRoom,
    messages
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
              {selectedRoom.name}
              {userStatus(selectedRoom, 'md')}
            </h4>
          </div>
          <Message
            messages={messages}
            currentUser={therapist.chat_user_id}
            msgOuterHeight={msgOuterHeight}
          />
          <InputToolbar
            placeholder={translate('placeholder.type.message')}
            onSend={handleSendMessage}
            onInputSizeChanged={handleInputSizeChanged}
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
  messages: PropTypes.array
};

export default ChatPanel;
