import settings from 'settings';

export const formatFileSize = (bytes) => {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

export const toMB = (bytes) => {
  return bytes / Math.pow(1024, 2);
};

export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export const isValidFileSize = (fileSize, maxFileSize = 0) => {
  let defaultMaxSize = settings.fileMaxUploadSize;
  if (maxFileSize > 0) {
    defaultMaxSize = maxFileSize;
  }
  return fileSize <= defaultMaxSize;
};

export const isValidFileMineType = (fileMineType) => {
  return fileMineType.includes('video') || fileMineType.includes('image');
};
