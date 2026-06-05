import React, { useEffect, useRef, useState } from 'react';
import { connect, createLocalVideoTrack, createLocalAudioTrack, LocalDataTrack } from 'twilio-video';
import { useDispatch, useSelector } from 'react-redux';
import { useVideoCallContext } from '../../../../../context/VideoCallContext';
import { mutation } from '../../../../../store/rocketchat/mutations';
import PropTypes from 'prop-types';
import Participant from './Participant';
import CallingControls from './CallingControls';
import LocalParticipant from './LocalParticipant';
import ParticipantInvitation from './ParticipantInvitation';
import { showErrorNotification } from '../../../../../store/notification/actions';
import { languages } from '../../../../../variables/webApiAvailableLanguages';
import Select from 'react-select';
import { getTranslate } from 'react-localize-redux';

const Room = ({
  callAccessToken,
  isVideoOn,
  isAudioOn,
  selectedTranscriptingLanguage,
  setIsVideoOn,
  setIsAudioOn,
  setSelectedTranscriptingLanguage
}) => {
  const dispatch = useDispatch();
  const isActive = useRef(true);
  const timerRef = useRef(null);
  const callStartRef = useRef(null);
  const { handleDeclineCall } = useVideoCallContext();
  const localize = useSelector((state) => state.localize);
  const { videoCall } = useSelector(state => state.rocketchat);
  const translate = getTranslate(localize);
  const { handleAddParticipants, handleAddRoom } = useVideoCallContext();
  const [room, setRoom] = useState();
  const [participants, setParticipants] = useState([]);
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [showAutoEndCallHint, setShowAutoEndCallHint] = useState(false);

  useEffect(() => {
    handleAddParticipants(participants);
  }, [participants]);

  useEffect(() => {
    handleAddRoom(room);
  }, [room]);

  useEffect(() => {
    const participantConnected = participant => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = participant => {
      setParticipants((prevParticipants) => prevParticipants.filter(item => item.identity !== participant.identity));
    };

    const disconnected = () => {
      // Remove call access token
      dispatch(mutation.getCallAccessTokenSuccess(undefined));

      // Remove video call
      dispatch(mutation.removeVideoCallSuccess());
    };

    connect(callAccessToken, {
      name: videoCall.u._id,
      video: isVideoOn,
      audio: isAudioOn,
      networkQuality: { local: 3, remote: 3 }
    }).then(async (room) => {
      if (!isActive.current) {
        stopCallTimer();
        room.disconnect();
        return;
      }

      startCallTimer();

      setRoom(room);

      const dataTrack = new LocalDataTrack();
      await room.localParticipant.publishTrack(dataTrack);

      room.participants.forEach(participantConnected);

      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.on('disconnected', disconnected);
    }).catch(error => {
      if ('code' in error) {
        // Handle connection error here.
        dispatch(showErrorNotification('Failed to join room', error.message));
      }
    });

    return () => {
      isActive.current = false;
      stopCallTimer();
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, []);

  useEffect(() => {
    if (participants.length) {
      setShowAutoEndCallHint(false);
    } else {
      if (callDuration >= 15) {
        setShowAutoEndCallHint(true);
      }
      if (callDuration >= 20) {
        stopCallTimer();

        handleDeclineCall();
      }
    }
  }, [callDuration, participants, room]);

  const startCallTimer = () => {
    callStartRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const diff = Math.floor((Date.now() - callStartRef.current) / 1000);
      setCallDuration(diff);
    }, 1000);
  };

  const stopCallTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const toggleVideo = async () => {
    if (room === undefined) {
      return;
    }

    const toggleVideoOn = !isVideoOn;
    if (toggleVideoOn) {
      const videoTrack = await createLocalVideoTrack();
      await room.localParticipant.publishTrack(videoTrack);
    } else {
      room.localParticipant.videoTracks.forEach(publication => {
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });
    }

    setIsVideoOn(toggleVideoOn);
  };

  const toggleAudio = async () => {
    if (room === undefined) {
      return;
    }

    const toggleAudioOn = !isAudioOn;
    if (toggleAudioOn) {
      const audioTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(audioTrack);
    } else {
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });
    }

    setIsAudioOn(toggleAudioOn);
  };

  if (room) {
    return (
      <div className="room">
        <div className="transcript-language">
          <Select
            isDisabled={!speechRecognitionAvailable}
            classNamePrefix="filter"
            value={languages.filter(option => option.code === selectedTranscriptingLanguage)}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.code}
            options={languages}
            onChange={(e) => setSelectedTranscriptingLanguage(e.code)}
            aria-label="Language"
          />
          {!speechRecognitionAvailable && (
            <p className="text-danger">
              {translate('common.transcript.not.available')}
            </p>
          )}
        </div>
        {showAutoEndCallHint && (
          <div className="end-call-hint">
            <p className="text-danger text-center">
              {translate('chat_message.no_participants_auto_end_call')}
            </p>
          </div>
        )}
        <div className="remote">
          {participants.map(participant => (
            <Participant key={participant.identity} participant={participant}/>
          ))}
        </div>
        <div className="local">
          <LocalParticipant
            isVideoOn={isVideoOn}
            isAudioOn={isAudioOn}
            participant={room.localParticipant}
            selectedTranscriptingLanguage={selectedTranscriptingLanguage}
            setSpeechRecognitionAvailable={setSpeechRecognitionAvailable}
          />
        </div>
        <ParticipantInvitation
          isVideoOn={isVideoOn}
          participants={participants}
          room={room}
        />
        <CallingControls
          isVideoOn={isVideoOn}
          isAudioOn={isAudioOn}
          setIsVideoOn={toggleVideo}
          setIsAudioOn={toggleAudio}
        />
      </div>
    );
  }

  return null;
};

Room.propTypes = {
  callAccessToken: PropTypes.string,
  isVideoOn: PropTypes.bool,
  isAudioOn: PropTypes.bool,
  selectedTranscriptingLanguage: PropTypes.string,
  setIsVideoOn: PropTypes.func,
  setIsAudioOn: PropTypes.func,
  setSelectedTranscriptingLanguage: PropTypes.func
};

export default Room;
