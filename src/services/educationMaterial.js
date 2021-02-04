import axios from 'utils/admin-axios';

const getEducationMaterials = payload => {
  return axios.get('/education-material', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getEducationMaterialsByIds = materialIds => {
  const params = { material_ids: materialIds };
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
  getEducationMaterialsByIds
};
