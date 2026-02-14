import { CaseType, Severity } from "@/enums/emergencyCase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/Card";
import Label from "@/components/form/Label";
import TextArea from "@/components/input/TextArea";
import { AlertCircle, Activity, Hospital } from "lucide-react";
import { COMMON_SYMPTOMS} from "../mockData";
import SearchableSelect from "@/components/form/SearchableSelect";
import { useEffect, useState } from "react";
import { HospitalInfoDTO } from "@/types/emergencyCaseV2Types";
import { medicalRecordService } from "@/services/medicalRecordService";
import { formatStatus } from "@/utilities/helpers";

interface CaseDetailsFormProps {
  caseType: CaseType;
  severity: Severity;
  chiefComplaint: string;
  symptoms: string[];
  referredHospitalId: number | undefined;
  onCaseTypeChange: (value: CaseType) => void;
  onSeverityChange: (value: Severity) => void;
  onChiefComplaintChange: (value: string) => void;
  onSymptomsChange: (symptoms: string[]) => void;
  onReferredHospitalChange: (hospitalId: number | null) => void;
}

const CaseDetailsForm: React.FC<CaseDetailsFormProps> = ({
  caseType,
  severity,
  chiefComplaint,
  symptoms,
  referredHospitalId,
  onCaseTypeChange,
  onSeverityChange,
  onChiefComplaintChange,
  onSymptomsChange,
  onReferredHospitalChange,
}) => {
  const [hospitals, setHospitals] = useState<HospitalInfoDTO[]>([]);

  const fetchHospitals = async () => {
    const response = await medicalRecordService.GetAllHospitals();
    setHospitals(response);
  }

  useEffect(() => {
    fetchHospitals();
  }, []);
  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      onSymptomsChange(symptoms.filter((s) => s !== symptom));
    } else {
      onSymptomsChange([...symptoms, symptom]);
    }
  };

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case Severity.CRITICAL:
        return "bg-red-100 text-red-700 border-red-300";
      case Severity.SEVERE:
        return "bg-orange-100 text-orange-700 border-orange-300";
      case Severity.MODERATE:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case Severity.MINOR:
        return "bg-green-100 text-green-700 border-green-300";
    }
  };

  const showHospitalReferral =
    severity === Severity.SEVERE || severity === Severity.CRITICAL;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <AlertCircle size={20} />
            Case Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Case Type</Label>
              <SearchableSelect
                value={caseType}
                onChange={(e) => onCaseTypeChange(e.target.value as CaseType)}
                placeholder="Select Case Type"
                options={Object.entries(CaseType)
                  .filter(([_, value]) => !isNaN(Number(value)))
                  .map(([key, value]) => ({
                    value: Number(value),
                    label: key.replace(/_/g, " "),
                  }))}
              />
            </div>

            <div>
              <Label>Severity Level</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(Severity)
                  .filter((value) => typeof value === "number")
                  .map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => onSeverityChange(sev as Severity)}
                      className={`
                        px-3 py-2 rounded-md border-2 text-sm font-medium transition-all
                        ${
                          severity === sev
                            ? getSeverityColor(sev as Severity)
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }
                      `}
                    >
                      {formatStatus(Severity[sev])}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {showHospitalReferral && (
            <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Hospital className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Hospital Referral Required
                  </h4>
                  <p className="text-sm text-orange-700 mb-3">
                    Due to the severity level, this case requires hospital
                    referral. Please select a hospital below.
                  </p>
                  <div>
                    <Label className="text-orange-900">Select Hospital</Label>
                    <SearchableSelect
                      placeholder="Select Hospitals"
                      className="bg-white"
                      value={referredHospitalId}
                      options={hospitals.map((hospitals) => ({
                        value: hospitals.id,
                        label: hospitals.name
                      }))}
                        onChange={(value) => {
                        onReferredHospitalChange(
                          value ? parseInt(value) : null,
                        );
                      }}
                    />
                   
                    {referredHospitalId && (
                      <div className="mt-3 p-3 bg-white rounded-md border border-orange-200">
                        {hospitals.filter(
                          (h) => h.id === referredHospitalId,
                        ).map((hospital) => (
                          <div key={hospital.id} className="text-sm">
                            <p className="font-semibold text-gray-900">
                              {hospital.name}
                            </p>
                            <p className="text-gray-600 mt-1">
                              {hospital.address}
                            </p>
                            <p className="text-gray-600">
                              Contact: {hospital.contactNumber}
                            </p>
                            <p className="text-gray-600">
                              {hospital.emergencyDepartment}
                            </p>
                            {hospital.ambulanceAvailable && (
                              <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Ambulance Available
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label>Chief Complaint</Label>
            <TextArea
              value={chiefComplaint}
              onChange={onChiefComplaintChange}
              placeholder="Describe the primary complaint or reason for emergency visit..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific and include relevant details about the incident or
              condition
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <Activity size={20} />
            Symptoms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {COMMON_SYMPTOMS.map((symptom) => (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${
                    symptoms.includes(symptom)
                      ? "bg-sky-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {symptom}
              </button>
            ))}
          </div>
          {symptoms.length > 0 && (
            <div className="mt-4 p-3 bg-sky-50 rounded-lg">
              <p className="text-sm text-sky-900 font-medium">
                Selected: {symptoms.join(", ")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseDetailsForm;
