import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  classNameProp?: string;
};

const Button = ({ title, onPress, classNameProp }: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`bg-blue-600 rounded-full py-4 px-6 items-center my-2 ${classNameProp}`}
      onPress={onPress}
    >
      <Text className="text-white text-lg font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
