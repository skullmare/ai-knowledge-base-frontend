import useProfileStore from '@store/profile';

/**
 * Показывает содержимое, если у пользователя есть требуемые права.
 * mode: 'some' — достаточно одного права, 'every' — нужны все.
 */
const HasPermission = ({ permission, children, fallback = null, mode = 'some' }) => {
    const checkPermission = useProfileStore((state) => state.checkPermission);
    const isInitialized = useProfileStore((state) => state.isInitialized);

    if (!isInitialized) return null;

    const required = Array.isArray(permission) ? permission : [permission];
    const hasAccess = mode === 'every'
        ? required.every((item) => checkPermission(item))
        : required.some((item) => checkPermission(item));

    return hasAccess ? <>{children}</> : fallback;
};

export default HasPermission;
