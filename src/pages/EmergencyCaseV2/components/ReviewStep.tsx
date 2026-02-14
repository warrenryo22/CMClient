import { EmergencyCaseFormV2DTO } from "@/types/emergencyCaseV2Types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/Card";
import { User, AlertCircle, Activity, Pill, FileText } from "lucide-react";
import { Gender, UserRoles } from "@/enums/commons";
import { formatStatus } from "@/utilities/helpers";
import { CaseType, Severity } from "@/enums/emergencyCase";

interface ReviewStepProps {
  formData: EmergencyCaseFormV2DTO;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  const {
    patient,
    caseType,
    severity,
    chiefComplaint,
    symptoms,
    vitalSigns,
    assessment,
    diagnosis,
    medications,
    assignedStaff,
  } = formData;

  if (!patient) return null;

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <User size={20} />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem
              label="Name"
              value={`${patient.FirstName} ${patient.MiddleName || ""} ${patient.LastName}`.trim()}
            />
            <InfoItem
              label="Type"
              value={formatStatus(UserRoles[patient.Role ?? UserRoles.VISITOR])}
            />
            <InfoItem
              label="Gender"
              value={formatStatus(Gender[patient.Gender ?? 0])}
            />
            {patient.StudentDetails?.StudentNo && (
              <InfoItem
                label="Student Number"
                value={patient.StudentDetails.StudentNo}
              />
            )}
            {patient.EmployeeDetails?.EmployeeNo && (
              <InfoItem
                label="Employee ID"
                value={patient.EmployeeDetails.EmployeeNo}
              />
            )}
            {patient.Phone && (
              <InfoItem label="Contact" value={patient.Phone} />
            )}
            {patient.EmergencyContactPhone && (
              <InfoItem
                label="Emergency Contact"
                value={`${patient.EmergencyContactName} (${patient.EmergencyContactPhone})`}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Case Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <AlertCircle size={20} />
            Case Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem
              label="Case Type"
              value={formatStatus(CaseType[caseType])}
            />
            <InfoItem label="Severity" value={formatStatus(Severity[severity])} badge />
          </div>
          <InfoItem label="Chief Complaint" value={chiefComplaint} />
          <div>
            <div className="text-sm font-medium text-gray-500 mb-2">
              Symptoms
            </div>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-sm"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <Activity size={20} />
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {vitalSigns.bloodPressure && (
              <InfoItem
                label="Blood Pressure"
                value={`${vitalSigns.bloodPressure} mmHg`}
              />
            )}
            {vitalSigns.heartRate && (
              <InfoItem
                label="Heart Rate"
                value={`${vitalSigns.heartRate} bpm`}
              />
            )}
            {vitalSigns.temperature && (
              <InfoItem
                label="Temperature"
                value={`${vitalSigns.temperature} °C`}
              />
            )}
            {vitalSigns.oxygenSaturation && (
              <InfoItem
                label="O₂ Saturation"
                value={`${vitalSigns.oxygenSaturation}%`}
              />
            )}
            {vitalSigns.respiratoryRate && (
              <InfoItem
                label="Respiratory Rate"
                value={`${vitalSigns.respiratoryRate} /min`}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medical Assessment */}
      {(assessment || diagnosis) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700">
              <FileText size={20} />
              Medical Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assessment && (
              <InfoItem label="Clinical Assessment" value={assessment} />
            )}
            {diagnosis && <InfoItem label="Diagnosis" value={diagnosis} />}
          </CardContent>
        </Card>
      )}

      {/* Treatment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <Pill size={20} />
            Treatment Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medications.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">
                Medications
              </div>
              <div className="space-y-2">
                {medications.map((med) => (
                  <div key={med.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">
                      {med.productName}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Quantity: {med.quantity}
                      {med.notes && ` • ${med.notes}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {assignedStaff.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">
                Assigned Staff
              </div>

              <div className="flex flex-wrap gap-2">
                {assignedStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center gap-2 px-3 py-2 bg-sky-50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-sm font-semibold">
                      {staff.name.charAt(0)}
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {staff.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatStatus(UserRoles[staff.role])}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  badge?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, badge }) => {
  return (
    <div>
      <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
      {badge ? (
        <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
          {value}
        </span>
      ) : (
        <div className="text-gray-900">{value}</div>
      )}
    </div>
  );
};

export default ReviewStep;
