import {
  Calendar,
  Folder,
  Footprints,
  Home,
  Hospital,
  LayoutDashboard,
  NotebookText,
  Package,
  ShoppingBag,
  Siren,
  UserRound,
  Users,
} from "lucide-react";
import { SYSTEMACCESS } from "../enums/systemAccess";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  access?: SYSTEMACCESS;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    access: SYSTEMACCESS;
  }[];
};

export interface MenuGroup {
  menuType: MenuType;
  items: NavItem[];
}

export type MenuType =
  | "main"
  | "supplies"
  | "inventory"
  | "system"
  | "scheduling"
  | "confidentials"
  | "system";

export const MenuLabels: Record<MenuType, string> = {
  main: "Main",
  supplies: "Supplies",
  system: "System",
  inventory: "Inventory",
  scheduling: "Scheduling",
  confidentials: "Confidentials",
};

export const filterMenuByAccess = (
  allMenus: MenuGroup[],
  accessRights: SYSTEMACCESS[],
): MenuGroup[] => {
  const accessSet = new Set(accessRights);
  return allMenus
    .map(({ menuType, items }) => {
      const filteredItems = items
        .map((item) => {
          if (item.subItems) {
            const filteredSubItems = item.subItems.filter((sub) =>
              accessSet.has(sub.access),
            );
            if (filteredSubItems.length > 0) {
              return { ...item, subItems: filteredSubItems };
            }
            return null;
          }

          if (item.access && accessSet.has(item.access)) {
            return item;
          }

          return null;
        })
        .filter(Boolean) as NavItem[];

      if (filteredItems.length === 0) return null;

      return { menuType, items: filteredItems };
    })
    .filter(Boolean) as MenuGroup[];
};

export const menuAuthorize: MenuGroup[] = [
  {
    menuType: "main",
    items: [
      {
        icon: <LayoutDashboard />,
        name: "Dashboard",
        subItems: [
          {
            name: "Analytics",
            path: "/",
            pro: false,
            access: SYSTEMACCESS.DASHBOARD,
          },
          {
            name: "Reports",
            path: "/reports",
            pro: false,
            access: SYSTEMACCESS.DASHBOARD,
          },
        ],
      },
    ],
  },
  {
    menuType: "main",
    items: [
      {
        icon: <Home />,
        name: "Home",
        path: "/student-dashboard",
        access: SYSTEMACCESS.STUDENT_DASHBOARD,
      },
    ],
  },
  {
    menuType: "main",
    items: [
      {
        icon: <Home />,
        name: "Home",
        path: "/doctor-dashboard",
        access: SYSTEMACCESS.DOCTOR_DASHBOARD,
      },
    ],
  },
  {
    menuType: "main",
    items: [
      {
        icon: <Home />,
        name: "Home",
        path: "/clinic-staff-dashboard",
        access: SYSTEMACCESS.STAFF_DASHBOARD,
      },
    ],
  },
  {
    menuType: "main",
    items: [
      {
        icon: <Package />,
        name: "Stock Requests",
        path: "/stock-request-approval",
        access: SYSTEMACCESS.PROCUREMENT_APPROVAL,
      },
    ],
  },
  {
    menuType: "inventory",
    items: [
      {
        icon: <ShoppingBag />,
        name: "Products",
        subItems: [
          {
            name: "Manage",
            path: "/all-products",
            pro: false,
            access: SYSTEMACCESS.ALL_PRODUCTS,
          },
          {
            name: "Manage Stocks",
            path: "/manage-stocks",
            pro: false,
            access: SYSTEMACCESS.ALL_PRODUCTS,
          },
        ],
      },
    ],
  },
  {
    menuType: "scheduling",
    items: [
      {
        icon: <Calendar />,
        name: "Appointments",
        path: "/all-appointments",
        access: SYSTEMACCESS.APPOINTMENTS,
      },
      {
        icon: <Calendar />,
        name: "Appointments",
        path: "/overall-appointments",
        access: SYSTEMACCESS.OVERALL_APPOINTMENTS,
      },
      {
        icon: <Footprints />,
        name: "Walk-ins",
        path: "/all-walkins",
        access: SYSTEMACCESS.ALL_WALKINS,
      },
      {
        icon: <Users />,
        name: "Today's Patient Lists",
        path: "/all-today-appointments",
        access: SYSTEMACCESS.ALL_TODAYS_APPOINTMENT,
      },

      {
        icon: <Calendar />,
        name: "Appointments",
        path: "/doctor-appointments",
        access: SYSTEMACCESS.DOCTOR_APPOINTMENTS,
      },

      {
        icon: <Users />,
        name: "Today's Patient Lists",
        path: "/today-appointments",
        access: SYSTEMACCESS.DOCTOR_APPOINTMENTS,
      },
    ],
  },
  {
    menuType: "confidentials",
    items: [
      {
        icon: <Folder />,
        name: "Medical Records",
        path: "/all-medical-records",
        access: SYSTEMACCESS.MEDICAL_RECORDS,
      },
      {
        icon: <Folder />,
        name: "Medical Records",
        path: "/student-medical-records",
        access: SYSTEMACCESS.STUDENT_MEDICAL_RECORDS,
      },
      {
        icon: <UserRound />,
        name: "Patients",
        path: "/all-patients",
        access: SYSTEMACCESS.ALL_PATIENTS,
      },
      {
        icon: <NotebookText />,
        name: "Request Certificates",
        path: "/all-request-certificates",
        access: SYSTEMACCESS.REQUEST_CERTIFICATES,
      },
    ],
  },
  {
    menuType: "system",
    items: [
      {
        icon: <Hospital />,
        name: "Hospitals",
        path: "/all-hospitals",
        access: SYSTEMACCESS.ALL_HOSPITALS,
      },
      {
        icon: <Siren />,
        name: "Emergency Cases",
        path: "/emergency-cases",
        access: SYSTEMACCESS.EMERGENCY_CASE,
      },
    ],
  },
  // {
  //   menuType: "system",
  //   items: [
  //     {
  //       icon: <UserCircle />,
  //       name: "All Users",
  //       path: "/all-users",
  //       access: SYSTEMACCESS.USERS,
  //     },
  //   ],
  // },
];
