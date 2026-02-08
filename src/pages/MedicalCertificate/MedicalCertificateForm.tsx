import { useState, useEffect, useTransition } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import Input from "@/components/input/InputField";
import TextArea from "@/components/input/TextArea";
import DatePicker from "@/components/input/DatePicker";
import Button from "@/components/buttons/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/card/Card";
import {
  MedicalCertificateFormData,
  AIMockDataSuggestion,
  MedicalCertificateFormDataDTO,
} from "./types";
import { calculateDaysBetween } from "./utils";
import { useModal } from "@/hooks/useModal";
import ESignatureModal from "./components/ESignatureModal";
import AIAssistModal from "./components/AIAssistModal";
import {
  FileText,
  User,
  Stethoscope,
  Calendar,
  Sparkles,
  PenTool,
  ArrowLeft,
} from "lucide-react";
import { medicalRecordService } from "@/services/medicalRecordService";
import { localUploadService } from "@/services/localUploadService";
import ContentLoading from "@/components/loadings/ContentLoading";

const MedicalCertificateForm = () => {
  const { reqId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<MedicalCertificateFormDataDTO>(
    new MedicalCertificateFormDataDTO(),
  );
  const [submitLoading, setSubmitLoading] = useTransition();
  const [isLoading, setIsLoading] = useTransition();
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const signatureModal = useModal();
  const aiAssistModal = useModal();

  useEffect(() => {
    const fetchMedicalRecord = () => {
      setIsLoading(async () => {
        if (!reqId) return;
        const response = await medicalRecordService.GetRequestCertFormDetails(
          Number(reqId),
        );
        setFormData(response);
      });
    };

    fetchMedicalRecord();
  }, [reqId]);

  const handleChange = (
    field: keyof MedicalCertificateFormData,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (
    field: keyof MedicalCertificateFormData,
    value: Date | [Date, Date] | null,
  ) => {
    if (Array.isArray(value)) {
      setFormData((prev) => ({ ...prev, [field]: value[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAIApply = (suggestion: AIMockDataSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      diagnosis: suggestion.diagnosis,
      chiefComplaint: suggestion.chiefComplaint,
      physicalExamination: suggestion.physicalExamination,
      recommendations: suggestion.recommendations,
      numberOfDays: suggestion.numberOfDays,
      fitToWork: suggestion.fitToWork,
      needsFollowUp: suggestion.needsFollowUp,
      restrictions: suggestion.restrictions,
      remarks: suggestion.remarks,
    }));
  };

  const handleSignatureSave = (signatureFile: File) => {
    setSignatureFile(signatureFile);

    const previewUrl = URL.createObjectURL(signatureFile);
    setSignaturePreview(previewUrl);
  };

  const handleSubmit = () => {
    setSubmitLoading(async () => {
      if (!signatureFile) {
        signatureModal.openModal();
        return;
      }

      const fileData = new FormData();
      fileData.append("image", signatureFile);
      const imageUrl = await localUploadService.UploadImageLocal(fileData);
      if (imageUrl) {
        formData.doctorSignature = imageUrl;
      } else {
        return;
      }

      const response = await medicalRecordService.CreateCertificate(formData);
      if (response) {
        alert("Medical certificate created successfully!");
        navigate(`/medical-certificate/view/${formData.medicalRecordId}`);
      }

      // setTimeout(() => {
      //   console.log("Submitting certificate:", formData);
      //   alert("Medical certificate created successfully!");
      //   navigate(`/medical-records/view/${reqId}`);
      // }, 1500);
    });
  };

  // const handlePreview = () => {
  //   navigate(`/medical-certificate/preview/${reqId}`, { state: { formData } });
  // };

  useEffect(() => {
    if (formData.restPeriodFrom && formData.restPeriodTo) {
      const days = calculateDaysBetween(
        formData.restPeriodFrom,
        formData.restPeriodTo,
      );
      setFormData((prev) => ({ ...prev, numberOfDays: days }));
    }
  }, [formData.restPeriodFrom, formData.restPeriodTo]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4">
      <PageMeta
        title="CMS | Create Medical Certificate"
        description="Create a new medical certificate"
      />

      <ContentLoading isLoading={isLoading} className="h-100">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                startIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create Medical Certificate
                </h1>
                {/* <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Medical Record: {medicalRecord?.ReferenceNo}
              </p> */}
              </div>
            </div>
            <Button
              onClick={aiAssistModal.openModal}
              variant="outline"
              startIcon={<Sparkles className="w-4 h-4" />}
              className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20"
            >
              AI Assist
            </Button>
          </div>

          {/* Patient Information */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                <User className="w-5 h-5" />
                <CardTitle>Patient Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.patientName}
                    isReadOnly
                    onChange={(e) =>
                      handleChange("patientName", e.target.value)
                    }
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <DatePicker
                    id="dob"
                    value={formData.dateOfBirth}
                    onChange={(value) => handleDateChange("dateOfBirth", value)}
                    placeholder="Select date"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Details */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                <Stethoscope className="w-5 h-5" />
                <CardTitle>Medical Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Issued <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  id="date-issued"
                  value={formData.dateIssued}
                  onChange={(value) => handleDateChange("dateIssued", value)}
                  placeholder="Select date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <TextArea
                  value={formData.diagnosis}
                  onChange={(value) => handleChange("diagnosis", value)}
                  placeholder="Enter diagnosis..."
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chief Complaint <span className="text-red-500">*</span>
                </label>
                <TextArea
                  value={formData.chiefComplaint}
                  onChange={(value) => handleChange("chiefComplaint", value)}
                  placeholder="Patient's main symptoms and complaints..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Physical Examination Findings
                </label>
                <TextArea
                  value={formData.physicalExamination}
                  onChange={(value) =>
                    handleChange("physicalExamination", value)
                  }
                  placeholder="Physical examination results..."
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recommendations <span className="text-red-500">*</span>
                </label>
                <TextArea
                  value={formData.recommendations}
                  onChange={(value) => handleChange("recommendations", value)}
                  placeholder="Medical recommendations and treatment plan..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Rest Period */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                <Calendar className="w-5 h-5" />
                <CardTitle>Rest/Leave Period</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From
                  </label>
                  <DatePicker
                    id="rest-from"
                    value={formData.restPeriodFrom}
                    onChange={(value) =>
                      handleDateChange("restPeriodFrom", value)
                    }
                    placeholder="Start date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To
                  </label>
                  <DatePicker
                    id="rest-to"
                    value={formData.restPeriodTo}
                    onChange={(value) =>
                      handleDateChange("restPeriodTo", value)
                    }
                    placeholder="End date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Days
                  </label>
                  <Input
                    type="number"
                    value={formData.numberOfDays}
                    onChange={(e) =>
                      handleChange(
                        "numberOfDays",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    placeholder="Days"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="fit-to-work"
                    checked={formData.fitToWork}
                    onChange={(e) =>
                      handleChange("fitToWork", e.target.checked)
                    }
                    className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="fit-to-work"
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Fit to Work
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="needs-followup"
                    checked={formData.needsFollowUp}
                    onChange={(e) =>
                      handleChange("needsFollowUp", e.target.checked)
                    }
                    className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="needs-followup"
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Needs Follow-up
                  </label>
                </div>
              </div>

              {formData.needsFollowUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Follow-up Date
                  </label>
                  <DatePicker
                    id="followup-date"
                    value={formData.followUpDate}
                    onChange={(value) =>
                      handleDateChange("followUpDate", value)
                    }
                    placeholder="Select follow-up date"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Restrictions
                </label>
                <TextArea
                  value={formData.restrictions}
                  onChange={(value) => handleChange("restrictions", value)}
                  placeholder="Any work or activity restrictions..."
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Remarks
                </label>
                <TextArea
                  value={formData.remarks}
                  onChange={(value) => handleChange("remarks", value)}
                  placeholder="Additional notes or remarks..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Doctor Information */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                  <FileText className="w-5 h-5" />
                  <CardTitle>Doctor Information</CardTitle>
                </div>
                <Button
                  onClick={signatureModal.openModal}
                  variant="outline"
                  startIcon={<PenTool className="w-4 h-4" />}
                >
                  {formData.doctorSignature
                    ? "Update Signature"
                    : "Add Signature"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Doctor Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.doctorName}
                    isReadOnly
                    onChange={(e) => handleChange("doctorName", e.target.value)}
                    placeholder="Dr. Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.doctorLicenseNo}
                    isReadOnly
                    onChange={(e) =>
                      handleChange("doctorLicenseNo", e.target.value)
                    }
                    placeholder="License No."
                  />
                </div>
              </div>

              {signaturePreview && (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Signature:
                  </p>
                  <img
                    src={signaturePreview}
                    alt="Doctor's Signature"
                    className="h-24 bg-white border border-gray-300 dark:border-gray-600 rounded px-4"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pb-6">
            {/* <Button
            variant="outline"
            onClick={handlePreview}
            startIcon={<Eye className="w-4 h-4" />}
          >
            Preview
          </Button> */}
            <Button
              onClick={handleSubmit}
              isLoading={submitLoading}
              startIcon={<FileText className="w-4 h-4" />}
            >
              Create Certificate
            </Button>
          </div>
        </div>

        <ESignatureModal
          isOpen={signatureModal.isOpen}
          onClose={signatureModal.closeModal}
          onSave={handleSignatureSave}
          doctorName={formData.doctorName || "Doctor"}
        />

        <AIAssistModal
          isOpen={aiAssistModal.isOpen}
          onClose={aiAssistModal.closeModal}
          medId={formData.medicalRecordId}
          onApply={handleAIApply}
        />
      </ContentLoading>
    </div>
  );
};

export default MedicalCertificateForm;
