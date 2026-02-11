import { useEffect, useRef, useState, useTransition } from "react";
import { TabItem } from "@/components/tabs/CustomTabs";
import PageMeta from "@/components/common/PageMeta";
import MedicalRecordsTab from "./components/MedicalRecordsTab";
import AppointmentsTab from "./components/AppointmentsTab";
import CertificatesTab from "./components/CertificatesTab";
import OverallDetails from "./components/OverallDetails";
import { GetUserDetailsDTO } from "@/types/userManagementTypes";
import { useParams, useSearchParams } from "react-router";
import { userManagementService } from "@/services/userManagementService";
import {
  AppointmentData,
  MedicalCertificateDTO,
  MedicalRecordSummary,
} from "./types";
import UPSkeletonLoading from "./components/UPSkeletonLoading";
import { medicalRecordService } from "@/services/medicalRecordService";

const UserProfile = () => {
  const { userDetailsId } = useParams();
  const [searchParams] = useSearchParams();

  const isWalkin = searchParams.get("is_walkin") === "true";
  const [userDetails, setUserDetails] = useState<GetUserDetailsDTO>(
    new GetUserDetailsDTO(),
  );
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordSummary[]>(
    [],
  );
  const [loading, setLoading] = useTransition();
  const [loadingAppointment, setLoadingAppointment] = useTransition();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);

  const [certificates, setCertificates] = useState<MedicalCertificateDTO[]>([]);

  const fetchAppointments = () => {
    setLoadingAppointment(async () => {
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = String(currentDate.getFullYear());
      const response = await userManagementService.GetUserAppointments(
        Number(userDetailsId),
        {
          month,
          year,
        },
      );
      setAppointments(response);
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchDetails = () => {
    setLoading(async () => {
      if (!userDetailsId) return;
      const response = await userManagementService.GetUserProfileDetails(
        Number(userDetailsId),
        isWalkin
      );
      setUserDetails(response);
    });
  };

  const fetchMedicalRecords = () => {
    setLoading(async () => {
      if (!userDetailsId) return;
      const response = await userManagementService.GetUserMedicalRecords(
        Number(userDetailsId),
        isWalkin
      );
      setMedicalRecords(response);
    });
  };

  const fetchCertificates = () => {
    setLoading(async () => {
      if (!userDetailsId) return;
      const response = await medicalRecordService.GetMedicalCertificates(
        Number(userDetailsId),
        isWalkin
      );
      setCertificates(response);
    });
  };

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!userDetailsId) return;
    if (fetchedRef.current) return;

    fetchedRef.current = true;
    fetchDetails();
    fetchMedicalRecords();
    fetchCertificates();
  }, [userDetailsId]);

  const tabs: TabItem[] = [
    {
      key: "medical-records",
      title: "Medical Records",
      content: <MedicalRecordsTab records={medicalRecords} />,
    },
    {
      key: "appointments",
      title: "Appointments",
      content: (
        <AppointmentsTab
          loading={loadingAppointment}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          appointments={appointments}
        />
      ),
    },
    {
      key: "certificates",
      title: "Medical Certificates",
      content: <CertificatesTab certificates={certificates} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4">
      <PageMeta
        title="CMS | User Profile"
        description="View and manage user profile information"
      />
      {loading ? (
        <UPSkeletonLoading />
      ) : (
        <OverallDetails user={userDetails} tabs={tabs} />
      )}
    </div>
  );
};

export default UserProfile;
