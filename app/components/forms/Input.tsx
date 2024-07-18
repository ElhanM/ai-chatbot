import React from 'react';
import { TextInput } from 'react-native';

type InputProps = {
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
};

const Input = ({ placeholder, secureTextEntry, onChangeText }: InputProps) => {
  return (
    <TextInput
      className="bg-gray-700 text-white rounded-full py-3 px-5 mb-4 self-stretch"
      placeholder={placeholder}
      placeholderTextColor="#bbb"
      secureTextEntry={secureTextEntry}
      onChangeText={onChangeText}
    />
  );
};

export default Input;
