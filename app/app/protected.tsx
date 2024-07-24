import Error from '@/components/Error';
import LoadingSpinner from '@/components/Loading';
import { useGuardStore } from '@/store/useGuardStore';
import { useProtectedStore } from '@/store/useProtectedStore';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

const Protected = () => {
  const { data, loading, fetchProtected } = useProtectedStore(
    useShallow((state) => ({
      data: state.data,
      loading: state.loading,
      fetchProtected: state.fetchProtected,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

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
