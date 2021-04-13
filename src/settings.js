const settings = {
  date_format: 'DD/MM/YYYY',
  textMaxLength: 255,
  fileMaxUploadSize: 25, // MB
  genders: {
    options: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
      { text: 'Other', value: 'other' }
    ]
  },
  noteMaxLength: 50,
  educationMaterial: {
    maxFileSize: 25 // MB
  },
  maxAge: 80,
  minAge: 0,
  ageGap: 10,
  male: 'male',
  female: 'female'
};

export default settings;
