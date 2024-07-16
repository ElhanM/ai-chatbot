import { useRootNavigationState, Redirect } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );

  return <Redirect href={'/chats'} />;
}
