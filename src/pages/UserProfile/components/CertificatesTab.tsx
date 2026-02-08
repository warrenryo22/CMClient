import {  MedicalCertificateDTO } from '../types';
import { formatDate, formatShortDate } from '../utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card/Card';
import { FileText, Calendar, User,  AlertCircle } from 'lucide-react';

interface CertificatesTabProps {
  certificates: MedicalCertificateDTO[];
}

const CertificatesTab = ({ certificates }: CertificatesTabProps) => {
  if (certificates.length === 0) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="py-16 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Medical Certificates Found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            There are no medical certificates issued for this user yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {certificates.map((cert) => (
        <Card key={cert.certificateId} className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-sky-700 dark:text-sky-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">{cert.referenceNo}</CardTitle>
                  <CardDescription className="text-sm dark:text-gray-400">
                    Medical Certificate - {cert.purpose}
                  </CardDescription>
                </div>
              </div>
              {/* <Button
                variant="outline"
                size="sm"
                startIcon={<Download className="w-4 h-4" />}
              >
                Download
              </Button> */}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Issue Date</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatShortDate(cert.issueDate)}
                  </p>
                </div>
              </div>
              {cert.validUntil && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Valid Until</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatShortDate(cert.validUntil)}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Issued By</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {cert.doctor}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Diagnosis
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {cert.diagnosis}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Recommendations
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {cert.recommendations}
                </p>
              </div>
            </div>

            {cert.validUntil && new Date(cert.validUntil) < new Date() && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Certificate Expired
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                    This certificate is no longer valid as of {formatDate(cert.validUntil)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CertificatesTab;
