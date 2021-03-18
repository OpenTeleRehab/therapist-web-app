const settings = {
  date_format: 'DD/MM/YYYY',
  chat_date_time_format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  textMaxLength: 255,
  genders: {
    options: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'Female' }
    ]
  },
  noteMaxLength: 50,
  educationMaterial: {
    maxFileSize: 25 // MB
  }
};

export default settings;
