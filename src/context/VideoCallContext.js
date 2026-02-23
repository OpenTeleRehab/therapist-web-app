import React, { createContext, useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { sendNewMessage, updateMessage } from '../utils/rocketchat';
import { showErrorNotification } from '../store/notification/actions';
import { getCallAccessToken, sendPodcastNotification } from '../store/rocketchat/actions';
import { CALL_STATUS } from '../variables/rocketchat';
import { mutation } from '../store/rocketchat/mutations';
import { generateHash } from '../utils/general';
import RocketchatContext from './RocketchatContext';
import AppContext from './AppContext';
import _ from 'lodash';

const VideoCallContext = createContext(null);

export const useVideoCallContext = () => useContext(VideoCallContext);

export const VideoCallContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const localize = useSelector((state) => state.localize);
  const { profile } = useSelector(state => state.auth);
  const translate = getTranslate(localize);
  const { idleTimer } = useContext(AppContext);
  const {
    authUserId,
    callAccessToken,
    chatRooms,
    videoCall,
    hasStartedCall,
    hasAcceptedCall
  } = useSelector(state => state.rocketchat);
  const [hasParticipantInviting, setHasParticipantInviting] = useState(false);
  const [room, setRoom] = useState(undefined);
  const [participants, setParticipants] = useState([]);
  const [invitingParticipants, setInvitingParticipants] = useState([]);

  useEffect(() => {
    if (room) {
      idleTimer.pause();
    } else {
      idleTimer.reset();
    }
  }, [room]);

  useEffect(() => {
    if (_.isEmpty(videoCall)) {
      dispatch(mutation.showIncomingCallSuccess(false));
      dispatch(mutation.showAcceptedCallSuccess(false));

      dispatch(mutation.setHasStartedCallSuccess(false));
      dispatch(mutation.setHasAcceptedCallSuccess(false));
    }
  }, [videoCall]);

  useEffect(() => {
    // Call started listener
    if (videoCall && [CALL_STATUS.AUDIO_STARTED, CALL_STATUS.VIDEO_STARTED].includes(videoCall.status)) {
      if (videoCall.u._id !== authUserId && !hasStartedCall && !hasAcceptedCall) {
        dispatch(mutation.showIncomingCallSuccess(true));
      }
    }

    // Call missed listener
    if (videoCall && [CALL_STATUS.AUDIO_MISSED, CALL_STATUS.VIDEO_MISSED].includes(videoCall.status)) {
      if (callAccessToken === undefined) {
        dispatch(mutation.removeVideoCallSuccess());
      }

      if (callAccessToken && !hasParticipantInviting && participants.length === 0) {
        dispatch(mutation.getCallAccessTokenSuccess(undefined));
        dispatch(mutation.removeVideoCallSuccess());
      }
    }

    // Call accepted listener
    if (videoCall && videoCall.status === CALL_STATUS.ACCEPTED && callAccessToken === undefined) {
      if (hasStartedCall || hasAcceptedCall) {
        // Get call access token
        dispatch(getCallAccessToken(videoCall.u._id));

        // Hide incoming call
        dispatch(mutation.showIncomingCallSuccess(false));

        // Show accepted call
        dispatch(mutation.showAcceptedCallSuccess(true));
      } else {
        // Remove video call
        dispatch(mutation.removeVideoCallSuccess());
      }
    }

    // Call busy listener
    if (videoCall && videoCall.status === CALL_STATUS.BUSY && callAccessToken === undefined) {
      dispatch(mutation.removeVideoCallSuccess());
      dispatch(showErrorNotification(translate('toast_title.jitsi_call_busy'), translate('error_message.jitsi_call_busy')));
    }

    // Call ended listener
    if (videoCall && [CALL_STATUS.AUDIO_ENDED, CALL_STATUS.VIDEO_ENDED].includes(videoCall.status)) {
      if (callAccessToken) {
        if (hasAcceptedCall || (hasStartedCall && participants.length === 0)) {
          // Stop and unpublish camera tracking
          room?.localParticipant?.videoTracks?.forEach(function (publication) {
            publication.unpublish();
            publication.track.stop();
            publication.track.detach();
          });

          // Disconnect from room
          room?.disconnect();
        }
      } else {
        // Remove video call
        dispatch(mutation.removeVideoCallSuccess());
      }
    }
  }, [room, videoCall, participants, hasParticipantInviting]);

  const handleSendMessage = (_id, rid, identity, msg) => {
    const newMessage = { _id, rid, msg };

    sendNewMessage(chatSocket, newMessage, profile.id);
    handlePodcastNotification(_id, rid, identity, msg);
  };

  const handleUpdateMessage = (_id, rid, msg) => {
    updateMessage(chatSocket, { _id, rid, msg }, profile.id);
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
    // Send accepted call message
    handleUpdateMessage(videoCall._id, videoCall.rid, CALL_STATUS.ACCEPTED);

    // Hide incoming call
    dispatch(mutation.showIncomingCallSuccess(false));

    // Show accepted call
    dispatch(mutation.showAcceptedCallSuccess(true));

    // Set has accepted call
    dispatch(mutation.setHasAcceptedCallSuccess(true));
  };

  const handleDeclineCall = () => {
    if (room?.name === authUserId) {
      if (participants.length) {
        participants.map(participant => {
          const chatRoom = chatRooms.find(item => participant.identity.includes(item.u.username + '###'));
          if (chatRoom) {
            const _id = generateHash();
            const rid = chatRoom.rid;
            const identity = chatRoom.name;
            const msg = videoCall.status === CALL_STATUS.AUDIO_STARTED ? CALL_STATUS.AUDIO_ENDED : CALL_STATUS.VIDEO_ENDED;

            handleSendMessage(_id, rid, identity, msg);
          }
        });
      }

      if (invitingParticipants.length) {
        const msg = videoCall.status === CALL_STATUS.AUDIO_STARTED ? CALL_STATUS.AUDIO_MISSED : CALL_STATUS.VIDEO_MISSED;

        invitingParticipants.map(participant => {
          handleUpdateMessage(participant._id, participant.rid, msg);
        });
      }
    } else {
      const _id = videoCall._id;
      const rid = videoCall.rid;

      if (callAccessToken) {
        const msg = videoCall.status === CALL_STATUS.AUDIO_STARTED ? CALL_STATUS.AUDIO_ENDED : CALL_STATUS.VIDEO_ENDED;

        handleUpdateMessage(_id, rid, msg);
      } else {
        const chatRoom = chatRooms.find(cr => cr.u._id === videoCall.rid.replace(videoCall.u._id, ''));
        const msg = videoCall.status === CALL_STATUS.AUDIO_STARTED ? CALL_STATUS.AUDIO_MISSED : CALL_STATUS.VIDEO_MISSED;

        handleUpdateMessage(_id, rid, msg);

        if (chatRoom?.u?.username) {
          handlePodcastNotification(_id, rid, chatRoom.u.username, msg);
        }
      }
    }

    // Stop and unpublish camera tracking
    room?.localParticipant?.videoTracks?.forEach(function (publication) {
      publication.unpublish();
      publication.track.stop();
      publication.track.detach();
    });

    // Disconnect from room
    room?.disconnect();
  };

  const handleAddParticipants = (items) => {
    setParticipants(items);
  };

  const handleAddInvitingParticipants = (items) => {
    setInvitingParticipants(items);
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
      handleAddInvitingParticipants,
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
