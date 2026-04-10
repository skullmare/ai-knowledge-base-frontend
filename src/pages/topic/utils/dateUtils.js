export const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  const date = d.toLocaleDateString('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
  const time = d.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  return `${date} ${time}`
}