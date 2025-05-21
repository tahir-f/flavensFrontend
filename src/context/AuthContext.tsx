import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, getUserRole, logout } from '../services/appwrite';

interface AuthContextType {
  user: any;
  userRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          
          // Get user role
          const role = await getUserRole(currentUser.$id);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginUser = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    userRole,
    isAuthenticated,
    isLoading,
    login: loginUser,
    logout: logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};