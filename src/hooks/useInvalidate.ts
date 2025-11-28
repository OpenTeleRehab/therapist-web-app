import { useQueryClient } from '@tanstack/react-query';

export const useInvalidate = () => {
  const queryClient = useQueryClient();

  const invalidate = (resource: string | string[]) => {
    queryClient.invalidateQueries({
      queryKey: Array.isArray(resource) ? resource : [resource]
    });
  };

  return invalidate;
};
