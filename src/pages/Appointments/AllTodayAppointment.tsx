import Badge from "@/components/badge/Badge";
import IconButton from "@/components/buttons/IconButton";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableData from "@/components/tables/TableData";
import TableHead from "@/components/tables/TableHead";
import { AppointmentStatus } from "@/enums/commons";
import { useModal } from "@/hooks/useModal";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { doctorAppointmentService } from "@/services/doctorAppointmentService";
import { GetPaginatedDTO } from "@/types/globalTypes";
import {
  formatDate,
  formatStatus,
  formatTimeTo12Hour,
  getBadgeAppointmentStatusColor,
} from "@/utilities/helpers";
import { Activity, Eye, UserCheck, UserPen, UserRoundX } from "lucide-react";
import { useState } from "react";
import AddVitalSignsModal from "../DoctorAppointments/AddVitalSignsModal";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import {
  GetOverallAppointmentDetailsDTO,
  SetDoctorAssignmentDTO,
} from "@/types/appointmentTypes";
import DoctorSelectionModal from "./DoctorSelectionModal";
import { AppointmentStatusData } from "./OverallAppointmentTable";
import ApprovalModal from "@/components/modals/ApprovalModal";
import { appointmentService } from "@/services/appointmentService";

const AllTodayAppointment = () => {
  const appointmentDetailsModal = useModal();
  const vitalSignsModal = useModal();
  const doctorSelectionModal = useModal();
  const apporvalModal = useModal();
  const appointDoctorConfirmationModal = useModal();

  const [selectedApprovalStatus, setSelectedApprovalStatus] =
    useState<AppointmentStatusData | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [assignmentDoctor, setAssignmentDoctor] =
    useState<SetDoctorAssignmentDTO | null>(null);

  const paginated = usePaginatedTable({
    fetchFunction: doctorAppointmentService.GetDoctorAppointmentPaginated,
    defaultParams: new GetPaginatedDTO({
      Date: new Date(),
    }),
  });

  const handleVitalSignClose = (isSuccess: boolean) => {
    if (isSuccess) {
      setSelectedAppointmentId(null);
      paginated.refresh();
    }
    vitalSignsModal.closeModal();
  };

  const handleDoctorAssignClose = (isSuccess: boolean) => {
    doctorSelectionModal.closeModal();
    if (isSuccess) {
      paginated.refresh();
    }
  };

  const handleOpenDetails = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    appointmentDetailsModal.openModal();
  };

  const handleApprovalModalOpen = (
    appointment: GetOverallAppointmentDetailsDTO,
    status: AppointmentStatus,
  ) => {
    setSelectedApprovalStatus({ appointment, status });
    apporvalModal.openModal();
  };

  const handleApprovalModalClose = async (isSubmit: boolean) => {
    if (isSubmit && selectedApprovalStatus) {
      setSubmitLoading(true);
      const response = await appointmentService.SetAppointmentStatus(
        selectedApprovalStatus.appointment.Id,
        selectedApprovalStatus.status,
      );

      if (response) {
        paginated.refresh();
        if (selectedApprovalStatus.status === AppointmentStatus.APPROVED) {
          appointDoctorConfirmationModal.openModal();
        }
      }
      setSubmitLoading(false);
    }
    apporvalModal.closeModal();
  };

  const handleConfirmationClose = (isTrue: boolean) => {
    if (isTrue) {
      if (!selectedApprovalStatus) return;
      doctorSelectionModal.openModal();
      setAssignmentDoctor(
        new SetDoctorAssignmentDTO({
          AppointmentId: selectedApprovalStatus.appointment.Id,
        }),
      );
    }
    appointDoctorConfirmationModal.closeModal();
  };
  return (
    <div>
      <DoctorSelectionModal
        isOpen={doctorSelectionModal.isOpen}
        assignmentDoctor={assignmentDoctor}
        onClose={handleDoctorAssignClose}
      />
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

      {appointDoctorConfirmationModal.isOpen && (
        <ApprovalModal
          buttonLoading={submitLoading}
          isOpen={appointDoctorConfirmationModal.isOpen}
          title={`APPOINT DOCTOR`}
          description={`Do you want to appoint doctor now?`}
          onClose={handleConfirmationClose}
          buttonSubmitTitle="Yes"
          buttonCancelTitle="Maybe later"
        />
      )}

      {apporvalModal.isOpen && (
        <ApprovalModal
          buttonLoading={submitLoading}
          isOpen={apporvalModal.isOpen}
          title={`${formatStatus(
            AppointmentStatus[selectedApprovalStatus!.status],
          )} APPOINTMENT`}
          description={`Are you sure you want to ${formatStatus(
            AppointmentStatus[selectedApprovalStatus!.status],
          )} 
            this appointment for ${
              selectedApprovalStatus?.appointment.FullName
            }?`}
          onClose={handleApprovalModalClose}
        />
      )}

      <PaginatedTable title="APPOINTMENTS" usePaginated={paginated}>
        <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
          <tr>
            {["Name", "Date", "Time", "Doctor", "Status", "Action"].map(
              (title, i) => (
                <TableHead key={i}>{title}</TableHead>
              ),
            )}
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
              <TableData label="Doctor">
                {item.Doctor ? (
                  <span>{item.Doctor.FullName}</span>
                ) : (
                  <span className="text-red-500">Not yet assigned</span>
                )}
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

                {!item.HasVitalSigns &&
                  item.Status === AppointmentStatus.APPROVED && (
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

                {(item.Status === AppointmentStatus.APPROVED ||
                  item.Status === AppointmentStatus.REASSIGN) && (
                  <IconButton
                    tooltipTitle={`${
                      item.Doctor ? "EDIT APPOINTED DOCTOR" : "APPOINT DOCTOR"
                    }`}
                    addedClass="edit-icon mr-2"
                    icon={() =>
                      item.Doctor ? (
                        <UserPen size={15} />
                      ) : (
                        <UserCheck size={15} />
                      )
                    }
                    onClick={() => {
                      setAssignmentDoctor(
                        new SetDoctorAssignmentDTO({
                          AppointmentId: item.Id,
                          DoctorId: item.Doctor?.DoctorId,
                        }),
                      );
                      doctorSelectionModal.openModal();
                    }}
                  />
                )}
                {item.Doctor && item.Status !== AppointmentStatus.NO_SHOW && (
                  <IconButton
                    tooltipTitle="MARK AS NO SHOW"
                    addedClass="reject-icon mr-2"
                    icon={() => <UserRoundX size={15} />}
                    onClick={() =>
                      handleApprovalModalOpen(item, AppointmentStatus.NO_SHOW)
                    }
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

export default AllTodayAppointment;
