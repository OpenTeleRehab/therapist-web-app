import { useKeycloak } from '@react-keycloak/web';

export const useRole = () => {
  const { keycloak } = useKeycloak();

  const hasAnyRole = (permissions: string[]): boolean => {
    if (!keycloak?.authenticated) return false;

    const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];

    return permissions.some((permission) => userRoles.includes(permission));
  };

  return { hasAnyRole };
};
