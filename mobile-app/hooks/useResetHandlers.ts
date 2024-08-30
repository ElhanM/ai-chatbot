import { useGuardStore } from '@/store/useGuardStore';
import { useLoginStore } from '@/store/useLoginStore';
import { useDrawerStore } from '@/store/useDrawerStore';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/store/useUserStore';
import { useGetLatestConversationStore } from '@/store/api/useGetLatestConversationStore';
import { useChatMessagesStore } from '@/store/api/useChatMessagesStore';
import { useClearTokensStore } from '@/store/api/useClearTokensStore';
import { useCreateConversationStore } from '@/store/api/useCreateConversationStore';
import { useSelectedConversationStore } from '@/store/api/useSelectedConversationStore';
import { useRegisterStore } from '@/store/useRegisterStore';
import { useConversationsStore } from '@/store/api/useConversationStore';

export const useResetHandlers = () => {
  const { reset: resetGuard } = useGuardStore(useShallow((state) => ({ reset: state.reset })));
  const { onGuardFailure, reset: resetLoginStore } = useLoginStore(
    useShallow((state) => ({ onGuardFailure: state.onGuardFailure, reset: state.reset }))
  );
  const { reset: resetDrawerState } = useDrawerStore(
    useShallow((state) => ({ reset: state.reset }))
  );

  const { reset: resetUserStore } = useUserStore(
    useShallow((state) => ({
      reset: state.reset,
    }))
  );
  const { reset: resetGetLatestConversationStore } = useGetLatestConversationStore(
    useShallow((state) => ({
      reset: state.reset,
    }))
  );

  const { reset: resetChatMessagesStore } = useChatMessagesStore(
    useShallow((state) => ({
      reset: state.reset,
    }))
  );

  const { reset: resetClearTokensStore } = useClearTokensStore(
    useShallow((state) => ({
      reset: state.reset,
    }))
  );

  const { reset: resetConversationStore } = useConversationsStore(
    useShallow((state) => ({
      reset: state.reset,
    }))
  );

  const { reset: resetCreateConversationStore } = useCreateConversationStore(
    useShallow((state) => ({
      reset: state.reset,
    }))
  );

  const { reset: resetSelectedConversationStore } = useSelectedConversationStore(
    useShallow((state) => ({
      reset: state.reset,
    }))
  );

  const { reset: resetRegisterStore } = useRegisterStore(
    useShallow((state) => ({
      reset: state.reset,
    }))
  );

  const resetAll = () => {
    resetGuard();
    onGuardFailure();
    resetDrawerState();
    resetUserStore();
    resetGetLatestConversationStore();
    resetLoginStore();
    resetChatMessagesStore();
    resetClearTokensStore();
    resetConversationStore();
    resetCreateConversationStore();
    resetSelectedConversationStore();
    resetRegisterStore();
  };

  return { resetAll };
};
