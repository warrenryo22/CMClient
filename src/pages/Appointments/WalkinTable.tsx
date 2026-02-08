import { AppointmentType } from "@/enums/commons";
import OverallAppointmentTable from "./OverallAppointmentTable";
import PageMeta from "@/components/common/PageMeta";
import PageBreadCrumb, { BreadcrumbItem } from "@/components/common/PageBreadCrumb";

const WalkinTable = () => {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "All Walk-ins", href: "/all-walkins" },
  ];
  return (
    <div>
      <PageMeta
        title="CMS | All Walk-ins"
        description="CMS |  All Medical Records"
      />

      <PageBreadCrumb
        title="ALL WALK-INS"
        items={breadcrumbItems}
        showHome={false}
      />
      <OverallAppointmentTable type={AppointmentType.WALK_IN} />
    </div>
  );
};

export default WalkinTable;
