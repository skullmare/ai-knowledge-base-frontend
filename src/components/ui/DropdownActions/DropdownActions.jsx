import { useState, useRef, useEffect } from 'react'
import MoreVertical from '@assets/icons/more-vertical-16.svg'
import Protected from '@guards/Protected'
import './DropdownActions.css'

/**
 * @typedef {Object} Action
 * @property {string}            label            — текст пункта меню
 * @property {React.ElementType} icon             — SVG-компонент иконки
 * @property {function}          onClick          — () => void
 * @property {string|string[]}   [permission]     — пермишн(ы) для Protected
 * @property {string}            [permissionMode] — 'some' | 'every' (default: 'some')
 * @property {string}            [variant]        — css-модификатор item'а
 * @property {boolean}           [hidden]         — скрыть пункт
 */

/**
 * @param {{ actions: Action[] }} props
 */
export default function DropdownActions({ actions }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    const visibleActions = actions.filter((a) => !a.hidden)

    useEffect(() => {
        if (!open) return
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    if (!visibleActions.length) return null

    const renderItem = (action) => (
        <li key={action.label}>
            <button
                className={`dropdown-actions__item${action.variant ? ` dropdown-actions__item--${action.variant}` : ''}`}
                onClick={(e) => { e.stopPropagation(); setOpen(false); action.onClick() }}
            >
                {action.icon && <action.icon className="dropdown-actions__item-icon" />}
                {action.label}
            </button>
        </li>
    )

    return (
        <div className="dropdown-actions" ref={ref}>
            <button
                className="dropdown-actions__trigger"
                onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
                title="Действия"
            >
                <MoreVertical />
            </button>

            {open && (
                <ul className="dropdown-actions__menu">
                    {visibleActions.map((action) =>
                        action.permission ? (
                            <Protected
                                key={action.label}
                                permission={action.permission}
                                mode={action.permissionMode ?? 'some'}
                            >
                                {renderItem(action)}
                            </Protected>
                        ) : (
                            renderItem(action)
                        )
                    )}
                </ul>
            )}
        </div>
    )
}