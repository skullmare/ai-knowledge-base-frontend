import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'

const WS_URL = import.meta.env.VITE_API_URL.replace(/^http/, 'ws') + '/api/v1/collaboration'

export const collaborationService = {
    createProvider: (documentName, { onConnect, onDisconnect, onAuthenticationFailed } = {}) => {
        const ydoc = new Y.Doc()
        const token = localStorage.getItem('accessToken') ?? ''

        const provider = new HocuspocusProvider({
            url: WS_URL,
            name: documentName,
            document: ydoc,
            token,

            onConnect: () => {
                console.log('[WS] Подключено к документу:', documentName)
                onConnect?.()
            },

            onDisconnect: () => {
                console.log('[WS] Отключено от документа:', documentName)
                onDisconnect?.()
            },

            onAuthenticationFailed: ({ reason }) => {
                console.error('[WS] Ошибка аутентификации:', reason)
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