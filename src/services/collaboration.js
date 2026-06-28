import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import api, { setAccessToken } from './api'

const WS_URL = import.meta.env.VITE_API_URL.replace(/^http/, 'ws') + '/api/v1/collaboration'

export const collaborationService = {
    createProvider: (documentName, { onConnect, onDisconnect, onAuthenticationFailed } = {}) => {
        const ydoc = new Y.Doc()

        const provider = new HocuspocusProvider({
            url: WS_URL,
            name: documentName,
            document: ydoc,
            // Функция вместо строки — токен читается свежим при каждой аутентификации,
            // в том числе после переподключения
            token: () => localStorage.getItem('accessToken') ?? '',

            onConnect: () => {
                console.log('[WS] Подключено к документу:', documentName)
                onConnect?.()
            },

            onDisconnect: () => {
                console.log('[WS] Отключено от документа:', documentName)
                onDisconnect?.()
            },

            onAuthenticationFailed: async ({ reason }) => {
                console.error('[WS] Ошибка аутентификации:', reason)
                try {
                    const res = await api.post('/auth/refresh', {})
                    setAccessToken(res.data.data.accessToken)
                    // Токен уже обновлён в localStorage — при reconnect провайдер
                    // возьмёт его свежим через token-функцию выше
                    provider.connect()
                } catch {
                    setAccessToken(null)
                    if (window.location.pathname !== '/login') {
                        window.location.replace('/login')
                    }
                }
                onAuthenticationFailed?.(reason)
            },
        })

        return { provider, ydoc }
    },

    destroyProvider: (provider) => {
        if (provider) {
            provider.destroy()
        }
    },
}