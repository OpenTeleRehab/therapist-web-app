import axios from 'utils/admin-axios';

const getExercises = payload => {
  return axios.get('/exercise', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getExercisesByIds = (exerciseIds, lang) => {
  const params = { exercise_ids: exerciseIds, lang: lang };
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

export const Exercise = {
  getExercises,
  getExercisesByIds
};
