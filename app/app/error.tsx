import Error from '@/components/Error';
import LoadingSpinner from '@/components/Loading';
import { useErrorStore } from '@/store/useErrorStore';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const Health = () => {
  const { error, loading, fetchError } = useErrorStore(
    useShallow((state) => ({
      error: state.error,
      loading: state.loading,
      fetchError: state.fetchError,
    }))
  );

  useEffect(() => {
    fetchError();
  }, [fetchError]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error error={error} />;
  }
};

export default Health;
