import PageMeta from "@/components/common/PageMeta";
import AppointmentTable from "./AppointmentTable";

const TodayAppointment = () => {

  return (
    <div>
      <PageMeta
        title="CMS | Today's Appointment"
        description="CMS | Appointment"
      />

      <AppointmentTable isToday={true} type={undefined} />
    </div>
  );
};

export default TodayAppointment;
