import { isCancel } from 'axios';
import axios from 'utils/axios';
import _ from 'lodash';

const getExercises = payload => {
  if (window.exerciseAbortController !== undefined) {
    window.exerciseAbortController.abort();
  }

  window.exerciseAbortController = new AbortController();

  return axios.get('/exercise', {
    params: payload,
    signal: window.exerciseAbortController.signal
  })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      if (isCancel(e)) {
        return e;
      }
      return e.response.data;
    });
};

const getExercise = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/exercise/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getExercisesByIds = (exerciseIds, lang, therapistId) => {
  const params = { exercise_ids: exerciseIds, lang: lang, therapist_id: therapistId };
  return axios.get('exercise/list/by-ids', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const countTherapistLibraries = (therapistId) => {
  const params = { therapist_id: therapistId };
  return axios.get('library/count/by-therapist', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateFavorite = (id, payload) => {
  return axios.post(`/exercise/updateFavorite/by-therapist/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createExercise = (payload, mediaUploads) => {
  const formData = new FormData();

  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  _.forIn(mediaUploads, (value, key) => {
    if (value.file) {
      formData.append(key, value.file);
    } else {
      formData.append('media_files[]', value.id);
    }
  });

  return axios.post('/exercise', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateExercise = (id, payload, mediaUploads) => {
  const formData = new FormData();

  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  const oldMediaFiles = _.filter(mediaUploads, item => {
    return item.id !== undefined;
  });

  if (oldMediaFiles.length) {
    const oldMediaFileIds = _.map(oldMediaFiles, item => {
      return item.id !== undefined && item.id;
    });

    formData.append('media_files', oldMediaFileIds.toString());
  }

  _.forIn(mediaUploads, (value, key) => {
    if (value.file) {
      formData.append(key, value.file);
    }
  });

  return axios.post(`/exercise/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteExercise = id => {
  return axios.delete(`/exercise/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const translateExercise = (payload) => {
  const formData = new FormData();
  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post('/exercise/suggest', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Exercise = {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  getExercisesByIds,
  countTherapistLibraries,
  updateFavorite,
  translateExercise
};
