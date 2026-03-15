export const handleError = (err) => {
  if (err.response?.data) {
    const { message, errors } = err.response.data

    if (errors?.length > 0) {
      return errors.map(e => e.message).join(', ')
    }

    if (message) {
      return message
    }
  }

  if (err.request) {
    return 'Сервер недоступен, попробуйте позже'
  }

  return 'Что-то пошло не так'
}