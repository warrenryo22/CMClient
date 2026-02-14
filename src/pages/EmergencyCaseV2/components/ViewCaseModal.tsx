import { MainModal } from "@/components/modals/MainModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/Card";
import {
  User,
  AlertCircle,
  Activity,
  Pill,
  Hospital,
  FileText,
  Calendar,
  Phone,
} from "lucide-react";
import { formatStatus } from "@/utilities/helpers";
import { Gender, Courses, YearLevels, UserRoles } from "@/enums/commons";
import {
  GetCaseDetailsDTO,
  mapCaseDetailsResponse,
} from "@/types/medicalRecordsType";
import { useEffect, useState, useTransition } from "react";
import { medicalRecordService } from "@/services/medicalRecordService";
import ContentLoading from "@/components/loadings/ContentLoading";
import { CaseType, Severity } from "@/enums/emergencyCase";

interface ViewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: number | null;
}

const ViewCaseModal: React.FC<ViewCaseModalProps> = ({
  isOpen,
  onClose,
  caseId,
}) => {
  const [caseData, setCaseData] = useState<GetCaseDetailsDTO>(
    new GetCaseDetailsDTO(),
  );
  const [fetchLoading, setFetchLoading] = useTransition();

  const fetch = () => {
    setFetchLoading(async () => {
      if (!caseId) return;
      const response = await medicalRecordService.GetSingleCase(caseId);
      const caseDetails = mapCaseDetailsResponse(response);
      setCaseData(caseDetails);
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    fetch();
  }, [isOpen]);

  const getSeverityColor = (severity: Severity | undefined) => {
    if (!severity) return "bg-gray-100 text-gray-800 border-gray-300";
    switch (severity) {
      case Severity.CRITICAL:
        return "bg-red-100 text-red-800 border-red-300";
      case Severity.SEVERE:
        return "bg-orange-100 text-orange-800 border-orange-300";
      case Severity.MODERATE:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <MainModal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-5xl"
      title="Emergency Case Details"
    >
      <ContentLoading isLoading={fetchLoading} className="h-50">
        <div className="print:p-0">
          {/* Print Header - Only visible when printing */}
          <div className="hidden print:block mb-6">
            <div className="text-center border-b-2 border-gray-300 pb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Emergency Case Report
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                School Clinic Management System
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Case Information */}
            <Card className="print:shadow-none print:border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sky-700">
                  <AlertCircle size={20} />
                  Case Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Case Number</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {caseData.CaseNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Case Type</p>
                    <p className="font-semibold text-gray-900">
                      {formatStatus(CaseType[caseData.CaseType])}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Severity</p>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-md border-2 ${getSeverityColor(caseData.Severity)}`}
                    >
                      {formatStatus(Severity[caseData.Severity])}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date & Time
                    </p>
                    <p className="font-semibold text-gray-900">
                      {new Date(caseData.CreatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Information */}
            {caseData.Patient && (
              <Card className="print:shadow-none print:border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sky-700">
                    <User size={20} />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Full Name</p>
                      <p className="font-semibold text-gray-900">
                        {caseData.Patient.FirstName} {caseData.Patient.LastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Gender</p>
                      <p className="font-semibold text-gray-900">
                        {caseData.Patient.Gender !== undefined &&
                          formatStatus(Gender[caseData.Patient.Gender])}
                      </p>
                    </div>
                    {caseData.Patient.StudentDetails && (
                      <>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Student Number
                          </p>
                          <p className="font-semibold text-gray-900">
                            {caseData.Patient.StudentDetails.StudentNo}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Course & Year
                          </p>
                          <p className="font-semibold text-gray-900">
                            {caseData.Patient.StudentDetails.Course !==
                              undefined &&
                              formatStatus(
                                String(
                                  Courses[
                                    caseData.Patient.StudentDetails.Course
                                  ],
                                ),
                              )}{" "}
                            -{" "}
                            {caseData.Patient.StudentDetails.Year !==
                              undefined &&
                              formatStatus(
                                String(
                                  YearLevels[
                                    caseData.Patient.StudentDetails.Year
                                  ],
                                ),
                              )}
                          </p>
                        </div>
                      </>
                    )}
                    {caseData.Patient.Phone && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Contact Number
                        </p>
                        <p className="font-semibold text-gray-900">
                          {caseData.Patient.Phone}
                        </p>
                      </div>
                    )}
                    {caseData.Patient.EmergencyContactName && (
                      <>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Emergency Contact
                          </p>
                          <p className="font-semibold text-gray-900">
                            {caseData.Patient.EmergencyContactName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Emergency Contact Number
                          </p>
                          <p className="font-semibold text-gray-900">
                            {caseData.Patient.EmergencyContactPhone}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medical Assessment */}
            <Card className="print:shadow-none print:border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sky-700">
                  <Activity size={20} />
                  Medical Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {caseData.ChiefComplaint && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Chief Complaint
                    </p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {caseData.ChiefComplaint}
                    </p>
                  </div>
                )}

                {caseData.Symptoms && caseData.Symptoms.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Symptoms
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {caseData.Symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-medium"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {caseData.VitalSigns && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-3">
                      Vital Signs
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {caseData.VitalSigns.BloodPressure && (
                        <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-lg border border-sky-200">
                          <p className="text-xs text-sky-700 font-medium mb-1">
                            Blood Pressure
                          </p>
                          <p className="font-bold text-gray-900 text-lg">
                            {caseData.VitalSigns.BloodPressure}{" "}
                            <span className="text-sm font-normal text-gray-600">
                              mmHg
                            </span>
                          </p>
                        </div>
                      )}
                      {caseData.VitalSigns.HeartRate && (
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                          <p className="text-xs text-red-700 font-medium mb-1">
                            Heart Rate
                          </p>
                          <p className="font-bold text-gray-900 text-lg">
                            {caseData.VitalSigns.HeartRate}{" "}
                            <span className="text-sm font-normal text-gray-600">
                              bpm
                            </span>
                          </p>
                        </div>
                      )}
                      {caseData.VitalSigns.Temperature && (
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                          <p className="text-xs text-orange-700 font-medium mb-1">
                            Temperature
                          </p>
                          <p className="font-bold text-gray-900 text-lg">
                            {caseData.VitalSigns.Temperature}{" "}
                            <span className="text-sm font-normal text-gray-600">
                              °C
                            </span>
                          </p>
                        </div>
                      )}
                      {caseData.VitalSigns.OxygenSaturation && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 font-medium mb-1">
                            O₂ Saturation
                          </p>
                          <p className="font-bold text-gray-900 text-lg">
                            {caseData.VitalSigns.OxygenSaturation}{" "}
                            <span className="text-sm font-normal text-gray-600">
                              %
                            </span>
                          </p>
                        </div>
                      )}
                      {caseData.VitalSigns.RespiratoryRate && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                          <p className="text-xs text-purple-700 font-medium mb-1">
                            Respiratory Rate
                          </p>
                          <p className="font-bold text-gray-900 text-lg">
                            {caseData.VitalSigns.RespiratoryRate}{" "}
                            <span className="text-sm font-normal text-gray-600">
                              /min
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {caseData.Assessment && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Clinical Assessment
                    </p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {caseData.Assessment}
                    </p>
                  </div>
                )}

                {caseData.Diagnosis && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Diagnosis
                    </p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {caseData.Diagnosis}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medications */}
            {caseData.Medications && caseData.Medications.length > 0 && (
              <Card className="print:shadow-none print:border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sky-700">
                    <Pill size={20} />
                    Medications & Treatment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {caseData.Medications.map((med) => (
                      <div
                        key={med.Id}
                        className="flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">
                            {med.ProductName}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span className="font-medium text-gray-700">
                                Quantity:
                              </span>{" "}
                              {med.Quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assigned Staff */}
            {caseData.AssignedStaff && caseData.AssignedStaff.length > 0 && (
              <Card className="print:shadow-none print:border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sky-700">
                    <User size={20} />
                    Assigned Staff
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {caseData.AssignedStaff.map((staff) => (
                      <div
                        key={staff.Id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {staff.Name} 
                          </p>
                          {staff.Role && (
                            <p className="text-sm text-gray-600">
                              {formatStatus(UserRoles[staff.Role])}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hospital Referral */}
            {caseData.TransferHospital && (
              <Card className="print:shadow-none print:border bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Hospital size={20} />
                    Hospital Referral
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-orange-800 mb-1">
                      Hospital Name
                    </p>
                    <p className="text-gray-900 font-semibold text-lg">
                      {caseData.TransferHospital.Name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-orange-800 mb-1">
                      Address
                    </p>
                    <p className="text-gray-900">
                      {caseData.TransferHospital.Address}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-orange-800 mb-1 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Number
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {caseData.TransferHospital.ContactNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-orange-800 mb-1">
                        Emergency Department
                      </p>
                      <p className="text-gray-900">
                        {caseData.TransferHospital.EmergencyDepartment}
                      </p>
                    </div>
                  </div>
                  {caseData.TransferHospital.AmbulanceAvailable && (
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full border-2 border-green-300">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Ambulance Available
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Additional Notes */}
            {caseData.Notes && (
              <Card className="print:shadow-none print:border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sky-700">
                    <FileText size={20} />
                    Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {caseData.Notes}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Footer - Only visible when printing */}
            <div className="hidden print:block mt-8 pt-6 border-t-2 border-gray-300">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Prepared by:</p>
                  <p className="font-semibold text-lg text-gray-900">
                    {caseData.CreatedBy || "School Clinic Staff"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Date: {new Date(caseData.CreatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Signature:</p>
                  <div className="border-b-2 border-gray-400 mt-10"></div>
                  <p className="text-xs text-gray-500 mt-1">
                    Authorized Personnel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentLoading>
    </MainModal>
  );
};

export default ViewCaseModal;
