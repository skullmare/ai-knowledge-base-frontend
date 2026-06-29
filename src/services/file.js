import api from './api'

const PRESIGNED_THRESHOLD = 10 * 1024 * 1024 // 10 MB

export const fileService = {
  upload: async (file) => {
    if (file.size >= PRESIGNED_THRESHOLD) {
      return fileService.uploadPresigned(file)
    }

    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  uploadPresigned: async (file) => {
    // Шаг 1: получаем presigned URL от сервера
    const { data: step1 } = await api.post('/file/presigned-url', {
      originalName: file.name,
      mimeType: file.type,
    })
    const { uploadUrl, key } = step1.data

    // Шаг 2: загружаем файл напрямую в S3 (без прохождения через сервер)
    const s3Response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })
    if (!s3Response.ok) {
      throw new Error(`S3 upload failed: ${s3Response.status}`)
    }

    // Шаг 3: подтверждаем загрузку — сервер проверяет через HeadObject
    const { data: step3 } = await api.post('/file/presigned-complete', {
      key,
      originalName: file.name,
      mimeType: file.type,
    })
    return step3
  },
}
