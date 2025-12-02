import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import useToast from 'components/V2/Toast';
import useTranslate from 'hooks/useTranslate';

type ReactQueryProviderProps = {
  children: React.ReactNode;
}

const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  const { showToast } = useToast();
  const t = useTranslate();

  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 60 * 1000
        }
      },
      mutationCache: new MutationCache({
        onError: (error: any) => {
          showToast({
            title: t('toast_title.error_message') as any,
            message: t(error.response.data.message || ''),
            color: 'danger'
          });
        }
      })
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

ReactQueryProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ReactQueryProvider;
