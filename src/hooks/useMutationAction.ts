import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'utils/axios';

type MutationProps<T> = {
  id?: string | number;
  payload?: T;
  method?: 'post' | 'put' | 'patch';
  invalidateKeys?: string[];
};

export const useMutationAction = <T = any>(resource: string) => {
  const queryClient = useQueryClient();

  return useMutation<T, unknown, MutationProps<T>>({
    mutationFn: async ({ id, payload, method = 'post' }: MutationProps<T>) => {
      const url = id ? `/${resource}/${id}` : `/${resource}`;
      const { data } = await axiosInstance.request<T>({ url, method, data: payload });
      return data;
    },
    onSuccess: (_, { id, invalidateKeys }) => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      queryClient.invalidateQueries({ queryKey: [resource, id] });
      if (invalidateKeys) {
        invalidateKeys.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      }
    }
  });
};
