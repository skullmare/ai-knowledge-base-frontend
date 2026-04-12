// components/layout/Table/Table.jsx

import { useState, useRef, useEffect } from 'react'
import ChevronLeft from '@assets/icons/chevron-left-16.svg'
import ChevronRight from '@assets/icons/chevron-right-16.svg'
import DropdownIcon from '@assets/icons/dropdown-16.svg'
import DropdownFlippedIcon from '@assets/icons/dropdown-flipped-16.svg'
import './Table.css'

const LIMIT_OPTIONS = [5, 10, 25, 50, 100]

function Pagination({ page, limit, total, onPageChange, onLimitChange }) {
    const [isLimitOpen, setIsLimitOpen] = useState(false)
    const limitRef = useRef(null)

    const totalPages = Math.ceil(total / limit)

    useEffect(() => {
        const handler = (e) => {
            if (limitRef.current && !limitRef.current.contains(e.target)) {
                setIsLimitOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const getPages = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
        if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
        if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, '...', page - 1, page, page + 1, '...', totalPages]
    }

    return (
        <div className="table-pagination">
            <div className="table-pagination__pages">
                <button
                    className="table-pagination__arrow"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                >
                    <ChevronLeft />
                </button>

                {getPages().map((p, i) =>
                    p === '...'
                        ? <span key={`ellipsis-${i}`} className="table-pagination__ellipsis">...</span>
                        : <button
                            key={p}
                            className={`table-pagination__page ${p === page ? 'table-pagination__page--active' : ''}`}
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </button>
                )}

                <button
                    className="table-pagination__arrow"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    <ChevronRight />
                </button>
            </div>

            <div className="table-pagination__limit" ref={limitRef}>
                <span className="table-pagination__limit-label">Количество строк</span>
                <button
                    className="table-pagination__limit-btn"
                    onClick={() => setIsLimitOpen((v) => !v)}
                >
                    {limit}
                    {isLimitOpen ? <DropdownFlippedIcon width="10px" height="10px"/> : <DropdownIcon width="10px" height="10px"/>}
                </button>

                {isLimitOpen && (
                    <ul className="table-pagination__limit-dropdown">
                        {LIMIT_OPTIONS.map((opt) => (
                            <li
                                key={opt}
                                className={`table-pagination__limit-option ${opt === limit ? 'table-pagination__limit-option--active' : ''}`}
                                onClick={() => { onLimitChange(opt); setIsLimitOpen(false) }}
                            >
                                {opt}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

function useRowHeights(tableRef, data) {
    const [heights, setHeights] = useState({ header: 0, rows: [] })

    useEffect(() => {
        const table = tableRef.current
        if (!table) return

        const sync = () => {
            const headerEl = table.querySelector('thead tr')
            const rowEls = Array.from(table.querySelectorAll('tbody tr'))
            setHeights({
                header: headerEl?.getBoundingClientRect().height ?? 0,
                rows: rowEls.map((r) => r.getBoundingClientRect().height),
            })
        }

        sync()

        const observer = new ResizeObserver(sync)
        observer.observe(table)
        return () => observer.disconnect()
    }, [data])  // пересинхронизируемся при смене данных

    return heights
}

export default function Table({
    columns = [],
    data = [],
    page,
    limit,
    total,
    onPageChange,
    onLimitChange,
}) {
    const tableRef = useRef(null)
    const mainColumns = columns.filter((col) => !col.actions)
    const actionsColumn = columns.find((col) => col.actions)

    const heights = useRowHeights(tableRef, data)

    return (
        <div className="table-wrapper">
            <div className="table-body">

                <div className="table-scroll">
                    <table className="table" ref={tableRef}>
                        <thead className="table__head">
                            <tr>
                                {mainColumns.map((col) => (
                                    <th key={col.key} className="table__th">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {data.map((row, rowIndex) => (
                                <tr key={row._id ?? rowIndex} className="table__row">
                                    {mainColumns.map((col) => (
                                        <td key={col.key} className="table__td">
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {actionsColumn && (
                    <div className="table-actions-column">
                        <div
                            className="table-actions-column__header"
                            style={{ height: heights.header }}
                        />
                        {data.map((row, rowIndex) => (
                            <div
                                key={row._id ?? rowIndex}
                                className="table-actions-column__cell"
                                style={{ height: heights.rows[rowIndex] }}
                            >
                                {actionsColumn.render(row[actionsColumn.key], row)}
                            </div>
                        ))}
                    </div>
                )}

            </div>

            <Pagination
                page={page}
                limit={limit}
                total={total}
                onPageChange={onPageChange}
                onLimitChange={onLimitChange}
            />
        </div>
    )
}