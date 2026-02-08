import Badge from "@/components/badge/Badge";
import IconButton from "@/components/buttons/IconButton";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableData from "@/components/tables/TableData";
import TableHead from "@/components/tables/TableHead";
import { AppointmentStatus, AppointmentType } from "@/enums/commons";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { doctorAppointmentService } from "@/services/doctorAppointmentService";
import { GetPaginatedDTO } from "@/types/globalTypes";
import {
  formatDate,
  formatStatus,
  formatTimeTo12Hour,
  getBadgeAppointmentStatusColor,
} from "@/utilities/helpers";
import { Activity, Eye, Stethoscope } from "lucide-react";
import AppointmentDetailsModal from "../Appointments/AppointmentDetailsModal";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";
import RejectReasonModal from "@/components/modals/RejectReasonModal";
import { ReassignDoctorPayloadDTO } from "@/types/doctorAppointmentTypes";
import { useNavigate } from "react-router";
import AddVitalSignsModal from "./AddVitalSignsModal";
import { useAuthStore } from "@/zustand/authStore";
import { SYSTEMACCESS } from "@/enums/systemAccess";

interface AppointmentTableProps {
  date?: Date;
  type?: AppointmentType;
}

const AppointmentTable = ({ date, type }: AppointmentTableProps) => {
  const appointmentDetailsModal = useModal();
  const { systemAccess } = useAuthStore();
  const rejectModal = useModal();
  const vitalSignsModal = useModal();
  const navigate = useNavigate();

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [reason, setReason] = useState<string | undefined>(undefined);

  const paginated = usePaginatedTable({
    fetchFunction: doctorAppointmentService.GetDoctorAppointmentPaginated,
    defaultParams: new GetPaginatedDTO({
      Date: date,
      AppointmentType: type,
    }),
  });

  const handleOpenDetails = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    appointmentDetailsModal.openModal();
  };

  const handleRejectModalClose = async (isSuccess: boolean) => {
    if (isSuccess) {
      if (!selectedAppointmentId) return;
      const payload = new ReassignDoctorPayloadDTO({
        AppointmentId: selectedAppointmentId,
        Reason: reason,
      });

      const response = await doctorAppointmentService.ReassignDoctor(payload);
      if (response) {
        paginated.refresh();
      }
    }
    rejectModal.closeModal();
  };

  const handleVitalSignClose = (isSuccess: boolean) => {
    if (isSuccess) {
      setSelectedAppointmentId(null);
      paginated.refresh();
    }
    vitalSignsModal.closeModal();
  };

  return (
    <div>
      <AppointmentDetailsModal
        isOpen={appointmentDetailsModal.isOpen}
        onClose={appointmentDetailsModal.closeModal}
        appointmentId={selectedAppointmentId}
      />
      <AddVitalSignsModal
        appointmentId={selectedAppointmentId}
        isOpen={vitalSignsModal.isOpen}
        onClose={handleVitalSignClose}
      />
      <RejectReasonModal
        isOpen={rejectModal.isOpen}
        setReason={setReason}
        reason={reason}
        onClose={handleRejectModalClose}
      />
      <PaginatedTable title="APPOINTMENTS" usePaginated={paginated}>
        <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
          <tr>
            {["Name", "Date", "Time", "Status", "Action"].map((title, i) => (
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
              <TableData label="Name" highlight>
                {item.FullName}
              </TableData>
              <TableData label="Date">
                {formatDate(item.AppointmentDate)}
              </TableData>

              <TableData label="Time">
                {formatTimeTo12Hour(item.AppointmentTime)}
              </TableData>

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
                  onClick={() => {
                    handleOpenDetails(item.Id);
                  }}
                />

                {/* {item.Status !== AppointmentStatus.REASSIGN &&
                  item.Status !== AppointmentStatus.NO_SHOW && (
                    <IconButton
                      tooltipTitle="REQUEST REASSIGN"
                      addedClass="reject-icon mr-2"
                      icon={() => <UserPen size={15} />}
                      onClick={() => {
                        setSelectedAppointmentId(item.Id);
                        rejectModal.openModal();
                      }}
                    />
                  )} */}

                {!item.HasVitalSigns &&
                  item.Status === AppointmentStatus.APPROVED &&
                  systemAccess?.some(
                    (access) => access === SYSTEMACCESS.ADD_VITAL_SIGN,
                  ) && (
                    <IconButton
                      tooltipTitle="ADD VITAL SIGNS"
                      addedClass="payment-icon mr-2"
                      icon={() => <Activity size={15} />}
                      onClick={() => {
                        vitalSignsModal.openModal();
                        setSelectedAppointmentId(item.Id);
                      }}
                    />
                  )}

                {item.Status === AppointmentStatus.APPROVED &&
                  date &&
                  new Date(date).toDateString() ===
                    new Date().toDateString() && (
                    <IconButton
                      tooltipTitle="BEGIN CHECKUP"
                      addedClass="edit-icon mr-2"
                      icon={() => <Stethoscope size={15} />}
                      onClick={() => {
                        navigate(`/checkup/${item.Id}`);
                      }}
                    />
                  )}
              </TableData>
            </tr>
          ))}
        </tbody>
      </PaginatedTable>
    </div>
  );
};

export default AppointmentTable;
