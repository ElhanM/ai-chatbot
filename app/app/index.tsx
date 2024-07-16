import Loading from '@/components/Loading';
import { Redirect, useRootNavigationState } from 'expo-router';

export default function Index() {
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key) return <Loading />;

  return <Redirect href={'/chats'} />;
}
