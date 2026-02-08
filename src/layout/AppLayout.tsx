import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
import React from "react";


interface LayoutContentProps {
    children: React.ReactNode;
}
// declare global {
//     interface Window {
//         requestPushSubscription?: () => Promise<NotifSubscriptionDTO | null>;
//     }
// }

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    // useEffect(() => {
    //     handleSubscribe();
    // }, []);

    // const handleSubscribe = async () => {
    //     if (typeof window.requestPushSubscription !== "function") {
    //         console.error("Push notification script not loaded.");
    //         return;
    //     }

    //     const subscription = await window.requestPushSubscription();
    //     if (subscription) {
    //         try {
    //             await pushNotificationService.CreateSubscription(subscription);
    //         }
    //         catch (error: any) {
    //             return null;
    //         }
    //     } else {
    //         return null;
    //     }
    // };

    const sidebarWidth = isExpanded || isHovered ? "270px" : "90px";
    return (
        <div className="min-h-screen flex dark:bg-gray-900">
            <div className="fixed top-0 left-0 h-full z-40">
                <AppSidebar />
                <Backdrop />
            </div>
            <div
                 className={`flex-1 transition-all duration-300 ease-in-out body-content`}
        style={{
          marginLeft: isMobileOpen ? "0" : sidebarWidth,
          width: isMobileOpen ? "100%" : `calc(100% - ${sidebarWidth})`,
        }}
            >
                <AppHeader />
                <div className="p-4  md:p-6 overflow-x-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
    );
};

export default AppLayout;
