import _ from 'lodash';

export const getChatRooms = (id, therapists) => {
  const therapist = _.findLast(therapists, { id });

  return therapist ? therapist.chat_rooms : '';
};

export const renderLeadAndSupplementTherapists = (profileId, therapists = []) =>
  therapists
    .map((therapist) =>
      therapist.id === profileId
        ? `<b>${therapist.first_name} ${therapist.last_name}</b>`
        : `${therapist.first_name} ${therapist.last_name}`
    )
    .join(', ');
