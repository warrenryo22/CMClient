import Button from "@/components/buttons/Button";
import InlineDatePicker from "@/components/input/InlineDatePicker";
import { MainModal } from "@/components/modals/MainModal";
import { dashboardService } from "@/services/dashboardService";
import { AISummaryReportDTO, DashboardFilterDTO } from "@/types/dashboardTypes";
import { toDateOnlyString } from "@/utilities/helpers";
import { useState, useTransition } from "react";
import AIGenerationSimulation from "./AIGenerationSimulation";

interface GenerateSummaryProps {
  isOpen: boolean;
  onClose: (isSuccess: boolean, data?: AISummaryReportDTO) => void;
}
const GenerateSummaryModal = ({ isOpen, onClose }: GenerateSummaryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | Date[] | null>(null);
  const [submitLoading, setSubmitLoading] = useTransition();

  const handleClose = () => {
    onClose(false, undefined);
  };

  const handleGenerate = () => {
    setSubmitLoading(async () => {
      if (!selectedDate) return;
      const payload = new DashboardFilterDTO();
      if (Array.isArray(selectedDate)) {
        payload.StartDate = toDateOnlyString(selectedDate[0]) as any;
        payload.EndDate = toDateOnlyString(selectedDate[1]) as any;
      } else {
        const dateStr = toDateOnlyString(selectedDate);
        payload.StartDate = dateStr as any;
        payload.EndDate = dateStr as any;
      }
      const response = await dashboardService.GenerateAISummary(payload);
      if (response) {
        onClose(true, response);
      }
    });
  };
  return (
    <div>
      <MainModal isOpen={isOpen} onClose={handleClose} className="max-w-3xl">
        {submitLoading ? (
          <AIGenerationSimulation isGenerating={submitLoading} />
        ) : (
          <>
            <InlineDatePicker
              id="inline-range"
              mode="range"
              value={selectedDate}
              onChange={setSelectedDate}
              showMonths={2}
            />
            <div className="flex gap-1.5 justify-end mt-4">
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              {selectedDate && (
                <Button
                  size="sm"
                  type="button"
                  onClick={handleGenerate}
                  disabled={submitLoading}
                >
                  Generate AI Report
                </Button>
              )}
            </div>
          </>
        )}
      </MainModal>
    </div>
  );
};

export default GenerateSummaryModal;
