import Error from '@/components/Error';
import LoadingSpinner from '@/components/Loading';
import { useErrorStore } from '@/store/useErrorStore';
import React, { useEffect } from 'react';

const Health = () => {
  const { error, loading, fetchError } = useErrorStore();

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
