import useProfileStore from '../../store/profile';

const HasPermission = ({
    permission,
    children,
    fallback = null,
    mode = 'some' // 'some' - хотя бы одно, 'every' - все разрешения
}) => {
    const checkPermission = useProfileStore((state) => state.checkPermission);
    const isInitialized = useProfileStore((state) => state.isInitialized);

    if (!isInitialized) return null;
    
    // Проверка прав доступа
    const hasAccess = (() => {
        // Если permission - массив
        if (Array.isArray(permission)) {
            if (mode === 'every') {
                // Проверяем, что есть ВСЕ разрешения из массива
                return permission.every(p => checkPermission(p));
            } else {
                // Проверяем, что есть ХОТЯ БЫ ОДНО разрешение из массива
                return permission.some(p => checkPermission(p));
            }
        }
        
        // Если permission - строка (одиночное разрешение)
        return checkPermission(permission);
    })();

    return hasAccess ? <>{children}</> : fallback;
};

export default HasPermission;