import settings from 'settings';
import axios from 'utils/axios';

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

export const downloadFile = async (path) => {
  if (path) {
    try {
      const response = await axios.get('/download-file?path=' + path, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const objectUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectUrl;

      // Extract filename from content-disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'downloaded-file';

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          filename = match[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
};
