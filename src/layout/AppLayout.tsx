import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
import React, { useEffect, useState } from "react";

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
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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

  const getSidebarWidth = (): string => {
    if (!isDesktop || isMobileOpen) {
      return "0px";
    }

    if (isExpanded) {
      return "270px";
    }

    if (isHovered) {
      return "270px";
    }

    return "90px";
  };

  const sidebarWidth = getSidebarWidth();

  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      <div className="fixed top-0 left-0 h-full z-40">
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className="flex flex-col flex-1 transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          marginLeft: sidebarWidth,
        }}
      >
        <AppHeader />
        <div className="p-4  md:p-6 overflow-x-hidden">{children}</div>
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
