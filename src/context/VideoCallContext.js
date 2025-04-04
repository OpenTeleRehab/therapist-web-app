import React, { createContext, useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { sendNewMessage, updateMessage } from '../utils/rocketchat';
import { showErrorNotification } from '../store/notification/actions';
import { getCallAccessToken, sendPodcastNotification } from '../store/rocketchat/actions';
import { CALL_STATUS } from '../variables/rocketchat';
import { mutation } from '../store/rocketchat/mutations';
import { generateHash, getParticipantName } from '../utils/general';
import RocketchatContext from './RocketchatContext';
import AppContext from './AppContext';

const VideoCallContext = createContext(null);

export const useVideoCallContext = () => useContext(VideoCallContext);

export const VideoCallContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const localize = useSelector((state) => state.localize);
  const { profile } = useSelector(state => state.auth);
  const translate = getTranslate(localize);
  const { idleTimer } = useContext(AppContext);
  const { authUserId, videoCall, chatRooms } = useSelector(state => state.rocketchat);
  const [hasParticipantInviting, setHasParticipantInviting] = useState(false);
  const [room, setRoom] = useState(undefined);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (room) {
      idleTimer.pause();
    } else {
      idleTimer.reset();
    }
  }, [room]);

  useEffect(() => {
    // Call busy listener
    if (videoCall && videoCall.status === CALL_STATUS.BUSY) {
      setTimeout(() => {
        if (participants.length === 0) {
          handleDisconnectRoom();

          dispatch(mutation.getCallAccessTokenSuccess(undefined));
          dispatch(mutation.removeVideoCallSuccess());
        }
        dispatch(showErrorNotification(translate('toast_title.jitsi_call_busy'), translate('error_message.jitsi_call_busy')));
      }, 3000);
    }

    // Missed or ended call listener
    if (videoCall && [CALL_STATUS.AUDIO_MISSED, CALL_STATUS.VIDEO_MISSED, CALL_STATUS.AUDIO_ENDED, CALL_STATUS.VIDEO_ENDED].includes(videoCall.status)) {
      if (videoCall.u._id !== authUserId || (videoCall.u._id === authUserId && participants.length === 0 && !hasParticipantInviting)) {
        handleDisconnectRoom();

        dispatch(mutation.getCallAccessTokenSuccess(undefined));
        dispatch(mutation.removeVideoCallSuccess());
      }
    }
  }, [room, videoCall, participants, hasParticipantInviting]);

  const handleSendMessage = (rid, identity, msg) => {
    const _id = generateHash();
    const newMessage = { _id, rid, msg };

    sendNewMessage(chatSocket, newMessage, profile.id);
    handlePodcastNotification(_id, rid, identity, msg);
  };

  const handleUpdateMessage = (_id, rid, identity, msg) => {
    updateMessage(chatSocket, { _id, rid, msg }, profile.id);
    handlePodcastNotification(_id, rid, identity, msg);
  };

  const handlePodcastNotification = (_id, rid, identity, msg) => {
    const title = profile.first_name + ' ' + profile.last_name;
    const notification = {
      _id,
      rid,
      identity,
      title,
      body: msg,
      translatable: false
    };
    dispatch(sendPodcastNotification(notification));
  };

  const handleAcceptCall = () => {
    dispatch(getCallAccessToken(videoCall.u._id));
  };

  const handleDeclineCall = () => {
    const _id = videoCall._id;
    const rid = videoCall.rid;
    const identity = videoCall.identity;

    if (room) {
      // TODO: handle missed or end call from host room
      if (authUserId === videoCall.u._id) {
        if (participants.length) {
          participants.map(participant => {
            const chatRoom = chatRooms.find(item => item.name === getParticipantName(participant.identity));

            if (chatRoom) {
              handleSendMessage(chatRoom.rid, chatRoom.name, videoCall.status === CALL_STATUS.AUDIO_STARTED ? CALL_STATUS.AUDIO_ENDED : CALL_STATUS.VIDEO_ENDED);
            }
          });
        } else {
          handleUpdateMessage(_id, rid, identity, videoCall.status === CALL_STATUS.AUDIO_STARTED ? CALL_STATUS.AUDIO_ENDED : CALL_STATUS.VIDEO_ENDED);
        }
      } else {
        handleUpdateMessage(_id, rid, identity, videoCall.status === CALL_STATUS.AUDIO_STARTED ? CALL_STATUS.AUDIO_ENDED : CALL_STATUS.VIDEO_ENDED);

        // Disconnect from twilio video room
        room.disconnect();

        // Cleanup videoCall and call access token from state
        dispatch(mutation.removeVideoCallSuccess());
        dispatch(mutation.getCallAccessTokenSuccess(undefined));
      }
    } else {
      handleUpdateMessage(_id, rid, identity, videoCall.status === CALL_STATUS.AUDIO_STARTED ? CALL_STATUS.AUDIO_MISSED : CALL_STATUS.VIDEO_MISSED);
    }
  };

  const handleDisconnectRoom = () => {
    if (room) {
      // Disconnect from room
      room.disconnect();

      // Stop local tracks
      if (room.localParticipant && room.localParticipant.tracks.length) {
        room.localParticipant.tracks.forEach(function (trackPublication) {
          trackPublication.track.stop();
        });
      }
    }
  };

  const handleAddParticipants = (items) => {
    setParticipants(items);
  };

  const handleAddRoom = (item) => {
    setRoom(item);
  };

  const toggleInvitation = (value) => {
    setHasParticipantInviting(value);
  };

  return (
    <VideoCallContext.Provider value={{
      handleSendMessage,
      handleUpdateMessage,
      handleAcceptCall,
      handleDeclineCall,
      handleAddParticipants,
      handleAddRoom,
      toggleInvitation
    }}>
      {children}
    </VideoCallContext.Provider>
  );
};

VideoCallContextProvider.propTypes = {
  children: PropTypes.node
};
