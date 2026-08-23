import React from 'react'
import Spinner from '@ui/Spinner/Spinner'
import Delete from '@assets/icons/delete-16.svg'
import DoubleCheck from '@assets/icons/double-check-24.svg'
import HasPermission from '@guards/HasPermission'

const TopicToolbar = ({
  isSaving,
  onApprove,
  onDelete,
  isLoadingApprove,
  isLoadingDelete
}) => {
  return (
    <div className="topic-page__editor-toolbar">
      <div className="topic-page__saving-indicator">
        {isSaving && (
          <>
            <Spinner size="small" />
            <span>Сохранение...</span>
          </>
        )}
      </div>
      <div className="topic-page__actions">
        <HasPermission permission="topics.approve" mode="some">
          <button
            className="topic-page__action-btn topic-page__action-btn--approve"
            onClick={onApprove}
            disabled={isLoadingApprove}
          >
            <DoubleCheck width="20px" height="20px" />
            <span>Одобрить</span>
          </button>
        </HasPermission>
        <HasPermission permission="topics.delete" mode="some">
          <button
            className="topic-page__action-btn topic-page__action-btn--delete"
            onClick={onDelete}
            disabled={isLoadingDelete}
          >
            <Delete width="16px" height="16px" />
            <span>Удалить</span>
          </button>
        </HasPermission>
      </div>
    </div>
  )
}

export default TopicToolbar