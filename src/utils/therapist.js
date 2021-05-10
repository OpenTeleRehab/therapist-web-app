import _ from 'lodash';

export const getChatRooms = (id, therapists) => {
  const therapist = _.findLast(therapists, { id });

  return therapist ? therapist.chat_rooms : '';
};
