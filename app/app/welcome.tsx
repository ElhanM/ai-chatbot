import Button from '@/components/Button';
import React from 'react';
import { View, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Welcome = () => {
  const handleLogin = () => {
    // Handle login logic here
  };

  const handleSignUp = () => {
    // Handle signup logic here
  };

  return (
    <View style={styles.container} className="flex-1 bg-black justify-center items-center px-5">
      <Text className="text-white text-3xl font-bold mb-5">Get started</Text>
      <Button title="Log in" onPress={handleLogin} classNameProp="self-stretch" />
      <Button title="Sign up" onPress={handleSignUp} classNameProp="self-stretch" />
    </View>
  );
};

export default Welcome;

const styles = {
  container: {
    width,
  },
};
