import { useEffect, useState, useTransition } from "react";
import PageMeta from "@/components/common/PageMeta";
import { GetMedicalRecordDetailsDTO } from "@/types/medicalRecordsType";
import {
  getCourseName,
  getYearLevelName,
  getAppointmentReasonName,
  getActionTakenName,
  getUOMName,
} from "./utils";
import {
  FileText,
  Activity,
  Pill,
  ClipboardCheck,
  ArrowLeft,
} from "lucide-react";
import { downloadBase64Pdf, formatDate } from "@/utilities/helpers";
import "./ViewMedical.css";
import { useParams, useNavigate } from "react-router";
import { medicalRecordService } from "@/services/medicalRecordService";
import Button from "@/components/buttons/Button";
import ContentLoading from "@/components/loadings/ContentLoading";
import { AppointmentReasons } from "@/enums/commons";

const ViewMedical = () => {
  const { medId } = useParams();
  const navigate = useNavigate();
  const [medicalRecord, setMedicalRecord] =
    useState<GetMedicalRecordDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useTransition();

  const fetchDetails = () => {
    setIsLoading(async () => {
      if (!medId) return;
      const response = await medicalRecordService.ViewMedicalRecord(
        Number(medId),
      );
      setMedicalRecord(response);
    });
  };

  useEffect(() => {
    fetchDetails();
  }, [medId]);

  const isStudent = !!medicalRecord?.StudentDetails;
  const isStaff = !!medicalRecord?.StaffDetails;

  const handleExport = async () => {
    if (!medId) return;
    const response = await medicalRecordService.ExportMedicalPDF(Number(medId));
    downloadBase64Pdf(response.file, response.filename);
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 py-8">
      <PageMeta
        title="CMS | Medical Record"
        description="View Medical Record Details"
      />

      <ContentLoading isLoading={isLoading || !medicalRecord} className="h-100">
        <div className="max-w-5xl mx-auto px-4">
          {/* Action Buttons */}

          <div className="mb-4 flex justify-end gap-3 print:hidden">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              startIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            {/* {systemAccess?.includes(SYSTEMACCESS.CREATE_MEDICAL_CERT) && (
            <button
              onClick={() => navigate(`/create-medical-cert/${medId}`)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Create Medical Certificate
            </button>
          )} */}

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Print Record
            </button>
          </div>

          {/* Medical Record Paper */}
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
            {/* Header with Logo */}
            <div className="bg-gradient-to-r from-sky-700 to-sky-600 text-white px-8 py-6 print:bg-sky-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="/photos/logo/logo.png"
                    alt="School Logo"
                    className="w-16 h-16 bg-white rounded-full p-2"
                    style={{ width: "64px", height: "64px" }}
                  />
                  <div>
                    <h1 className="text-2xl font-bold">
                      School Health Services
                    </h1>
                    <p className="text-sm text-sky-100">
                      Clinic Management System
                    </p>
                    <p className="text-xs text-sky-200 mt-1">
                      Medical Record • {medicalRecord?.ReferenceNo}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold">
                    {formatDate(medicalRecord?.VisitDate)}
                  </p>
                  <p className="text-sky-100">{medicalRecord?.VisitTime}</p>
                </div>
              </div>
            </div>

            {/* Medical Record Content */}
            <div className="p-8 space-y-6">
              {/* Patient Information */}
              <section className="border-b border-gray-200 pb-6 medical-record-section">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-sky-700" />
                  Patient Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Patient Name
                    </p>
                    <p className="text-base text-gray-900 font-semibold">
                      {medicalRecord?.PatientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Patient ID
                    </p>
                    <p className="text-base text-gray-900">
                      {medicalRecord?.UserDetailsId}
                    </p>
                  </div>

                  {isStudent && medicalRecord.StudentDetails && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Course
                        </p>
                        <p className="text-base text-gray-900">
                          {getCourseName(medicalRecord.StudentDetails.Course)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Year Level
                        </p>
                        <p className="text-base text-gray-900">
                          {getYearLevelName(medicalRecord.StudentDetails.Year)}
                        </p>
                      </div>
                    </>
                  )}

                  {isStaff && medicalRecord.StaffDetails && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Department
                        </p>
                        <p className="text-base text-gray-900">
                          {medicalRecord.StaffDetails.StaffDepartment || "N/A"}
                        </p>
                      </div>
                      {/* <div>
                      <p className="text-sm text-gray-600 font-medium">Role</p>
                      <p className="text-base text-gray-900">
                        {medicalRecord.StaffDetails.StaffRole || "N/A"}
                      </p>
                    </div> */}
                    </>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Visit Reason
                    </p>
                    <p className="text-base text-gray-900">
                      {getAppointmentReasonName(
                        medicalRecord?.Reason ??
                          AppointmentReasons.OTHER_HEALTH_CONCERNS,
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* Vital Signs */}
              {medicalRecord?.VitalSigns && (
                <section className="border-b border-gray-200 pb-6 medical-record-section">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sky-700" />
                    Vital Signs
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {medicalRecord.VitalSigns.Temperature && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium mb-1">
                          Temperature
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {medicalRecord.VitalSigns.Temperature}°C
                        </p>
                      </div>
                    )}
                    {medicalRecord.VitalSigns.BloodPressure && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium mb-1">
                          Blood Pressure
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {medicalRecord.VitalSigns.BloodPressure}
                        </p>
                      </div>
                    )}
                    {medicalRecord.VitalSigns.PulseRate && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium mb-1">
                          Pulse Rate
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {medicalRecord.VitalSigns.PulseRate} bpm
                        </p>
                      </div>
                    )}
                    {medicalRecord.VitalSigns.Height && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium mb-1">
                          Height
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {medicalRecord.VitalSigns.Height} cm
                        </p>
                      </div>
                    )}
                    {medicalRecord.VitalSigns.Weight && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium mb-1">
                          Weight
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {medicalRecord.VitalSigns.Weight} kg
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Chief Complaint / Symptoms */}
              <section className="border-b border-gray-200 pb-6 medical-record-section">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Chief Complaint / Symptoms
                </h2>
                <p className="text-base text-gray-700 leading-relaxed">
                  {medicalRecord?.Symptoms}
                </p>
              </section>

              {/* Findings / Diagnosis */}
              <section className="border-b border-gray-200 pb-6 medical-record-section">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Findings / Diagnosis
                </h2>
                <p className="text-base text-gray-700 leading-relaxed">
                  {medicalRecord?.Findings}
                </p>
              </section>

              {/* Action Taken */}
              <section className="border-b border-gray-200 pb-6 medical-record-section">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Action Taken
                </h2>
                <div className="flex flex-wrap gap-2">
                  {medicalRecord?.ActionTaken?.map((action, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-medium"
                    >
                      {getActionTakenName(action)}
                    </span>
                  ))}
                </div>
              </section>

              {/* Medications / Items Provided */}
              {medicalRecord && medicalRecord.ItemsProvided.length > 0 && (
                <section className="border-b border-gray-200 pb-6 medical-record-section">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-sky-700" />
                    Medications / Items Provided
                  </h2>
                  <div className="space-y-3">
                    {medicalRecord?.ItemsProvided?.length > 0 && (
                      <section className="border-b border-gray-200 pb-6 medical-record-section">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Pill className="w-5 h-5 text-sky-700" />
                          Medications / Items Provided
                        </h2>

                        <div className="space-y-3">
                          {medicalRecord.ItemsProvided.map((item, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                            >
                              <p className="font-semibold text-gray-900">
                                {item.Product.Title}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.Quantity}{" "}
                                {getUOMName(item.Product.UOM)}
                              </p>

                              {item.Notes && (
                                <p className="text-sm text-gray-700 italic mt-2">
                                  Instructions: {item.Notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </section>
              )}

              {/* Remarks / Recommendations */}
              <section className="border-b border-gray-200 pb-6 medical-record-section">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Remarks / Recommendations
                </h2>
                <p className="text-base text-gray-700 leading-relaxed">
                  {medicalRecord?.Remarks}
                </p>
              </section>

              {/* Doctor's Signature */}
              <section className="pt-8">
                <div className="flex justify-end">
                  <div className="text-center">
                    <div className="mb-2">
                      {medicalRecord?.DoctorSignature && (
                        <img
                          src={medicalRecord.DoctorSignature}
                          alt="Doctor's Signature"
                          className="h-20 mx-auto"
                          style={{ width: "auto", height: "80px" }}
                        />
                      )}
                    </div>
                    <div className="border-t-2 border-gray-900 pt-2 px-8">
                      <p className="font-bold text-gray-900">
                        {medicalRecord?.DoctorName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Attending Physician
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(medicalRecord?.CreatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 px-8 py-4 text-center text-xs text-gray-600 print:bg-gray-100">
              <p>
                This is a confidential medical record. Unauthorized access or
                disclosure is prohibited.
              </p>
              <p className="mt-1">
                School Health Services • Clinic Management System • Generated on{" "}
                {formatDate(new Date())}
              </p>
            </div>
          </div>
        </div>
      </ContentLoading>
    </div>
  );
};

export default ViewMedical;
