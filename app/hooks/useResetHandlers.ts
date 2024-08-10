import { useGuardStore } from '@/store/useGuardStore';
import { useLoginStore } from '@/store/useLoginStore';
import { useDrawerStore } from '@/store/useDrawerStore';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/store/useUserStore';
import { useGetLatestConversationStore } from '@/store/api/useGetLatestConversationStore';

export const useResetHandlers = () => {
  const { reset: resetGuard } = useGuardStore(useShallow((state) => ({ reset: state.reset })));
  const { onGuardFailure } = useLoginStore(
    useShallow((state) => ({ onGuardFailure: state.onGuardFailure }))
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

  const resetAll = () => {
    resetGuard();
    onGuardFailure();
    resetDrawerState();
    resetUserStore();
    resetGetLatestConversationStore();
  };

  return { resetAll };
};
