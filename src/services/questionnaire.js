import { isCancel } from 'axios';
import axios from 'utils/axios';
import _ from 'lodash';
import { getCountryIsoCode } from '../utils/country';

const getQuestionnaires = payload => {
  if (window.questionnaireAbortController !== undefined) {
    window.questionnaireAbortController.abort();
  }

  window.questionnaireAbortController = new AbortController();

  return axios.get('/questionnaire', {
    params: payload,
    signal: window.questionnaireAbortController.signal
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

const getQuestionnaire = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/questionnaire/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createQuestionnaire = (payload) => {
  const formData = new FormData();
  formData.append('lang', payload.lang);
  formData.append('therapist_id', payload.therapist_id);
  formData.append('data', JSON.stringify(payload));

  _.forEach(payload.questions, (question, index) => {
    if (question.file) {
      formData.append(index, question.file);
    }
  });

  return axios.post('/questionnaire', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const translateQuestionnaire = (payload) => {
  const formData = new FormData();
  formData.append('lang', payload.lang);
  formData.append('therapist_id', payload.therapist_id);
  formData.append('data', JSON.stringify(payload));

  return axios.post('/questionnaire/suggest', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateQuestionnaire = (id, payload) => {
  const formData = new FormData();
  formData.append('lang', payload.lang);
  formData.append('therapist_id', payload.therapist_id);
  formData.append('data', JSON.stringify(payload));

  _.forEach(payload.questions, (question, index) => {
    const { file, id } = question;

    // Skip if an existing file already has an ID
    if (file?.id) return;

    // Append either new file or mark as having no file
    if (file instanceof File) {
      formData.append(index, file);
    } else {
      formData.append('no_file_questions[]', id);
    }
  });

  return axios.post(`/questionnaire/${id}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteQuestionnaire = id => {
  return axios.delete(`/questionnaire/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getQuestionnairesByIds = (materialIds, lang, therapistId) => {
  const params = { questionnaire_ids: materialIds, lang: lang, therapist_id: therapistId };
  return axios.get('questionnaire/list/by-ids', { params })
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
  return axios.post(`/questionnaire/updateFavorite/by-therapist/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const downloadQuestionnaireResults = (language, countryId) => {
  return axios.get('/export', { params: { lang: language, type: 'questionnaire_result' }, headers: { country: getCountryIsoCode(countryId) } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Questionnaire = {
  getQuestionnaires,
  getQuestionnairesByIds,
  updateFavorite,
  getQuestionnaire,
  createQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
  translateQuestionnaire,
  downloadQuestionnaireResults
};
