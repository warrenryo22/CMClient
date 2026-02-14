import { useEffect, useTransition } from "react";
import Button from "@/components/buttons/Button";
import Label from "@/components/form/Label";
import Input from "@/components/input/InputField";
import TextArea from "@/components/input/TextArea";
import ContentLoading from "@/components/loadings/ContentLoading";
import { MainModal } from "@/components/modals/MainModal";
import { CreateHospitalDTO } from "@/types/medicalRecordsType";
import { Controller, useForm } from "react-hook-form";
import { medicalRecordService } from "@/services/medicalRecordService";

interface HospitalModalProps {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
  hospitalId: CreateHospitalDTO | null;
}

const HospitalModal = (props: HospitalModalProps) => {
  const [submitLoading, setSubmitLoading] = useTransition();

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { touchedFields, errors, isSubmitted },
  } = useForm<CreateHospitalDTO>({
    defaultValues: new CreateHospitalDTO(),
  });

  useEffect(() => {
    if (props.hospitalId?.id) {
      reset(props.hospitalId);
    }else{
        new CreateHospitalDTO();
    }
  }, [props.isOpen]);

  const onSubmit = (data: CreateHospitalDTO) => {
    setSubmitLoading(async () => {
      let response = null;
      if (props.hospitalId?.id) {
        response = await medicalRecordService.UpdateHospital(
          props.hospitalId.id,
          data,
        );
      } else {
        response = await medicalRecordService.CreateHospital(data);
      }
      if (response) {
        reset(new CreateHospitalDTO());
        props.onClose(true);
      }
    });
  };

  const handleClose = () => {
    reset(new CreateHospitalDTO());
    props.onClose(false);
  };

  return (
    <MainModal
      title="ADD HOSPITAL"
      isOpen={props.isOpen}
      onClose={handleClose}
      className="max-w-lg"
    >
      <ContentLoading
        isLoading={false}
        size={20}
        className="h-76"
        loadingContent="Loading..."
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="mb-4">
            <Label htmlFor="name">Hospital Name</Label>
            <Input
              id="name"
              placeholder="Enter hospital name"
              {...register("name", {
                required: "Hospital name is required",
              })}
              error={!!errors.name}
              hint={
                touchedFields.name || isSubmitted ? errors.name?.message : ""
              }
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <Label htmlFor="address">Address</Label>
            <Controller
              control={control}
              name="address"
              rules={{ required: "Address is required" }}
              render={({ field, fieldState }) => (
                <>
                  <TextArea
                    {...field}
                    value={field.value ?? ""}
                    rows={3}
                    placeholder="Enter hospital address"
                    className={`min-h-24 resize-none ${
                      fieldState.error ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Contact Number */}
          <div className="mb-4">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              placeholder="Enter contact number"
              {...register("contactNumber", {
                required: "Contact number is required",
              })}
              error={!!errors.contactNumber}
              hint={
                touchedFields.contactNumber || isSubmitted
                  ? errors.contactNumber?.message
                  : ""
              }
            />
          </div>

          {/* Emergency Department */}
          <div className="mb-4">
            <Label htmlFor="emergencyDepartment">Emergency Department</Label>
            <Input
              id="emergencyDepartment"
              placeholder="Enter emergency department details"
              {...register("emergencyDepartment", {
                required: "Emergency department is required",
              })}
              error={!!errors.emergencyDepartment}
              hint={
                touchedFields.emergencyDepartment || isSubmitted
                  ? errors.emergencyDepartment?.message
                  : ""
              }
            />
          </div>

          {/* Ambulance Available */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="ambulanceAvailable"
              {...register("ambulanceAvailable")}
              className="h-4 w-4"
            />
            <Label htmlFor="ambulanceAvailable">Ambulance Available</Label>
          </div>

          {/* Specialization */}
          {/* <div className="mb-4">
            <Label htmlFor="specialization">
              Specializations (comma separated)
            </Label>
            <Input
              id="specialization"
              placeholder="Cardiology, Neurology, Pediatrics"
              {...register("specialization")}
            />
          </div> */}

          {/* Buttons */}
          <div className="flex gap-2 justify-end mt-6">
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={submitLoading}
              isLoading={submitLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </ContentLoading>
    </MainModal>
  );
};

export default HospitalModal;
