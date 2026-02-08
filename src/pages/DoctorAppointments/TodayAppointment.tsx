import PageMeta from "@/components/common/PageMeta";
import AppointmentTable from "./AppointmentTable";
import { formatDate } from "@/utilities/helpers";

const TodayAppointment = () => {
  const manilaNow = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }),
  );
  return (
    <div>
      <PageMeta
        title="CMS | Today's Appointment"
        description="CMS | Appointment"
      />

      <AppointmentTable date={formatDate(manilaNow)} type={undefined} />
    </div>
  );
};

export default TodayAppointment;
