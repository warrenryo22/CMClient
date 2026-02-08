import { RouteObject } from "react-router";
import { ComponentType, Suspense } from "react";
import { SYSTEMACCESS } from "../enums/systemAccess";
import LoadingScreen from "../components/loadings/Loading";
import { AuthGuard } from "./authGuard";

type RouteConfig = {
    path: string;
    accessRights?: SYSTEMACCESS | null;
    component: ComponentType<any>;
    exact?: boolean;
};

export const buildRoute = ({
    path,
    accessRights,
    component
}: RouteConfig): RouteObject => {
    const Component = component;
    return {
        path,
        element: (
            <Suspense fallback={<LoadingScreen />}>
                <AuthGuard accessRights={accessRights}>
                    <Component />
                </AuthGuard>
            </Suspense>
        )
    };
}


export const buildPublicRoute = (
    path: string,
    component: ComponentType<any>
): RouteObject => {
    const Component = component;

    return {
        path,
        element: (
            <Suspense fallback={<LoadingScreen />}>
                <Component />
            </Suspense>
        ),
    };
};
