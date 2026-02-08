import { useEffect, useState, useTransition } from "react";
import { MainModal } from "@/components/modals/MainModal";
import Button from "@/components/buttons/Button";
import { Sparkles, RefreshCw, CheckCircle } from "lucide-react";
import { AIMockDataSuggestionDTO } from "../types";
import { medicalRecordService } from "@/services/medicalRecordService";
import AIGenerationSimulation from "@/pages/DashboardReports/modals/AIGenerationSimulation";

interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  medId?: number;
  onApply: (suggestion: AIMockDataSuggestionDTO) => void;
}

const AIAssistModal = ({
  isOpen,
  onClose,
  onApply,
  medId,
}: AIAssistModalProps) => {
  const [suggestion, setSuggestion] = useState<AIMockDataSuggestionDTO>(
    new AIMockDataSuggestionDTO(),
  );
  const [isGenerating, setIsGenerating] = useTransition();

  const aiAssist = () => {
    setIsGenerating(async () => {
      if (!medId) return;
      const response = await medicalRecordService.AIAssistedCertificate(medId);
      setSuggestion(response);
    });
  };

  useEffect(() => {
    if(!isOpen) return;
    aiAssist();
  }, [isOpen]);

  const handleGenerate = () => {
    aiAssist();
  };

  const handleApply = () => {
    onApply(suggestion);
    onClose();
  };

  const InfoField = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | boolean;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
          {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
        </p>
      </div>
    </div>
  );

  return (
    <MainModal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Medical Assistant
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Auto-generated medical certificate content
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleGenerate}
            isLoading={isGenerating}
            startIcon={<RefreshCw className="w-4 h-4" />}
          >
            Generate New
          </Button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-900 rounded-lg p-4">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            <strong>Note:</strong> This is AI-generated mock data for
            demonstration purposes. Please review and modify as needed before
            applying to the certificate.
          </p>
        </div>

        {isGenerating ? (
          <AIGenerationSimulation isGenerating={isGenerating} />
        ) : (
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            <InfoField label="Diagnosis" value={suggestion.diagnosis} />
            <InfoField
              label="Chief Complaint"
              value={suggestion.chiefComplaint}
            />
            <InfoField
              label="Physical Examination"
              value={suggestion.physicalExamination}
            />
            <InfoField
              label="Recommendations"
              value={suggestion.recommendations}
            />

            <div className="grid grid-cols-2 gap-4">
              <InfoField
                label="Number of Rest Days"
                value={suggestion.numberOfDays}
              />
              <InfoField label="Fit to Work" value={suggestion.fitToWork} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InfoField
                label="Needs Follow-up"
                value={suggestion.needsFollowUp}
              />
              <InfoField
                label="Work Restrictions"
                value={suggestion.restrictions || "None"}
              />
            </div>

            <InfoField label="Additional Remarks" value={suggestion.remarks} />
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={isGenerating}
            startIcon={<CheckCircle className="w-4 h-4" />}
          >
            Apply to Form
          </Button>
        </div>
      </div>
    </MainModal>
  );
};

export default AIAssistModal;
