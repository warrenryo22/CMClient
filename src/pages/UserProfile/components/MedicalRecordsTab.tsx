import { useNavigate } from "react-router";
import { MedicalRecordSummary } from "../types";
import { getAppointmentReasonLabel, formatDate } from "../utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/card/Card";
import {
  FileText,
  Calendar,
  Clock,
  Stethoscope,
  User,
  ChevronRight,
} from "lucide-react";

interface MedicalRecordsTabProps {
  records: MedicalRecordSummary[];
}

const MedicalRecordsTab = ({ records }: MedicalRecordsTabProps) => {
  const navigate = useNavigate();

  if (!records || records.length === 0) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="py-16 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Medical Records Found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            There are no medical records available for this user yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {records.map((record) => (
        <Card
          key={record.recordId}
          onClick={() => {
            navigate(`/view-medical-records/${record.recordId}`);
          }}
          className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-sky-700 dark:text-sky-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {record.referenceNo}
                    </CardTitle>
                    <CardDescription className="text-xs dark:text-gray-400">
                      Medical Record
                    </CardDescription>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                {formatDate(record.visitDate)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                {record.visitTime}
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Stethoscope className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  {getAppointmentReasonLabel(record.reason)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {record.findings}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-100 dark:border-gray-700">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                {record.doctor}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MedicalRecordsTab;
