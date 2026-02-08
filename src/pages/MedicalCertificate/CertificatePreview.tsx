import {  useNavigate, useParams } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/buttons/Button";
import {
  MedicalCertificateFormData,
} from "./types";
import { formatDate } from "./utils";
import { FileText, ArrowLeft, } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { medicalRecordService } from "@/services/medicalRecordService";
import ContentLoading from "@/components/loadings/ContentLoading";

const CertificatePreview = () => {
  const { medId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useTransition();
  const [formData, setFormData] = useState<MedicalCertificateFormData | null>(
    null,
  );

  useEffect(() => {
    const fetch = () => {
      setLoading(async () => {
        if (!medId) return;
        const response = await medicalRecordService.ViewCertificate(
          Number(medId),
        );
        setFormData(response);
      });
    };

    fetch();
  }, [medId]);


  // const handlePrint = () => {
  //   window.print();
  // };

  // const handleDownload = () => {
  //   // In a real app, this would generate a PDF
  //   alert("Download functionality would be implemented here");
  // };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <PageMeta
        title="CMS | Medical Certificate Preview"
        description="Preview medical certificate"
      />

      <ContentLoading isLoading={loading} className=" h-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-4 flex gap-3 print:hidden">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              startIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            {/* <Button
              variant="outline"
              onClick={handlePrint}
              startIcon={<Printer className="w-4 h-4" />}
            >
              Print
            </Button> */}
            {/* <Button
              onClick={handleDownload}
              startIcon={<Download className="w-4 h-4" />}
            >
              Download PDF
            </Button> */}
          </div>

          {/* Certificate Document */}
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-700 to-sky-600 text-white px-8 py-6 print:bg-sky-700">
              <div className="flex items-center gap-4">
                <img
                  src="/photos/logo/logo.png"
                  alt="School Logo"
                  className="w-20 h-20 bg-white rounded-full p-2"
                  style={{ width: "80px", height: "80px" }}
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">School Health Services</h1>
                  <p className="text-sm text-sky-100 mt-1">
                    Clinic Management System
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center py-6 border-b border-gray-200">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-sky-100 rounded-full mb-2">
                <FileText className="w-5 h-5 text-sky-700" />
                <span className="text-sm font-semibold text-sky-700">
                  MEDICAL CERTIFICATE
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Date Issued: {formatDate(formData?.dateIssued ?? new Date)}
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-6">
              {/* To Whom It May Concern */}
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  TO WHOM IT MAY CONCERN
                </h2>
              </div>

              {/* Patient Information */}
              <section className="border-b border-gray-200 pb-6">
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Name:</span>
                    <p className="text-gray-900 font-semibold">
                      {formData?.patientName}
                    </p>
                  </div>
                  {formData?.dateOfBirth && (
                    <div>
                      <span className="text-gray-600 font-medium">
                        Date of Birth:
                      </span>
                      <p className="text-gray-900">
                        {formatDate(formData.dateOfBirth)}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="border-b border-gray-200 pb-6">
                <p className="text-base text-gray-900 leading-relaxed mb-4">
                  This is to certify that the above-named patient was examined
                  and treated at our clinic.
                </p>

                {formData?.diagnosis && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">
                      DIAGNOSIS:
                    </h4>
                    <p className="text-base text-gray-900 leading-relaxed">
                      {formData.diagnosis}
                    </p>
                  </div>
                )}

                {formData?.chiefComplaint && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">
                      CHIEF COMPLAINT:
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {formData.chiefComplaint}
                    </p>
                  </div>
                )}

                {formData?.physicalExamination && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">
                      PHYSICAL EXAMINATION:
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {formData.physicalExamination}
                    </p>
                  </div>
                )}
              </section>

              {/* Recommendations */}
              {formData?.recommendations && (
                <section className="border-b border-gray-200 pb-6">
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    RECOMMENDATIONS
                  </h3>
                  <p className="text-base text-gray-900 leading-relaxed">
                    {formData.recommendations}
                  </p>
                </section>
              )}

              {/* Rest Period */}
              {(formData && formData.restPeriodFrom || formData && formData.numberOfDays > 0) && (
                <section className="border-b border-gray-200 pb-6">
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    REST PERIOD
                  </h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                    <p className="text-base text-gray-900 font-semibold">
                      {formData.restPeriodFrom && formData.restPeriodTo ? (
                        <>
                          Patient is advised to take complete bed rest from{" "}
                          <strong>{formatDate(formData.restPeriodFrom)}</strong>{" "}
                          to{" "}
                          <strong>{formatDate(formData.restPeriodTo)}</strong> (
                          {formData.numberOfDays}{" "}
                          {formData.numberOfDays === 1 ? "day" : "days"}).
                        </>
                      ) : (
                        <>
                          Patient is advised to take {formData.numberOfDays}{" "}
                          {formData.numberOfDays === 1 ? "day" : "days"} of
                          rest.
                        </>
                      )}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded ${formData.fitToWork ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span className="text-sm text-gray-700">Fit to Work</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded ${formData.needsFollowUp ? "bg-blue-500" : "bg-gray-300"}`}
                      ></div>
                      <span className="text-sm text-gray-700">
                        Needs Follow-up
                      </span>
                    </div>
                  </div>

                  {formData.needsFollowUp && formData.followUpDate && (
                    <p className="text-sm text-gray-700 mt-3">
                      <strong>Follow-up Date:</strong>{" "}
                      {formatDate(formData.followUpDate)}
                    </p>
                  )}
                </section>
              )}

              {/* Restrictions */}
              {formData?.restrictions && (
                <section className="border-b border-gray-200 pb-6">
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    RESTRICTIONS
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {formData.restrictions}
                  </p>
                </section>
              )}

              {/* Remarks */}
              {formData?.remarks && (
                <section className="border-b border-gray-200 pb-6">
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    REMARKS
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {formData.remarks}
                  </p>
                </section>
              )}

              {/* Doctor's Signature */}
              <section className="pt-8">
                <div className="flex justify-end">
                  <div className="text-center min-w-[250px]">
                    {formData?.doctorSignature && (
                      <div className="mb-2">
                        <img
                          src={formData.doctorSignature}
                          alt="Doctor's Signature"
                          className="h-20 mx-auto"
                          style={{ width: "auto", height: "80px" }}
                        />
                      </div>
                    )}
                    <div className="border-t-2 border-gray-900 pt-2 px-8">
                      <p className="font-bold text-gray-900">
                        {formData?.doctorName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Attending Physician
                      </p>
                      {formData?.doctorLicenseNo && (
                        <p className="text-xs text-gray-500 mt-1">
                          License No.: {formData.doctorLicenseNo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 px-8 py-4 text-center text-xs text-gray-600 print:bg-gray-100">
              <p className="font-semibold">
                This certificate is issued upon the request of the patient for
                whatever legal purpose it may serve.
              </p>
              <p className="mt-2">
                School Health Services • Clinic Management System
              </p>
              <p className="mt-1">Generated on {formatDate(new Date())}</p>
            </div>
          </div>
        </div>
      </ContentLoading>
    </div>
  );
};

export default CertificatePreview;
