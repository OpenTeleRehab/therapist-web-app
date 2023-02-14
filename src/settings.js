const acceptImageTypes = 'image/gif, image/jpeg, image/jpg, image/png';

const settings = {
  date_format: 'DD/MM/YYYY',
  time_format: 'HH:MM',
  textMaxLength: 255,
  fileMaxUploadSize: 100, // MB
  genders: {
    options: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
      { text: 'Other', value: 'other' }
    ]
  },
  noteMaxLength: 50,
  educationMaterial: {
    maxFileSize: 100, // MB
    acceptFileTypes: `audio/*, video/*, .pdf, ${acceptImageTypes}`
  },
  exercise: {
    acceptFileTypes: `audio/*, video/*, ${acceptImageTypes}`
  },
  question: {
    acceptImageTypes: acceptImageTypes
  },
  maxAge: 80,
  minAge: 0,
  ageGap: 10,
  male: 'male',
  female: 'female',
  other: 'other',
  appIdleTimeout: 180 // in second
};

export default settings;
