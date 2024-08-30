import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { FieldError } from 'react-hook-form';

type InputProps = {
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  errorMessage?: string | FieldError | undefined;
} & TextInputProps;

const Input = ({
  placeholder,
  secureTextEntry,
  onChangeText,
  errorMessage,
  ...props
}: InputProps) => {
  const errorText = errorMessage
    ? typeof errorMessage === 'string'
      ? errorMessage
      : errorMessage.message
    : undefined;

  return (
    <View className="self-stretch mb-4">
      <TextInput
        {...props}
        className="bg-gray-700 text-white rounded-full py-3 px-5"
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
      />
      {errorText ? <Text className="text-red-500 text-sm mt-1">{errorText}</Text> : null}
    </View>
  );
};

export default Input;
