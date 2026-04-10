import { useEffect, useState, useMemo } from 'react'
import useTopicStore from '@store/topic'
import useAgentRoleStore from '@store/agentRole'
import useTopicCategoryStore from '@store/topicCategory'

export const useTopicData = (id) => {
  const { currentTopic, isLoadingUpdateTopic, fetchOneTopic, updateTopic } = useTopicStore()
  const roles = useAgentRoleStore((state) => state.roles)
  const fetchRoles = useAgentRoleStore((state) => state.fetchRoles)
  const categories = useTopicCategoryStore((state) => state.categories)
  const fetchCategories = useTopicCategoryStore((state) => state.fetchCategories)
  
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsPageLoading(true)
      await Promise.all([
        fetchOneTopic(id),
        fetchRoles(),
        fetchCategories(),
      ])
      setIsPageLoading(false)
    }
    
    loadData()
  }, [id, fetchOneTopic, fetchRoles, fetchCategories])

  const roleOptions = useMemo(
    () => roles.map((r) => ({ value: r._id, label: r.name })),
    [roles]
  )
  
  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c._id, label: c.name })),
    [categories]
  )

  const isSaving = isLoadingUpdateTopic

  return {
    currentTopic,
    updateTopic,
    roles,
    categories,
    roleOptions,
    categoryOptions,
    isPageLoading,
    isSaving,
  }
}