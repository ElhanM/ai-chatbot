import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
  disabled?: boolean;
  icon?: ReactNode;
};

const Button = ({ title, onPress, classNameProp, size, disabled = false, icon }: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`bg-blue-600 rounded-full py-4 px-6 items-center my-2
        ${classNameProp}
        ${size === ButtonSize.SMALL ? 'py-2 px-4' : ''}
        ${size === ButtonSize.MEDIUM ? 'py-3 px-5' : ''}
        ${size === ButtonSize.LARGE ? 'py-5 px-8' : ''}
        ${disabled ? 'opacity-50' : ''}
      `}
      onPress={onPress}
      disabled={disabled}
    >
      <View className="flex flex-row items-center">
        {icon && <View className="mr-2">{icon}</View>}
        <Text className="text-white text-lg font-bold">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
