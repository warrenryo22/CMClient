import { SYSTEMACCESS } from "../enums/systemAccess";
import { useAuthStore } from "../zustand/authStore";
import LoadingScreen from "../components/loadings/Loading";
import { Navigate } from "react-router";
import AppLayout from "../layout/AppLayout";



interface AuthGuardProps {
    children: React.ReactNode;
    accessRights?: SYSTEMACCESS | null;
}

export const AuthGuard = ({ children, accessRights = null }: AuthGuardProps) => {
    const {  isAuthenticated, isLoading } = useAuthStore();
    const userAccess = useAuthStore((state) => state.systemAccess) ?? [];
    if (isLoading) {
        return <LoadingScreen />
    }

    if (!isAuthenticated ) {
        return <Navigate to="/login" replace />
    }

    const hasAccess = accessRights === null || userAccess.includes(accessRights);

    if (!hasAccess) {
        return (
            <AppLayout>
                <>
                    Unauthorize
                </>
            </AppLayout>
        )
    }

    return <AppLayout>{children}</AppLayout>
}

