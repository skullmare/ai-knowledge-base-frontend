import React from 'react'
import Spinner from '@ui/Spinner/Spinner'
import Delete from '@assets/icons/delete-16.svg'
import DoubleCheck from '@assets/icons/double-check-24.svg'
import Protected from '@guards/Protected'

const TopicToolbar = ({
  isSaving,
  onApprove,
  onDelete,
  isLoadingApprove,
  isLoadingDelete,
  isApproved = false
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
        <Protected permission="topics.approve" mode="some">
          {!isApproved && (
            <button
              className="topic-page__action-btn topic-page__action-btn--approve"
              onClick={onApprove}
              disabled={isLoadingApprove}
            >
              <DoubleCheck width="20px" height="20px" />
              <span>Одобрить</span>
            </button>
          )}
        </Protected>
        <Protected permission="topics.delete" mode="some">
          <button
            className="topic-page__action-btn topic-page__action-btn--delete"
            onClick={onDelete}
            disabled={isLoadingDelete}
          >
            <Delete width="16px" height="16px" />
            <span>Удалить</span>
          </button>
        </Protected>
      </div>
    </div>
  )
}

export default TopicToolbar