import _ from 'lodash';

export const getChatRooms = (id, therapists) => {
  const therapist = _.findLast(therapists, { id });

  return therapist ? therapist.chat_rooms : '';
};

export const renderLeadAndSupplementTherapists = (profileId, therapists = [], translate) =>
  therapists
    .map((therapist) =>
      therapist.id === profileId
        ? `<b>${translate('common.user.full_name', { lastName: therapist.last_name, firstName: therapist.first_name })}</b>`
        : `${translate('common.user.full_name', { lastName: therapist.last_name, firstName: therapist.first_name })}`
    )
    .join(', ');
