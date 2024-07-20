import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  classNameProp?: string;
  size?: ButtonSize;
};

const Button = ({ title, onPress, classNameProp, size }: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`bg-blue-600 rounded-full py-4 px-6 items-center my-2 
        ${classNameProp}
        ${size === ButtonSize.SMALL ? 'py-2 px-4' : ''}
        ${size === ButtonSize.MEDIUM ? 'py-3 px-5' : ''}
        ${size === ButtonSize.LARGE ? 'py-5 px-8' : ''}
      `}
      onPress={onPress}
    >
      <Text className="text-white text-lg font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
