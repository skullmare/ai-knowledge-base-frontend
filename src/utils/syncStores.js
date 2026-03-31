// utils/syncStores.js
import { storeRegistry } from './storeRegistry';

/**
 * Универсальная функция для обновления связанных данных во всех сторах
 * @param {string} entityType - тип сущности ('agentRole', 'topicCategory', и т.д.)
 * @param {string} entityId - ID обновленной сущности
 * @param {object} updatedEntity - обновленные данные сущности
 */
export const syncEntityUpdate = (entityType, entityId, updatedEntity) => {
    const stores = storeRegistry.getStoresByEntityType(entityType);
    
    stores.forEach(store => {
        const { updateEntityInStore } = store.getState();
        if (updateEntityInStore) {
            updateEntityInStore(entityId, updatedEntity);
        }
    });
};

/**
 * Универсальная функция для удаления связанных данных
 * @param {string} entityType - тип сущности
 * @param {string} entityId - ID удаленной сущности
 */
export const syncEntityDelete = (entityType, entityId) => {
    const stores = storeRegistry.getStoresByEntityType(entityType);
    
    stores.forEach(store => {
        const { deleteEntityFromStore } = store.getState();
        if (deleteEntityFromStore) {
            deleteEntityFromStore(entityId);
        }
    });
};