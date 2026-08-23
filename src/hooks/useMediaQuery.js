import { useSyncExternalStore } from 'react'

/**
 * Подписка на медиазапрос без setState в эффекте.
 * @param {string} query — например '(max-width: 1280px)'
 */
export function useMediaQuery(query) {
    const subscribe = (onChange) => {
        const list = window.matchMedia(query)
        list.addEventListener('change', onChange)
        return () => list.removeEventListener('change', onChange)
    }

    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false
    )
}
