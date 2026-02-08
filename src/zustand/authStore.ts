import { create } from "zustand";
import { UserClaims } from "../types/authTypes";
import { SYSTEMACCESS } from "../enums/systemAccess";


interface AuthState {
    // State
    accessToken: string | null;
    userClaims: UserClaims | null;
    isAuthenticated: boolean;
    userAvatar: string | null;
    userFullName: string | null;
    systemAccess: SYSTEMACCESS[] | null;
    isLoading: boolean;
    isInitialized: boolean;

    // Actions
    setAccessToken: (token: string | null) => void;
    setUserClaims: (claims: UserClaims | null) => void;
    setAuthenticated: (authenticated: boolean) => void;
    setLoading: (loading: boolean) => void;
    setUserAvatar: (avatar: string | null) => void;
    setUserFullName: (avatar: string | null) => void;
    setSystemAccess: (access: SYSTEMACCESS[] | null) => void;
    setInitialized: (value : boolean) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    userClaims: null,
    isAuthenticated: false,
    isLoading: false,
    userAvatar: null,
    userFullName: null,
    systemAccess: null,
    isInitialized: false,

    setAccessToken: (token: string | null) => set({ accessToken: token }),
    setUserClaims: (claims: UserClaims | null) => set({ userClaims: claims }),
    setAuthenticated: (authenticated: boolean) => set({ isAuthenticated: authenticated }),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setUserAvatar: (avatar: string | null) => set({ userAvatar: avatar }),
    setUserFullName: (name: string | null) => set({ userFullName: name }),
    setSystemAccess: (access: SYSTEMACCESS[] | null) => set({ systemAccess: access }),
    setInitialized: (value : boolean) => set({isInitialized : value}),
    clearAuth: () =>
        set({
            accessToken: null,
            userClaims: null,
            isAuthenticated: false,
        }),
}));
