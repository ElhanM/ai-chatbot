import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

type InputProps = {
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
} & TextInputProps;

const Input = ({ placeholder, secureTextEntry, onChangeText, ...props }: InputProps) => {
  return (
    <TextInput
      {...props}
      className="bg-gray-700 text-white rounded-full py-3 px-5 mb-4 self-stretch"
      placeholder={placeholder}
      placeholderTextColor="#bbb"
      secureTextEntry={secureTextEntry}
      onChangeText={onChangeText}
    />
  );
};

export default Input;
