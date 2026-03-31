// utils/storeRegistry.js
class StoreRegistry {
    constructor() {
        this.stores = new Map(); // key: entityType, value: Set of stores
    }

    /**
     * Зарегистрировать стор для определенного типа сущности
     * @param {string} entityType - тип сущности ('agentRole', 'topicCategory')
     * @param {object} store - объект стора (useAgentRoleStore)
     */
    register(entityType, store) {
        if (!this.stores.has(entityType)) {
            this.stores.set(entityType, new Set());
        }
        this.stores.get(entityType).add(store);
    }

    /**
     * Получить все сторы, которые работают с данным типом сущности
     * @param {string} entityType 
     * @returns {Array} массив сторов
     */
    getStoresByEntityType(entityType) {
        const storesSet = this.stores.get(entityType) || new Set();
        return Array.from(storesSet);
    }

    /**
     * Отрегистрировать стор
     * @param {string} entityType 
     * @param {object} store 
     */
    unregister(entityType, store) {
        if (this.stores.has(entityType)) {
            this.stores.get(entityType).delete(store);
        }
    }
}

export const storeRegistry = new StoreRegistry();