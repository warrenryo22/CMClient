import { Check, Eye, History,  UserCheck, UserPen,  UserSearch, X } from "lucide-react";
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
import { AppointmentStatus, AppointmentType, ApprovalStatus } from "@/enums/commons";
import Badge from "@/components/badge/Badge";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { useState } from "react";
import IconButton from "@/components/buttons/IconButton";
import ApprovalModal from "@/components/modals/ApprovalModal";
import {
  GetOverallAppointmentDetailsDTO,
  SetDoctorAssignmentDTO,
} from "@/types/appointmentTypes";
import DoctorSelectionModal from "./DoctorSelectionModal";
import RejectReasonModal from "@/components/modals/RejectReasonModal";
import { GetPaginatedDTO } from "@/types/globalTypes";

export interface AppointmentStatusData {
  appointment: GetOverallAppointmentDetailsDTO;
  status: AppointmentStatus;
}

interface OverallAppointmentTableProps{
  type: AppointmentType;
}

const OverallAppointmentTable = ({
  type
}: OverallAppointmentTableProps) => {
  const appointmentModal = useModal();
  const appointDoctorConfirmationModal = useModal();
  const apporvalModal = useModal();
  const doctorSelectionModal = useModal();
  const reschedAppointmentModal = useModal();
  const appointmentDetailsModal = useModal();
  const rejectReasonModal = useModal();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedApprovalStatus, setSelectedApprovalStatus] =
    useState<AppointmentStatusData | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [assignmentDoctor, setAssignmentDoctor] =
    useState<SetDoctorAssignmentDTO | null>(null);
  const [rejectReason, setRejectReason] = useState<string | undefined>(
    undefined
  );

  const paginated = usePaginatedTable({
    fetchFunction: appointmentService.GetOverallAppointments,
    defaultParams: new GetPaginatedDTO({
      AppointmentType: type
    })
  });

  const handleOpenModal = (appointmentId: number) => {
    if (!appointmentId) return;
    setSelectedAppointmentId(appointmentId);
    appointmentDetailsModal.openModal();
  };

  const handleCloseCreateModal = (isSuccess: boolean) => {
    if (isSuccess) {
      paginated.refresh();
    }
    appointmentModal.closeModal();
  };

  const handleApprovalModalOpen = (
    appointment: GetOverallAppointmentDetailsDTO,
    status: AppointmentStatus
  ) => {
    setSelectedApprovalStatus({ appointment, status });
    apporvalModal.openModal();
  };

  const handleApprovalModalClose = async (isSubmit: boolean) => {
    if (isSubmit && selectedApprovalStatus) {
      setSubmitLoading(true);
      const response = await appointmentService.SetAppointmentStatus(
        selectedApprovalStatus.appointment.Id,
        selectedApprovalStatus.status
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

  const handleRescheduleClose = (isSuccess: boolean) => {
    if (isSuccess) {
      paginated.refresh();
    }
    reschedAppointmentModal.closeModal();
  };

  const handleOpenReschedule = (
    appointment: GetOverallAppointmentDetailsDTO
  ) => {
    setSelectedAppointmentId(appointment.Id);
    reschedAppointmentModal.openModal();
  };

  const handleDoctorAssignClose = (isSuccess: boolean) => {
    doctorSelectionModal.closeModal();
    if (isSuccess) {
      paginated.refresh();
    }
  };

  const handleConfirmationClose = (isTrue: boolean) => {
    if (isTrue) {
      if (!selectedApprovalStatus) return;
      doctorSelectionModal.openModal();
      setAssignmentDoctor(
        new SetDoctorAssignmentDTO({
          AppointmentId: selectedApprovalStatus.appointment.Id,
        })
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
      <AppointmentModal
        isOpen={reschedAppointmentModal.isOpen}
        onClose={handleRescheduleClose}
        isReschedule
        appointmentId={selectedAppointmentId}
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
      <AppointmentModal
        isOpen={appointmentModal.isOpen}
        onClose={handleCloseCreateModal}
      />
      <AppointmentDetailsModal
        isOpen={appointmentDetailsModal.isOpen}
        onClose={appointmentDetailsModal.closeModal}
        appointmentId={selectedAppointmentId}
      />

      <RejectReasonModal
        isOpen={rejectReasonModal.isOpen}
        readonly
        reason={rejectReason}
        onClose={rejectReasonModal.closeModal}
      />
      {apporvalModal.isOpen && (
        <ApprovalModal
          buttonLoading={submitLoading}
          isOpen={apporvalModal.isOpen}
          title={`${formatStatus(
            AppointmentStatus[selectedApprovalStatus!.status]
          )} APPOINTMENT`}
          description={`Are you sure you want to ${formatStatus(
            AppointmentStatus[selectedApprovalStatus!.status]
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
            {[
              "Name",
              "Date",
              "Time",
              "Assigned Doctor",
              "Status",
              "Action",
            ].map((title, i) => (
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
              <TableData label="Appointed Doctor">
                {!item.Doctor ? (
                  <span className="text-xs text-red-500">Not yet assigned</span>
                ) : (
                  <>
                    <div className={`flex items-center  gap-2 justify-center ${item.Status === AppointmentStatus.REASSIGN && "text-red-500"}`}>
                      {item.Doctor.FullName}
                    </div>
                  </>
                )}
              </TableData>
              <TableData label="Status">
                <Badge
                  size="sm"
                  color={getBadgeAppointmentStatusColor(item.Status)}
                >
                  {formatStatus(AppointmentStatus[item.Status])}
                </Badge>
                {item.Status === AppointmentStatus.REASSIGN && (
                  <button
                    className="bg-red-500 text-white px-2 rounded-sm text-xs ml-1"
                    onClick={() => {
                      setRejectReason(item.Doctor?.Reason);
                      rejectReasonModal.openModal();
                    }}
                  >
                    View
                  </button>
                )}
              </TableData>
              <TableData>
                <IconButton
                  tooltipTitle="VIEW DETAILS"
                  addedClass="view-icon mr-2"
                  icon={() => <Eye size={15} />}
                  onClick={() => handleOpenModal(item.Id)}
                />
                {item.Status === AppointmentStatus.PENDING ? (
                  <>
                    <IconButton
                      tooltipTitle="APPROVE APPOINTMENT"
                      addedClass="edit-icon bg-green-100 hover:bg-green-600 mr-2"
                      icon={() => <Check size={15} />}
                      onClick={() => {
                        handleApprovalModalOpen(
                          item,
                          AppointmentStatus.APPROVED
                        );
                      }}
                    />
                    <IconButton
                      tooltipTitle="REJECT APPOINTMENT"
                      addedClass="reject-icon mr-2"
                      icon={() => <X size={15} />}
                      onClick={() => {
                        handleApprovalModalOpen(
                          item,
                          AppointmentStatus.CANCELLED
                        );
                      }}
                    />
                  </>
                ) : item.Status === AppointmentStatus.CANCELLED ||
                  item.Doctor?.Status === ApprovalStatus.REASSIGN ? (
                  <IconButton
                    tooltipTitle="RESCHEDULE APPOINTMENT"
                    addedClass="payment-icon mr-2"
                    icon={() => <History size={15} />}
                    onClick={() => handleOpenReschedule(item)}
                  />
                ) : item.Status === AppointmentStatus.COMPLETED ? (
                  <>
                    <div>
                      <span className="text-sm text-gray-600 italic">
                        Completed
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    
                  </>
                )}

                {(item.Status === AppointmentStatus.APPROVED || item.Status === AppointmentStatus.REASSIGN) && (
                  <IconButton
                    tooltipTitle={`${
                      item.Doctor?.Status === ApprovalStatus.REASSIGN
                        ? "APPOINT ANOTHER DOCTOR"
                        : item.Doctor
                        ? "EDIT APPOINTED DOCTOR"
                        : "APPOINT DOCTOR"
                    }`}
                    addedClass="edit-icon mr-2"
                    icon={() => item.Doctor?.Status === ApprovalStatus.REASSIGN ? <UserSearch size={15} /> : item.Doctor ? <UserPen size={15} /> : <UserCheck size={15} />}
                    onClick={() => {
                      setAssignmentDoctor(
                        new SetDoctorAssignmentDTO({
                          AppointmentId: item.Id,
                          DoctorId:
                            item.Doctor?.Status === ApprovalStatus.REASSIGN
                              ? item.Doctor?.DoctorId
                              : undefined,
                        })
                      );
                      doctorSelectionModal.openModal();
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

export default OverallAppointmentTable;
