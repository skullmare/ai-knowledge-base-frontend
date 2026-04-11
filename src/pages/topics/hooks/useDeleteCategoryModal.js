import { useState } from 'react';
import useTopicCategoryStore from '@store/topicCategory';

export function useDeleteCategoryModal({ deleteCategory, onSuccess, activeCategory, setActiveCategory }) {
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        category: null,
    });

    const isLoadingDeleteCategory = useTopicCategoryStore((s) => s.isLoadingDeleteCategory);

    const handleDeleteCategory = (category) => {
        setDeleteModal({
            isOpen: true,
            category: category,
        });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.category) return;

        try {
            await deleteCategory(deleteModal.category._id);
            setDeleteModal({ isOpen: false, category: null });

            // Сбрасываем активную категорию, если удалили текущую
            if (activeCategory === deleteModal.category._id) {
                setActiveCategory('all');
            }
            
            // Вызываем колбэк успешного удаления, если передан
            onSuccess?.();
        } catch (error) {
            console.error('Ошибка удаления категории:', error);
            // Ошибка уже обработана в store
        }
    };

    const handleCloseModal = () => {
        setDeleteModal({ isOpen: false, category: null });
    };

    return {
        deleteModal,
        isLoadingDeleteCategory,
        handleDeleteCategory,
        handleConfirmDelete,
        handleCloseModal,
    };
}