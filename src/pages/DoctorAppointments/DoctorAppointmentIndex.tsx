import CustomTabs, { TabItem } from "@/components/tabs/CustomTabs";
import AppointmentTable from "./AppointmentTable";
import PageMeta from "@/components/common/PageMeta";

const DoctorAppointmentIndex = () => {
  const appoitmentTabs: TabItem[] = [
    {
      key: "tabled-view",
      title: "Tabled View",
      content: <AppointmentTable />,
    },
  ];

  return (
    <div>
      <PageMeta
        title="CMS | All Appointment"
        description="CMS | All Appointment"
      />

      <CustomTabs variant="floating" tabs={appoitmentTabs} />
    </div>
  );
};

export default DoctorAppointmentIndex;
