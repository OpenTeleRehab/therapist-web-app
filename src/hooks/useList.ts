import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { IListResponse } from 'interfaces/IListResponse';
import axiosInstance from 'utils/axios';

export const useList = <T>(
  resource: string,
  params: any = {},
  options?: Partial<UseQueryOptions<IListResponse<T>>>
): UseQueryResult<IListResponse<T>, unknown> => {
  return useQuery<IListResponse<T>>({
    queryKey: [resource, params],
    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get<IListResponse<T>>(`/${resource}`, { params, signal });

      return {
        ...response.data,
        data: response?.data?.data ?? response.data
      };
    },
    ...options
  });
};
