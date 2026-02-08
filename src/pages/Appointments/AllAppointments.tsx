import { Button } from "@/components/buttons/ReusableButton";
import PageBreadCrumb, {
  BreadcrumbItem,
} from "@/components/common/PageBreadCrumb";
import { Eye, Plus } from "lucide-react";
import AppointmentModal from "./AppointmentModal";
import { useModal } from "@/hooks/useModal";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableHead from "@/components/tables/TableHead";
import TableData from "@/components/tables/TableData";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { appointmentService } from "@/services/appointmentService";
import {
  formatDate,
  formatStatus,
  formatTimeTo12Hour,
  getBadgeAppointmentStatusColor,
} from "@/utilities/helpers";
import { AppointmentStatus } from "@/enums/commons";
import Badge from "@/components/badge/Badge";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { useState } from "react";
import IconButton from "@/components/buttons/IconButton";

const AllAppointments = () => {
  const appointmentModal = useModal();
  const appointmentDetailsModal = useModal();
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Appointments", href: "/all-" },
  ];

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);

  const paginated = usePaginatedTable({
    fetchFunction: appointmentService.GetUserAppointments,
  });

  const handleOpenModal = (appointment: any) => {
    setSelectedAppointmentId(appointment.Id);
    appointmentDetailsModal.openModal();
  };

  const handleCloseCreateModal = (isSuccess: boolean) => {
    if (isSuccess) {
      paginated.refresh();
    }
    appointmentModal.closeModal();
  }

  return (
    <div>
      <AppointmentModal
        isOpen={appointmentModal.isOpen}
        onClose={handleCloseCreateModal}
      />
      <AppointmentDetailsModal
        isOpen={appointmentDetailsModal.isOpen}
        onClose={appointmentDetailsModal.closeModal}
        appointmentId={selectedAppointmentId}
      />
      <PageBreadCrumb
        title="APPOINTMENTS"
        items={breadcrumbItems}
        showHome={false}
        buttonChilren={
          <Button
            variant="primary"
            onClick={() => {
              appointmentModal.openModal();
            }}
            leftIcon={<Plus size={15} />}
          >
            Create Appointment
          </Button>
        }
      />

      <PaginatedTable title="APPOINTMENTS" usePaginated={paginated}>
        <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
          <tr>
            {["Date", "Time", "Status", "Action"].map((title, i) => (
              <TableHead key={i}>{title}</TableHead>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.tableValues.map((item) => (
            <tr
              key={item.Id}
              className="hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-colors duration-50 text-[12.5px] text-center border-2 border-gray-200 dark:border-gray-800"
            >
              <TableData label="Date" highlight>
                {formatDate(item.AppointmentDate)}
              </TableData>
              <TableData label="Time">{formatTimeTo12Hour(item.AppointmentTime)}</TableData>
              <TableData label="Status">
                <Badge
                  size="sm"
                  color={getBadgeAppointmentStatusColor(item.Status)}
                >
                  {formatStatus(AppointmentStatus[item.Status])}
                </Badge>
              </TableData>
              <TableData>
                <IconButton
                  tooltipTitle="VIEW DETAILS"
                  addedClass="view-icon mr-2"
                  icon={() => <Eye size={15} />}
                  onClick={() => handleOpenModal(item)}
                />
              </TableData>
            </tr>
          ))}
        </tbody>
      </PaginatedTable>
    </div>
  );
};

export default AllAppointments;
