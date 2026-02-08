import Button from "@/components/buttons/Button";
import Label from "@/components/form/Label";
import { SearchablePaginatedSelect } from "@/components/form/SeachablePaginatedSelect";
import { MainModal } from "@/components/modals/MainModal";
import { DoctorSpecializations } from "@/enums/commons";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { appointmentService } from "@/services/appointmentService";
import { userManagementService } from "@/services/userManagementService";
import { SetDoctorAssignmentDTO } from "@/types/appointmentTypes";
import { GetDoctorsDTO } from "@/types/userManagementTypes";
import { formatStatus } from "@/utilities/helpers";
import { useState } from "react";

interface DoctorSelectionModalProps {
  isOpen: boolean;
  assignmentDoctor: SetDoctorAssignmentDTO | null;
  onClose: (isSuccess: boolean) => void;
}
const DoctorSelectionModal = ({
  isOpen,
  assignmentDoctor,
  onClose,
}: DoctorSelectionModalProps) => {
  if (!isOpen) return;

  const [selectedDoctor, setSelectedDoctor] = useState<GetDoctorsDTO | null>(
    null,
  );
  const [submitLoading, setSubmitLoading] = useState(false);

  const paginated = usePaginatedTable<GetDoctorsDTO>({
    fetchFunction: userManagementService.GetDoctorsPaginated,
  });

  const handleSubmit = async () => {
    if (!selectedDoctor || !assignmentDoctor) return;
    setSubmitLoading(true);
    const response = await appointmentService.AssignedDoctorToAppointment(
      new SetDoctorAssignmentDTO({
        AppointmentId: assignmentDoctor.AppointmentId,
        DoctorId: selectedDoctor.Id,
      }),
    );

    if (response) {
      onClose(true);
      setSelectedDoctor(null);
    }
    setSubmitLoading(false);
  };

  const handleClose = () => {
    onClose(false);
    setSubmitLoading(false);
    setSelectedDoctor(null);
  };
  return (
    <MainModal
      title="APPOINT DOCTOR"
      isOpen={isOpen}
      onClose={() => handleClose()}
      className="max-w-xl"
    >
      <Label>Select a doctor</Label>
      <SearchablePaginatedSelect
        tableValues={
          assignmentDoctor
            ? paginated.tableValues.filter(
                (p) => p.Id !== assignmentDoctor.DoctorId,
              )
            : paginated.tableValues
        }
        currentPage={paginated.currentPage}
        totalPages={paginated.totalPages}
        isLoading={paginated.isLoading}
        onPageChange={paginated.onPageChange}
        onSearchChange={(value) => {
          paginated.handleSearchValueChange(value);
        }}
        allowClear
        getOptionLabel={(p) =>
          `${p.FullName}  (${formatStatus(
            DoctorSpecializations[p.Specialization],
          )})`
        }
        getOptionValue={(p) => p}
        value={selectedDoctor}
        onChange={setSelectedDoctor}
      />

      {selectedDoctor ? (
        <>
          <div className="border p-4 rounded-lg text-center text-sm text-gray-600 mt-4 border-dashed">
            <div className="flex gap-4">
              <div className="w-15 h-15 rounded-full ">
                <img
                  src={selectedDoctor.ImageUrl || "/photos/commons/no-img.png"}
                  className="w-full h-full"
                  alt=""
                />
              </div>
              <div className="flex flex-col text-start">
                <div className="font-semibold">
                  Name: {selectedDoctor.FullName}
                </div>
                <div className="text-sm text-gray-500">
                  Specialization:{" "}
                  {DoctorSpecializations[selectedDoctor.Specialization]}
                </div>
                <div className="text-sm text-gray-500">
                  License Number: {selectedDoctor.LicenseNumber}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="border p-10 rounded-lg text-center text-sm text-gray-600 mt-4 border-dashed">
            No doctor selected.
          </div>
        </>
      )}
      <div className="flex gap-1.5 justify-end mt-4">
        <Button size="sm" type="button" variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          type="submit"
          onClick={handleSubmit}
          disabled={submitLoading || !selectedDoctor}
          isLoading={submitLoading}
        >
          Assign {selectedDoctor ? `to ${selectedDoctor.FullName}` : "Doctor"}
        </Button>
      </div>
    </MainModal>
  );
};

export default DoctorSelectionModal;
