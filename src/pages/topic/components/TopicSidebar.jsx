import React from 'react'
import Input from '@ui/Input/Input'
import Dropdown from '@ui/Dropdown/Dropdown'
import Multiselect from '@ui/Multiselect/Multiselect'
import UserChip from './UserChip'
import { formatDate } from '../utils/dateUtils'

const TopicSidebar = ({ 
  name, 
  selectedCategory, 
  selectedRoles,
  categoryOptions,
  roleOptions,
  onNameChange,
  onCategoryChange,
  onRolesChange,
  currentTopic,
  canUpdate
}) => {
  const fields = (
    <div className="topic-page__fields">
      <Input
        variant="default"
        size="large"
        placeholder="Укажите название темы"
        label="Название"
        required
        value={name}
        onChange={onNameChange}
        disabled={!canUpdate}
      />
      <Dropdown
        options={categoryOptions}
        value={selectedCategory}
        onChange={onCategoryChange}
        size="large"
        label="Раздел"
        required
        disabled={!canUpdate}
      />
      <Multiselect
        label="Роли"
        required
        size="large"
        options={roleOptions}
        value={selectedRoles}
        onChange={onRolesChange}
        placeholder="Выберите роли"
        disabled={!canUpdate}
      />
    </div>
  )

  const footer = currentTopic ? (
    <div className="topic-meta">
      <div className="topic-meta__row">
        <span className="topic-meta__label">Создано:</span>
        <span className="topic-meta__date">{formatDate(currentTopic.createdAt)}</span>
        <UserChip user={currentTopic.createdBy} />
      </div>
      <div className="topic-meta__row">
        <span className="topic-meta__label">Обновлено:</span>
        <span className="topic-meta__date">{formatDate(currentTopic.updatedAt)}</span>
        <UserChip user={currentTopic.updatedBy} />
      </div>
    </div>
  ) : null

  return { fields, footer }
}

export default TopicSidebar