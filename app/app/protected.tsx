import Error from '@/components/Error';
import LoadingSpinner from '@/components/Loading';
import { useProtectedStore } from '@/store/useProtectedStore';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

const Protected = () => {
  const { data, error, loading, fetchProtected } = useProtectedStore(
    useShallow((state) => ({
      data: state.data,
      error: state.error,
      loading: state.loading,
      fetchProtected: state.fetchProtected,
    }))
  );

  useEffect(() => {
    fetchProtected();
  }, [fetchProtected]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-white mb-5">Protected Status: {data?.message}</Text>
    </View>
  );
};

export default Protected;
