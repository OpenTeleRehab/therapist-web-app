import React, { useEffect, useRef, useState } from 'react';
import { connect, createLocalVideoTrack, createLocalAudioTrack, LocalDataTrack } from 'twilio-video';
import { useDispatch, useSelector } from 'react-redux';
import { useVideoCallContext } from '../../../../../context/VideoCallContext';
import PropTypes from 'prop-types';
import Participant from './Participant';
import CallingScreen from './CallingScreen';
import CallingControls from './CallingControls';
import LocalParticipant from './LocalParticipant';
import ParticipantInvitation from './ParticipantInvitation';
import { showErrorNotification } from '../../../../../store/notification/actions';
import { languages } from '../../../../../variables/webApiAvailableLanguages';
import { CALL_STATUS } from '../../../../../variables/rocketchat';
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
  const localize = useSelector((state) => state.localize);
  const { profile } = useSelector(state => state.auth);
  const { videoCall } = useSelector(state => state.rocketchat);
  const translate = getTranslate(localize);
  const { handleAddParticipants, handleAddRoom } = useVideoCallContext();
  const [room, setRoom] = useState();
  const [participants, setParticipants] = useState([]);
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(true);
  const isActive = useRef(true);

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

    connect(callAccessToken, {
      name: videoCall.u._id,
      video: videoCall && videoCall.status === CALL_STATUS.VIDEO_STARTED,
      audio: isAudioOn,
      networkQuality: { local: 3, remote: 3 }
    }).then(async (room) => {
      if (!isActive.current) {
        room.disconnect();
        return;
      }

      setRoom(room);

      const dataTrack = new LocalDataTrack();
      await room.localParticipant.publishTrack(dataTrack);

      room.participants.forEach(participantConnected);

      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
    }).catch(error => {
      if ('code' in error) {
        // Handle connection error here.
        dispatch(showErrorNotification('Failed to join room', error.message));
      }
    });

    return () => {
      isActive.current = false;
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

  return (
    <>
      <ParticipantInvitation participants={participants} isVideoOn={isVideoOn}/>

      {participants.length === 0 ? (
        <CallingScreen
          isVideoOn={isVideoOn}
          isAudioOn={isAudioOn}
          setIsVideoOn={toggleVideo}
          setIsAudioOn={toggleAudio}
        />
      ) : (
        <div className="room">
          <h6 className="text-white participant-name">
            {profile.first_name} {profile.last_name}
          </h6>
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
          <div className="remote">
            {participants.map(participant => (
              <Participant key={participant.identity} participant={participant}/>
            ))}
          </div>
          <div className="local">
            {room && (
              <LocalParticipant
                participant={room.localParticipant}
                isVideoOn={isVideoOn}
                isAudioOn={isAudioOn}
                selectedTranscriptingLanguage={selectedTranscriptingLanguage}
                setSpeechRecognitionAvailable={setSpeechRecognitionAvailable}
              />
            )}
          </div>
          <div className="fixed-bottom">
            <CallingControls
              isVideoOn={isVideoOn}
              isAudioOn={isAudioOn}
              setIsVideoOn={toggleVideo}
              setIsAudioOn={toggleAudio}
            />
          </div>
        </div>
      )}
    </>
  );
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
