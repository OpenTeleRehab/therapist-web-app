// @see https://github.com/batuhansahan/react-gifted-chat
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
  Day,
  Bubble,
  Message,
  MessageText,
  Time
} from 'react-gifted-chat';
import { Alert } from 'react-bootstrap';
import { MdSend } from 'react-icons/md';
import styles from './styles';
import { generateHash } from 'utils/general';
import settings from 'settings';
import { useSelector } from 'react-redux';

const MIN_COMPOSER_HEIGHT = 50;
const MIN_OUTER_HEIGHT = 150;
const ChatPanel = ({ translate, therapist }) => {
  const { selectedPatient, messages } = useSelector(state => state.rocketchat);
  const [allMessages, setAllMessages] = useState(messages || []);
  const [composerHeight, setComposerHeight] = useState(MIN_COMPOSER_HEIGHT);
  let outerHeight = MIN_OUTER_HEIGHT;

  useEffect(() => {
    setAllMessages(messages);
  }, [messages]);

  const handleAutoResize = (e) => {
    const diffValue = e.target.scrollHeight - MIN_COMPOSER_HEIGHT;
    if (diffValue > 0 && e.target.value !== '') {
      outerHeight = MIN_OUTER_HEIGHT + diffValue;
      setComposerHeight(e.target.scrollHeight);
    } else {
      outerHeight = MIN_OUTER_HEIGHT;
      setComposerHeight(MIN_COMPOSER_HEIGHT);
    }
  };

  const handleSendMessage = (newMessage) => {
    console.log(newMessage);
    setAllMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage));
  };

  const renderInputToolbar = (props) => {
    return <InputToolbar {...props} containerStyle={styles.chatInputToolBar(composerHeight)} />;
  };

  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        composerHeight={composerHeight}
        textInputStyle={styles.chatComposer}
        textInputProps={{
          onChange: (e) => handleAutoResize(e)
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={styles.chatSendButton}>
        <MdSend size={22} color="#0077C8" />
      </Send>
    );
  };

  const renderDay = (props) => {
    return <Day {...props} dateFormat={settings.date_format} textStyle={styles.chatDay} />;
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: styles.chatBubbleRight,
          left: styles.chatBubbleLeft
        }}
        tickStyle={styles.chatSendTick}
      />
    );
  };

  const renderMessage = (props) => {
    return <Message {...props} containerStyle={{ right: styles.chatMessageRight, left: styles.chatMessageLeft }} />;
  };

  const renderMessageText = (props) => {
    return (
      <MessageText
        {...props}
        textStyle={{
          right: styles.chatMessageTextRight,
          left: styles.chatMessageTextLeft
        }}
      />
    );
  };

  const renderTime = (props) => {
    return (
      <Time
        {...props}
        textStyle={{ right: styles.chatTimeRight, left: styles.chatTimeLeft }}
        containerStyle={{ right: styles.chatTimeContainerRight }}
      />
    );
  };

  return (
    <>
      {selectedPatient ? (
        <>
          <div className="chat-selected-user">
            <h4 className="font-weight-bold mb-0">{selectedPatient.last_name} {selectedPatient.first_name}</h4>
          </div>
          <div className="chat-message-panel" style={{ height: `calc(100vh - ${outerHeight}px)` }}>
            <GiftedChat
              placeholder={translate('chat.type.message')}
              messages={allMessages}
              user={{ _id: therapist.chat_user_id }}
              messageIdGenerator={() => generateHash()}
              onSend={(newMessage) => handleSendMessage(newMessage)}
              renderInputToolbar={renderInputToolbar}
              renderComposer={renderComposer}
              renderSend={renderSend}
              renderDay={renderDay}
              renderBubble={renderBubble}
              renderMessage={renderMessage}
              renderMessageText={renderMessageText}
              renderTime={renderTime}
              renderAvatar={null}
            />
          </div>
        </>
      ) : (
        <Alert variant="info" className="mt-3">Please select any patient to chat.</Alert>
      )}
    </>
  );
};

ChatPanel.propTypes = {
  translate: PropTypes.func,
  therapist: PropTypes.object
};

export default ChatPanel;
