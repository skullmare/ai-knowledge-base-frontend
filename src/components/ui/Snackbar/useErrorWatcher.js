import { useEffect, useRef } from 'react'
import useAgentRoleStore from '@store/agentRole'
import useAgentUserStore from '@store/agentUser'
import useAuthStore from '@store/auth'
import useLogStore from '@store/log'
import usePlatformRoleStore from '@store/platformRole'
import usePlatformUserStore from '@store/platformUser'
import useProfileStore from '@store/profile'
import useTopicStore from '@store/topic'
import useTopicCategoryStore from '@store/topicCategory'

// Registry: storeKey -> { useStore, clearError }
const STORE_REGISTRY = [
  {
    key: 'agentRole',
    label: 'Роли агентов',
    useStore: useAgentRoleStore,
    clearError: () => useAgentRoleStore.setState({ error: null }),
  },
  {
    key: 'agentUser',
    label: 'Пользователи агентов',
    useStore: useAgentUserStore,
    clearError: () => useAgentUserStore.setState({ error: null }),
  },
  {
    key: 'auth',
    label: 'Авторизация',
    useStore: useAuthStore,
    clearError: () => useAuthStore.setState({ error: null }),
  },
  {
    key: 'log',
    label: 'Логи',
    useStore: useLogStore,
    clearError: () => useLogStore.setState({ error: null }),
  },
  {
    key: 'platformRole',
    label: 'Роли платформы',
    useStore: usePlatformRoleStore,
    clearError: () => usePlatformRoleStore.setState({ error: null }),
  },
  {
    key: 'platformUser',
    label: 'Пользователи платформы',
    useStore: usePlatformUserStore,
    clearError: () => usePlatformUserStore.setState({ error: null }),
  },
  {
    key: 'profile',
    label: 'Профиль',
    useStore: useProfileStore,
    clearError: () => useProfileStore.setState({ error: null }),
  },
  {
    key: 'topic',
    label: 'Топики',
    useStore: useTopicStore,
    clearError: () => useTopicStore.setState({ error: null }),
  },
  {
    key: 'topicCategory',
    label: 'Категории топиков',
    useStore: useTopicCategoryStore,
    clearError: () => useTopicCategoryStore.setState({ error: null }),
  },
]

export { STORE_REGISTRY }

// Individual watcher hook for a single store entry
// Called inside ErrorSnackbarStack where hooks are valid
export function useStoreError(storeEntry, onError) {
  const error = storeEntry.useStore((state) => state.error)
  const prevErrorRef = useRef(null)

  useEffect(() => {
    // Fire only when error transitions from null/undefined -> some value
    if (error && error !== prevErrorRef.current) {
      onError({
        storeKey: storeEntry.key,
        label: storeEntry.label,
        message: error,
        clearError: storeEntry.clearError,
      })
    }
    prevErrorRef.current = error
  }, [error])
}