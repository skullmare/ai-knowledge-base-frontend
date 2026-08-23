import api from './api'

// S3 требует, чтобы все части кроме последней были не меньше 5 МБ
const MIN_PART_SIZE = 5 * 1024 * 1024
const MAX_PARTS = 1000
const CONCURRENCY = 3

/**
 * Размер части подбирается так, чтобы их было не больше MAX_PARTS:
 * иначе тело запроса на завершение загрузки разрастается.
 */
const resolvePartSize = (fileSize) => {
  const required = Math.ceil(fileSize / MAX_PARTS)
  return Math.max(MIN_PART_SIZE, required)
}

const putPart = async (url, blob, signal) => {
  const response = await fetch(url, { method: 'PUT', body: blob, signal })

  if (!response.ok) {
    throw new Error(`Ошибка загрузки части файла: ${response.status}`)
  }

  const etag = response.headers.get('ETag') || response.headers.get('etag')
  if (!etag) {
    throw new Error(
      'Хранилище не вернуло ETag части. Разрешите заголовок ETag в CORS-политике бакета.'
    )
  }

  return etag
}

export const fileService = {
  /**
   * Загрузка файла напрямую в объектное хранилище через presigned multipart URL.
   * Тело файла не проходит через бэкенд.
   *
   * @param {File} file
   * @param {Object} [options]
   * @param {'public'|'private'} [options.visibility='private']
   * @param {(percent: number) => void} [options.onProgress]
   * @param {AbortSignal} [options.signal]
   */
  upload: async (file, { visibility = 'private', onProgress, signal } = {}) => {
    const { data: created } = await api.post('/files/multipart/create', {
      originalName: file.name,
      mimeType: file.type,
      visibility,
    })

    const { key, uploadId } = created.data

    try {
      const partSize = resolvePartSize(file.size)
      const partsCount = Math.max(1, Math.ceil(file.size / partSize))
      const partNumbers = Array.from({ length: partsCount }, (_, i) => i + 1)

      const { data: signed } = await api.post('/files/multipart/sign', {
        key,
        uploadId,
        partNumbers,
      })

      const queue = [...signed.data.parts]
      const uploaded = []

      // Пул воркеров: несколько частей летят параллельно, но не весь файл сразу —
      // иначе браузер держит в памяти все срезы
      const worker = async () => {
        while (queue.length) {
          const { partNumber, url: partUrl } = queue.shift()
          const start = (partNumber - 1) * partSize
          const blob = file.slice(start, Math.min(start + partSize, file.size))

          const etag = await putPart(partUrl, blob, signal)
          uploaded.push({ partNumber, etag })

          onProgress?.(Math.round((uploaded.length / partsCount) * 100))
        }
      }

      await Promise.all(
        Array.from({ length: Math.min(CONCURRENCY, partsCount) }, worker)
      )

      const { data: completed } = await api.post('/files/multipart/complete', {
        key,
        uploadId,
        originalName: file.name,
        parts: uploaded,
      })

      return completed
    } catch (error) {
      // Незавершённые части иначе останутся в бакете и будут тарифицироваться
      await api.post('/files/multipart/abort', { key, uploadId }).catch(() => {})
      throw error
    }
  },

  getAll: async (queryParams) => {
    const { data } = await api.get('/files', { params: queryParams })
    return data
  },

  create: async (payload) => {
    const { data } = await api.post('/files', payload)
    return data
  },

  importFromGoogleDrive: async (payload) => {
    const { data } = await api.post('/files/google-drive', payload)
    return data
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`/files/${id}`, payload)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/files/${id}`)
    return data
  },

  vectorize: async (id) => {
    const { data } = await api.post(`/files/${id}/vectorize`)
    return data
  },

  devectorize: async (id) => {
    const { data } = await api.post(`/files/${id}/devectorize`)
    return data
  },

  getLink: async (id, { inline = false } = {}) => {
    const { data } = await api.get(`/files/${id}/link`, { params: { inline: String(inline) } })
    return data
  },
}
