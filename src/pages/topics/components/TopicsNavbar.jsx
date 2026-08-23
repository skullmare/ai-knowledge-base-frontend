import { useNavbar } from '@layout/Navbar/Navbar';
import EditIcon from '@assets/icons/edit-16.svg';
import DeleteIcon from '@assets/icons/delete-16.svg';

export function TopicsNavbar({
    sections = [],
    activeSection,
    onSelect,
    onEditCategory,
    onDeleteCategory,
    categories
}) {
    const { setIsOpen, isMobile } = useNavbar();
    const handleClose = () => isMobile() && setIsOpen(false);

    const handleSelect = (id) => {
        onSelect?.(id);
        handleClose();
    };

    const handleEdit = (e, categoryId) => {
        e.stopPropagation();
        const category = categories?.find(c => c._id === categoryId);
        if (category && onEditCategory) {
            onEditCategory(category);
        }
    };

    const handleDelete = (e, categoryId) => {
        e.stopPropagation();
        const category = categories?.find(c => c._id === categoryId);
        if (category && onDeleteCategory) {
            onDeleteCategory(category);
        }
    };

    return (
        <>
            <p className="topics-page__navbar__label">РАЗДЕЛЫ</p>
            <ul className="topics-page__navbar__list" role="list">
                {sections.map(({ id, label }) => {
                    const isAllSection = id === 'all';

                    return (
                        <li key={id} className="topics-page__navbar__item-wrapper">
                            <div
                                className={`topics-page__navbar__item${activeSection === id ? ' topics-page__navbar__item--active' : ''}`}
                                onClick={() => handleSelect(id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleSelect(id);
                                    }
                                }}
                            >
                                <span className="topics-page__navbar__item-label">{label}</span>
                                {!isAllSection && (onEditCategory || onDeleteCategory) && (
                                    <div className="topics-page__navbar__item-actions">
                                        {onEditCategory && (
                                            <button
                                                className="topics-page__navbar__item-edit-btn"
                                                onClick={(e) => handleEdit(e, id)}
                                                title="Редактировать раздел"
                                                type="button"
                                            >
                                                <EditIcon />
                                            </button>
                                        )}
                                        {onDeleteCategory && (
                                            <button
                                                className="topics-page__navbar__item-delete-btn"
                                                onClick={(e) => handleDelete(e, id)}
                                                title="Удалить раздел"
                                                type="button"
                                            >
                                                <DeleteIcon />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}