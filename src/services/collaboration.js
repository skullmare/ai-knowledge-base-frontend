import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import api, { setAccessToken } from './api'

const WS_URL = import.meta.env.VITE_API_URL.replace(/^http/, 'ws') + '/api/v1/collaboration'

const buildProvider = (documentName, ydoc, callbacks = {}) => {
    const { onConnect, onDisconnect, onAuthenticationFailed, onProviderRecreated } = callbacks

    const provider = new HocuspocusProvider({
        url: WS_URL,
        name: documentName,
        document: ydoc,
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

                // provider.connect() ненадёжен после auth failure — пересоздаём провайдер.
                // Ydoc тот же, поэтому привязка к редактору сохраняется.
                provider.destroy()
                const newProvider = buildProvider(documentName, ydoc, callbacks)
                onProviderRecreated?.(newProvider)
            } catch {
                setAccessToken(null)
                if (window.location.pathname !== '/login') {
                    window.location.replace('/login')
                }
            }
            onAuthenticationFailed?.(reason)
        },
    })

    return provider
}

export const collaborationService = {
    createProvider: (documentName, callbacks = {}) => {
        const ydoc = new Y.Doc()
        const provider = buildProvider(documentName, ydoc, callbacks)
        return { provider, ydoc }
    },

    destroyProvider: (provider) => {
        if (provider) {
            provider.destroy()
        }
    },
}
