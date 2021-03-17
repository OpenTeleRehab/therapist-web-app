// @see https://github.com/batuhansahan/react-gifted-chat
import React, { useState } from 'react';
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

const MIN_COMPOSER_HEIGHT = 50;
const ChatPanel = ({ translate, user, data }) => {
  const { selectedPatient } = data;
  const [messages, setMessages] = useState([
    {
      _id: generateHash(),
      text: 'Nullam dictum felis eu pede mollis pretium. Donec sodales sagittis magna. Vestibulum dapibus nunc ac augue. Nam at tortor in tellus interdum sagittis. Pellentesque ut neque. Nullam dictum felis eu pede mollis pretium. Donec sodales sagittis magna. Vestibulum dapibus nunc ac augue. Nam at tortor in tellus interdum sagittis. Pellentesque ut neque.',
      createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
      user: {
        _id: generateHash()
      }
    },
    {
      _id: generateHash(),
      text: 'Nullam dictum felis eu pede mollis pretium. Donec sodales sagittis magna. Vestibulum dapibus nunc ac augue. Nam at tortor in tellus interdum sagittis. Pellentesque ut neque. Nullam dictum felis eu pede mollis pretium. Donec sodales sagittis magna. Vestibulum dapibus nunc ac augue. Nam at tortor in tellus interdum sagittis. Pellentesque ut neque.',
      createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
      user: {
        _id: user.chat_user_id
      }
    }
  ]);
  const [composerHeight, setComposerHeight] = useState(MIN_COMPOSER_HEIGHT);

  const handleAutoResize = (e) => {
    setComposerHeight(e.target.value === '' ? MIN_COMPOSER_HEIGHT : e.target.scrollHeight);
  };

  const handleSendMessage = (newMessage) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage));
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
    return <Day {...props} dateFormat="DD MMM YYYY" textStyle={styles.chatDay} />;
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: styles.chatBubbleRight,
          left: styles.chatBubbleLeft
        }}
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
    return <Time {...props} textStyle={{ right: styles.chatTimeRight, left: styles.chatTimeLeft }} />;
  };

  return (
    <>
      {selectedPatient ? (
        <>
          <div className="chat-selected-user">
            <h4 className="font-weight-bold mb-0">{selectedPatient.last_name} {selectedPatient.first_name}</h4>
          </div>
          <GiftedChat
            placeholder={translate('chat.type.message')}
            messages={messages}
            user={{ _id: user.chat_user_id }}
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
        </>
      ) : (
        <Alert variant="info" className="mt-3">Please select any patient to chat.</Alert>
      )}
    </>
  );
};

ChatPanel.propTypes = {
  translate: PropTypes.func,
  user: PropTypes.object,
  data: PropTypes.object
};

export default ChatPanel;
