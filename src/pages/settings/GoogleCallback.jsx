import { useEffect } from 'react'
import './css/settings.css'

const readAuthResult = () => {
    const params = new URLSearchParams(window.location.search)
    const error = params.get('error')
    const code = params.get('code')

    if (error) return { code: null, message: `Google вернул ошибку: ${error}` }
    if (!code) return { code: null, message: 'Google не передал код авторизации' }

    return {
        code,
        message: window.opener
            ? 'Завершаем подключение…'
            : 'Подключение выполнено. Вернитесь на страницу настроек.',
    }
}

/**
 * Технический экран во всплывающем окне OAuth Google:
 * отдаёт код авторизации родительскому окну и закрывается.
 */
export default function GoogleCallbackPage() {
    const { code, message } = readAuthResult()

    useEffect(() => {
        if (!code) return

        window.opener?.postMessage({ type: 'google-drive-code', code }, window.location.origin)
        if (window.opener) window.close()
    }, [code])

    return (
        <div className="google-callback">
            <p>{message}</p>
        </div>
    )
}
