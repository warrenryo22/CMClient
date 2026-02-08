import Button from "@/components/buttons/Button";
import Label from "@/components/form/Label";
import Input from "@/components/input/InputField";
import { MainModal } from "@/components/modals/MainModal";
import { medicalRecordService } from "@/services/medicalRecordService";
import { AddVitalSignsDTO } from "@/types/medicalRecordsType";
import { HeartPulse, Ruler, Syringe, Thermometer, Weight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
interface AddVitalSignsModalProps {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
  appointmentId: number | null;
}
const AddVitalSignsModal = ({
  isOpen,
  onClose,
  appointmentId,
}: AddVitalSignsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  const handleClose = () => {
    onClose(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { touchedFields, errors, isSubmitted },
  } = useForm({
    defaultValues: new AddVitalSignsDTO(),
  });

  const onSubmit = async (data: AddVitalSignsDTO) => {
    if (!appointmentId) return;
    setIsLoading(true);
    data.AppointmentId = appointmentId;
    const response = await medicalRecordService.AddVitalSign(data);
    if (response) {
      onClose(true);
      reset();
    }
    setIsLoading(false);
  };

  return (
    <div>
      <MainModal
        title="ADD VITAL SIGNS"
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-xl"
      >
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="temperature"
                    className="text-xs font-medium text-slate-500"
                  >
                    Temperature (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.01"
                    startIcon={<Thermometer size={16} />}
                    placeholder="e.g., 37.5"
                    {...register("Temperature", {
                      required: "Temperature is required",
                    })}
                    error={!!errors.Temperature}
                    hint={
                      touchedFields.Temperature || isSubmitted
                        ? errors.Temperature?.message
                        : ""
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="bloodPressure"
                    className="text-xs font-medium text-slate-500"
                  >
                    Blood Pressure
                  </Label>
                  <Input
                    id="bloodPressure"
                    startIcon={<Syringe size={16} />}
                    placeholder="e.g., 120/80"
                    {...register("BloodPressure", {
                      required: "Blood Pressure is required",
                    })}
                    error={!!errors.BloodPressure}
                    hint={
                      touchedFields.BloodPressure || isSubmitted
                        ? errors.BloodPressure?.message
                        : ""
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="pulseRate"
                    className="text-xs font-medium text-slate-500"
                  >
                    Pulse Rate (bpm)
                  </Label>
                  <Input
                    id="pulseRate"
                    type="number"
                    startIcon={<HeartPulse size={16} />}
                    placeholder="e.g., 72"
                    {...register("PulseRate", {
                      required: "Pulse Rate is required",
                    })}
                    error={!!errors.PulseRate}
                    hint={
                      touchedFields.PulseRate || isSubmitted
                        ? errors.PulseRate?.message
                        : ""
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="pulseRate"
                    className="text-xs font-medium text-slate-500"
                  >
                    Height (cm)
                  </Label>
                  <Input
                    id="pulseRate"
                    type="number"
                    startIcon={<Ruler size={16} />}
                    placeholder="e.g., 165"
                    {...register("Height", {
                      required: "Height Rate is required",
                    })}
                    error={!!errors.Height}
                    hint={
                      touchedFields.Height || isSubmitted
                        ? errors.Height?.message
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="pulseRate"
                  className="text-xs font-medium text-slate-500"
                >
                  Weight (kg)
                </Label>
                <Input
                  id="pulseRate"
                  type="number"
                  placeholder="e.g., 72"
                  startIcon={<Weight size={16} />}
                  {...register("Weight", {
                    required: "Weight Rate is required",
                  })}
                  error={!!errors.Weight}
                  hint={
                    touchedFields.Weight || isSubmitted
                      ? errors.Weight?.message
                      : ""
                  }
                />
              </div>
            </div>
            <div className="flex gap-1.5 justify-end mt-5">
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
                disabled={isLoading}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </div>
          </form>
        </>
      </MainModal>
    </div>
  );
};

export default AddVitalSignsModal;
