import { isCancel } from 'axios';
import axios from 'utils/axios';
import _ from 'lodash';

const getEducationMaterials = payload => {
  if (window.materialAbortController !== undefined) {
    window.materialAbortController.abort();
  }

  window.materialAbortController = new AbortController();

  return axios.get('/education-material', {
    params: payload,
    signal: window.materialAbortController.signal
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

const getEducationMaterial = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/education-material/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createEducationMaterial = (payload) => {
  const formData = new FormData();
  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post('/education-material', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const translateEducationMaterial = (payload) => {
  const formData = new FormData();
  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post('/education-material/suggest', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateEducationMaterial = (id, payload) => {
  const formData = new FormData();
  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post(`/education-material/${id}?_method=PUT`, formData, {
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

const updateFavorite = (id, payload) => {
  return axios.post(`/education-material/updateFavorite/by-therapist/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteEducationMaterial = id => {
  return axios.delete(`/education-material/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getEducationMaterialsByIds = (materialIds, lang, therapistId) => {
  const params = { material_ids: materialIds, lang: lang, therapist_id: therapistId };
  return axios.get('education-material/list/by-ids', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const EducationMaterial = {
  getEducationMaterials,
  getEducationMaterialsByIds,
  createEducationMaterial,
  updateEducationMaterial,
  getEducationMaterial,
  deleteEducationMaterial,
  updateFavorite,
  translateEducationMaterial
};
