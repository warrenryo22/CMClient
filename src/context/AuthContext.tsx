import { createContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../zustand/authStore";
import { AuthContextType } from "../types/authTypes";
import LoadingScreen from "../components/loadings/Loading";
import { authService } from "../services/authService";

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    userClaims: user,
    isLoading,
    isInitialized,
  } = useAuthStore();

  useEffect(() => {
    const initializedAuth = async () => {
      await authService.initializeAuth();
    };
    initializedAuth();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    const publicPaths = ["/walkins", "/login"];
    const isPublicPath = publicPaths.includes(location.pathname);

    if (!isLoading && !isAuthenticated && !isPublicPath) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate, location.pathname]);

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isInitialized ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};
