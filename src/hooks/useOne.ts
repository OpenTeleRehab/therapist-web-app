import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axiosInstance from 'utils/axios';

type OptionsType = {
  params?: any;
  enabled?: boolean;
};

export const useOne = <T = any>(
  resource: string,
  id: string | number | null,
  options: OptionsType = {
    params: {},
    enabled: true
  }
): UseQueryResult<T> => {
  const { params, enabled } = options;

  let endPoint = `/${resource}`;

  if (id) {
    endPoint = `/${resource}/${id}`;
  }

  return useQuery<T>({
    queryKey: [resource, id, params],
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: T }>(endPoint, { params });
      return res.data.data;
    },
    enabled: enabled || !!id
  });
};
