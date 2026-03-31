import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import topicStore from '../store/topic'


export default function TopicsPage() {
  const [page, setPage] = useState('')
  const [limit, setlimit] = useState('')
  const navigate = useNavigate()

  const fetchTopics = topicStore((state) => state.fetchTopics)
  const topics = topicStore((state) => state.topics)
  const isLoading = topicStore((state) => state.isLoading)
  const error = topicStore((state) => state.error)

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  return (
    <div>
      <h1>Темы</h1>
      <ul>
        {topics.map((topic) => (
          <li key={topic._id}>
            {topic.name}
          </li>
        ))}
      </ul>
    </div>
  )
}