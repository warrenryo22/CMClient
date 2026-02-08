import ContentLoading from "@/components/loadings/ContentLoading";
import { MainModal } from "@/components/modals/MainModal";
import { AppointmentReasons, AppointmentType } from "@/enums/commons";
import { appointmentService } from "@/services/appointmentService";
import { GetUserAppointmentDetailsDTO } from "@/types/appointmentTypes";
import { formatDate, formatStatus, formatTimeTo12Hour } from "@/utilities/helpers";
import { Calendar, Clock, FileText,  Tag } from "lucide-react";
import { useEffect, useState } from "react";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number | null;
}

const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointmentId,
}: AppointmentDetailsModalProps) => {
  const [appointmentDetails, setAppointmentDetails] =
    useState<GetUserAppointmentDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchAppointmentDetails = async () => {
      if (!appointmentId) return;
      setIsLoading(true);
      const response = await appointmentService.GetUserAppointmentDetails(
        appointmentId
      );
      setAppointmentDetails(response);
      setIsLoading(false);
    };
    fetchAppointmentDetails();
  }, [isOpen, appointmentId]);

  const handleCloseModal = () => {
    onClose();
  };
  return (
    <div>
      <MainModal
        title="APPOINTMENT DETAILS"
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="max-w-md"
      >
        <>
          <ContentLoading isLoading={isLoading} className="h-56">
            <div className="">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-sky-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date</p>
                    <p className="text-gray-900 mt-1 text-sm">
                      {formatDate(appointmentDetails?.AppointmentDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-sky-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Time</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatTimeTo12Hour(appointmentDetails?.AppointmentTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-sky-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Reason</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatStatus(
                        AppointmentReasons[
                          appointmentDetails?.Reason ??
                            AppointmentReasons.ALLERGY_OR_ASTHMA_RELATED_SYMPTOMS
                        ]
                      )}
                    </p>
                    {appointmentDetails?.OtherReason && (
                      <p className="text-sm text-gray-600 mt-1">
                        {appointmentDetails.OtherReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Tag className="w-5 h-5 text-sky-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Type</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatStatus(
                        AppointmentType[
                          appointmentDetails?.Type ?? AppointmentType.SCHEDULED
                        ]
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {/* <div>
                <div className="flex items-center justify-center flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-sky-600" />
                    <h3 className="text-sm font-medium text-gray-800">
                      Appointment QR Code
                    </h3>
                  </div>

                  <div>
                    <QRCode
                      value={
                        appointmentDetails?.QrToken || "No QR Code Available"
                      }
                      size={200}
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </ContentLoading>
        </>
      </MainModal>
    </div>
  );
};

export default AppointmentDetailsModal;
