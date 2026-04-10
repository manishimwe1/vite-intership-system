import { useAuth } from "./useAuth";

/**
 * Hook for role-based access control
 * @returns {Object} { role, isUser, isIntern, isAdmin, hasRole }
 */
export function useRole() {
  const { user, loading } = useAuth();

  const role = user?.role || "user";

  const isUser = role === "user";
  const isIntern = role === "intern";
  const isAdmin = role === "admin";

  /**
   * Check if user has specific role or higher
   * @param {string} requiredRole - 'user', 'intern', or 'admin'
   * @returns {boolean}
   */
  const hasRole = (requiredRole) => {
    const roleHierarchy = {
      user: 0,
      intern: 1,
      admin: 2,
    };

    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  return {
    role,
    isUser,
    isIntern,
    isAdmin,
    hasRole,
    loading,
  };
}
