import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import Button from '@/components/forms/Button';
import Input from '@/components/forms/Input';
import LoadingSpinner from '@/components/Loading';
import { useGuardStore } from '@/store/useGuardStore';
import { useRegisterStore } from '@/store/useRegisterStore';
import { useShallow } from 'zustand/react/shallow';
import { schema } from '@/zod-schemas/register';

type RegisterFormInputs = z.infer<typeof schema>;

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(schema),
  });

  const { register, loading } = useRegisterStore(
    useShallow((state) => ({
      register: state.register,
      loading: state.loading,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  const handleRegister: SubmitHandler<RegisterFormInputs> = async (data) => {
    const { name, email, password } = data;
    await register(name, email, password);

    if (!error) {
      reset();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View className="flex-1 bg-black justify-center items-center px-5">
      <Text className="text-white text-3xl font-bold mb-8">Register</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Name"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            errorMessage={errors.name?.message}
          />
        )}
      />

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

      <Button
        title="Register"
        onPress={handleSubmit(handleRegister)}
        classNameProp="self-stretch"
      />
      <Link href="/login" className="text-blue-500 mt-5">
        Already have an account? Login
      </Link>
    </View>
  );
};

export default Register;
