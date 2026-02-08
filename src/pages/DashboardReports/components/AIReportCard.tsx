import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/card/Card";
import Badge from "@/components/badge/Badge";
import { Sparkles, Brain, Bot } from "lucide-react";
import Button from "@/components/buttons/Button";
import GenerateSummaryModal from "../modals/GenerateSummaryModal";
import { useModal } from "@/hooks/useModal";
import { AISummaryReportDTO } from "@/types/dashboardTypes";
import { useEffect, useState, useTransition } from "react";
import { formatDate } from "@/utilities/helpers";
import { dashboardService } from "@/services/dashboardService";
import LoadingOverlay from "@/components/loadings/LoadingOverlay";

const AIReportCard = () => {
  const generateModal = useModal();
  const [report, setReport] = useState<AISummaryReportDTO | null>(null);
  const [isLoading, setIsLoading] = useTransition();

  const fetchLatestSummary = () => {
    setIsLoading(async () => {
      const response = await dashboardService.GetLatestAISummary();
      setReport(response);
    });
  };

  useEffect(() => {
    fetchLatestSummary();
  }, []);

  const handleGenerateClose = (
    isSuccess: boolean,
    data?: AISummaryReportDTO,
  ) => {
    if (isSuccess && data) {
      setReport(data);
    }
    generateModal.closeModal();
  };
  return (
    <Card className="relative border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20">
      {isLoading && (
        <LoadingOverlay size={24} isLoading={isLoading}/>
      )}
      <CardHeader className="relative border-b border-purple-100 dark:border-purple-900">
        <GenerateSummaryModal
          isOpen={generateModal.isOpen}
          onClose={handleGenerateClose}
        />
        <div className="absolute right-0 px-5">
          <Button onClick={generateModal.openModal}><Bot /> Generate Report</Button>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {report?.title}
                </CardTitle>
                <Badge
                  color="primary"
                  variant="solid"
                  startIcon={<Sparkles className="w-3 h-3" />}
                >
                  AI Generated
                </Badge>
              </div>
              {report && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Generated {formatDate(report?.created_at)} • Confidence:{" "}
                  {report?.confidence}%
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      {report ? (
        <CardContent className="py-6">
          <div className="space-y-6">
            {/* Executive Summary */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Executive Summary
              </h4>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {report.summary}
              </p>
            </div>

            {/* Key Insights */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Key Insights
              </h4>
              <div className="space-y-3">
                {report.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent className="py-6">
          <span className="flex items-center justify-center text-gray-500 h-50">
            No summary from AI{" "}
          </span>
        </CardContent>
      )}
    </Card>
  );
};

export default AIReportCard;
