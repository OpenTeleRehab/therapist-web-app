import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'utils/axios';

export const useCreate = <T>(resource: string) => {
  const queryClient = useQueryClient();

  return useMutation<any, unknown, T>({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post<T>(`/${resource}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    }
  });
};
