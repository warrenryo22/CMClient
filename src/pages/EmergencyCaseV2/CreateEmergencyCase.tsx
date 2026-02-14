import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/buttons/Button";
import { Severity, EmergencyCaseStatus } from "@/enums/emergencyCase";
import {
  EmergencyCaseFormV2DTO,
  EmergencyCaseV2DTO,
} from "@/types/emergencyCaseV2Types";
import StepperProgress from "./components/StepperProgress";
import PatientSelector from "./components/PatientSelector";
import CaseDetailsForm from "./components/CaseDetailsForm";
import MedicalInfoForm from "./components/MedicalInfoForm";
import TreatmentForm from "./components/TreatmentForm";
import ReviewStep from "./components/ReviewStep";
import { GetUserDetailsDTO } from "@/types/userManagementTypes";
import { medicalRecordService } from "@/services/medicalRecordService";
import { useNavigate } from "react-router";

const CreateEmergencyCase = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<EmergencyCaseFormV2DTO>(
    new EmergencyCaseFormV2DTO(),
  );

  const steps = [
    { number: 1, title: "Patient", description: "Identify patient" },
    { number: 2, title: "Case Details", description: "Incident information" },
    { number: 3, title: "Medical Info", description: "Vitals & assessment" },
    { number: 4, title: "Treatment", description: "Medications & staff" },
    { number: 5, title: "Review", description: "Confirm details" },
  ];

  const handlePatientSelected = (patient: GetUserDetailsDTO) => {
    setFormData({
      ...formData,
      patientId: patient.UserDetailsId ?? null,
      patient: patient,
    });
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.patient !== null;
      case 1:
        // Check if hospital is required and selected
        const requiresHospital =
          formData.severity === Severity.SEVERE ||
          formData.severity === Severity.CRITICAL;
        return (
          formData.chiefComplaint.trim().length > 0 &&
          (!requiresHospital || formData.referredHospitalId !== null)
        );
      case 2:
        return true; // Vital signs are optional
      case 3:
        return true; // Medications are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!formData.patient) return;

    const newCase: EmergencyCaseV2DTO = {
      id: `EC-${Date.now().toString().slice(-6)}`,
      caseNumber: `EMG-2024-`,
      patient: formData.patient,
      caseType: formData.caseType,
      severity: formData.severity,
      status: EmergencyCaseStatus.ACTIVE,
      chiefComplaint: formData.chiefComplaint,
      symptoms: formData.symptoms,
      vitalSigns: formData.vitalSigns,
      assessment: formData.assessment,
      diagnosis: formData.diagnosis,
      medications: formData.medications,
      treatments: [],
      assignedStaff: formData.assignedStaff,
      transferredTo: formData.referredHospitalId,
      dischargeInstructions: "",
      dischargedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Current User",
      notes: formData.notes,
    };

    const response = await medicalRecordService.CreateEmergencyCase(newCase);
    if (response) {
      navigate("/emergency-cases");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PatientSelector onPatientSelected={handlePatientSelected} />;
      case 1:
        return (
          <CaseDetailsForm
            caseType={formData.caseType}
            severity={formData.severity}
            chiefComplaint={formData.chiefComplaint}
            symptoms={formData.symptoms}
            referredHospitalId={formData.referredHospitalId}
            onCaseTypeChange={(value) =>
              setFormData({ ...formData, caseType: value })
            }
            onSeverityChange={(value) => {
              // Clear hospital selection if severity is no longer severe/critical
              if (value !== Severity.SEVERE && value !== Severity.CRITICAL) {
                setFormData({
                  ...formData,
                  severity: value,
                  referredHospitalId: undefined,
                });
              } else {
                setFormData({ ...formData, severity: value });
              }
            }}
            onChiefComplaintChange={(value) =>
              setFormData({ ...formData, chiefComplaint: value })
            }
            onSymptomsChange={(value) =>
              setFormData({ ...formData, symptoms: value })
            }
            onReferredHospitalChange={(value) =>
              setFormData({
                ...formData,
                referredHospitalId: value ?? undefined,
              })
            }
          />
        );
      case 2:
        return (
          <MedicalInfoForm
            vitalSigns={formData.vitalSigns}
            assessment={formData.assessment}
            diagnosis={formData.diagnosis}
            onVitalSignsChange={(value) =>
              setFormData({ ...formData, vitalSigns: value })
            }
            onAssessmentChange={(value) =>
              setFormData({ ...formData, assessment: value })
            }
            onDiagnosisChange={(value) =>
              setFormData({ ...formData, diagnosis: value })
            }
          />
        );
      case 3:
        return (
          <TreatmentForm
            medications={formData.medications}
            assignedStaff={formData.assignedStaff}
            onMedicationsChange={(value) =>
              setFormData({ ...formData, medications: value })
            }
            onAssignedStaffChange={(value) =>
              setFormData({ ...formData, assignedStaff: value })
            }
          />
        );
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PageMeta
        title="CMS | Emergency Case Management"
        description="Manage emergency cases in the school clinic"
      />

      <div>
        <StepperProgress steps={steps} currentStep={currentStep} />

        <div className="mb-6">{renderStepContent()}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            startIcon={<ArrowLeft size={16} />}
          >
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              endIcon={<ArrowRight size={16} />}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed()}
              startIcon={<CheckCircle size={16} />}
              className="bg-sky-600 hover:bg-sky-700"
            >
              Submit Case
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEmergencyCase;
