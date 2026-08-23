import { useEffect, useState } from 'react'
import useGoogleDriveStore from '@store/googleDrive'

const POPUP_FEATURES = 'width=560,height=680,menubar=no,toolbar=no'

/**
 * Подключение Google Drive через всплывающее окно.
 * Страница /settings/google-callback возвращает код через postMessage.
 */
export function useGoogleDriveConnection() {
    const status = useGoogleDriveStore((s) => s.status)
    const fetchStatus = useGoogleDriveStore((s) => s.fetchStatus)
    const getAuthUrl = useGoogleDriveStore((s) => s.getAuthUrl)
    const connect = useGoogleDriveStore((s) => s.connect)
    const disconnect = useGoogleDriveStore((s) => s.disconnect)
    const isLoading = useGoogleDriveStore((s) => s.isLoadingConnect)

    const [isDisconnectOpen, setIsDisconnectOpen] = useState(false)

    useEffect(() => {
        fetchStatus().catch(() => {})
    }, [fetchStatus])

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return
            if (event.data?.type !== 'google-drive-code') return

            connect(event.data.code)
                .then(() => fetchStatus())
                .catch(() => {})
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [connect, fetchStatus])

    const handleConnect = async () => {
        try {
            const url = await getAuthUrl()
            window.open(url, 'google-drive-oauth', POPUP_FEATURES)
        } catch {
            // сообщение об ошибке показывает снекбар
        }
    }

    const handleDisconnect = async () => {
        try {
            await disconnect()
            setIsDisconnectOpen(false)
        } catch {
            // сообщение об ошибке показывает снекбар
        }
    }

    return {
        status,
        isLoading,
        handleConnect,
        handleDisconnect,
        isDisconnectOpen,
        openDisconnect: () => setIsDisconnectOpen(true),
        closeDisconnect: () => setIsDisconnectOpen(false),
    }
}
