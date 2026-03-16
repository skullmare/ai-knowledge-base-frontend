import useProfileStore from '../../store/profileStore';

const HasPermission = ({
    permission,
    children,
    fallback = null
}) => {
    const permissions = useProfileStore((state) => state.permissions);
    const isInitialized = useProfileStore((state) => state.isInitialized);

    if (!isInitialized) return null;

    if (typeof permission === 'string') {
        return permissions.includes(permission) ? <>{children}</> : fallback;
    }

    if (Array.isArray(permission)) {
        const hasAccess = permission.every((p) => permissions.includes(p));
        return hasAccess ? <>{children}</> : fallback;
    }

    return fallback;
};

export default HasPermission;