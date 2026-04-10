import React from 'react'

const UserChip = ({ user }) => {
  if (!user) return <span className="topic-meta__user">—</span>
  
  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(' ') || '—'
  
  return (
    <span className="topic-meta__user">
      {user.photoUrl && (
        <img
          className="topic-meta__avatar"
          src={user.photoUrl}
          alt={fullName}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          loading="lazy"
        />
      )}
      {fullName}
    </span>
  )
}

export default UserChip