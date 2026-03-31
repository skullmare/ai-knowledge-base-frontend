import useProfileStore from '../../store/profile';

const HasPermission = ({
    permission,
    children,
    fallback = null
}) => {
    const checkPermission = useProfileStore((state) => state.checkPermission);
    const isInitialized = useProfileStore((state) => state.isInitialized);

    if (!isInitialized) return null;
    
    const hasAccess = checkPermission(permission);

    return hasAccess ? <>{children}</> : fallback;
};

export default HasPermission;