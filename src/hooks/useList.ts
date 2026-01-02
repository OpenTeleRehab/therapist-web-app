import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { IListResponse } from 'interfaces/IListResponse';
import axiosInstance from 'utils/axios';

export const useList = <T>(
  resource: string,
  params: any = {},
  options?: Partial<UseQueryOptions<IListResponse<T>>>,
  headers?: Record<string, string>
): UseQueryResult<IListResponse<T>, unknown> => {
  return useQuery<IListResponse<T>>({
    queryKey: [resource, params, headers],
    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get<IListResponse<T>>(`/${resource}`, { params, signal, headers });

      return {
        ...response.data,
        data: response?.data?.data ?? response.data
      };
    },
    ...options
  });
};
