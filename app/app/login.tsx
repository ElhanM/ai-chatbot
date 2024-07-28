import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import Button from '@/components/forms/Button';
import Input from '@/components/forms/Input';
import LoadingSpinner from '@/components/Loading';
import { useGuardStore } from '@/store/useGuardStore';
import { useLoginStore } from '@/store/useLoginStore';
import { useShallow } from 'zustand/react/shallow';
import * as z from 'zod';
import { schema } from '@/zod-schemas/login';

type LoginFormInputs = z.infer<typeof schema>;

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(schema),
  });

  const { login, loading } = useLoginStore(
    useShallow((state) => ({
      login: state.login,
      loading: state.loading,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  const handleLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    const { email, password } = data;
    await login(email, password);

    if (!error) {
      reset();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View className="flex-1 bg-black justify-center items-center px-5">
      <Text className="text-white text-3xl font-bold mb-8">Login</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            errorMessage={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            errorMessage={errors.password?.message}
          />
        )}
      />

      <Button title="Log in" onPress={handleSubmit(handleLogin)} classNameProp="self-stretch" />
      <Link href="/register" className="text-blue-500 mt-5">
        Don't have an account? Register
      </Link>
    </View>
  );
};

export default Login;
