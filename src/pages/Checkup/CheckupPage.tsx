"use client";
import { useEffect, useState } from "react";
import { PersonInfoCard } from "./components/person-info-card";
import { CheckupForm } from "./components/checkup-form";
import { useParams } from "react-router";
import { GetInitialMedicalRecordsDTO } from "@/types/medicalRecordsType";
import { medicalRecordService } from "@/services/medicalRecordService";
import ContentLoading from "@/components/loadings/ContentLoading";

const CheckupPage = () => {
  const { appointmentId } = useParams();
  const [initialRecord, setInitialRecord] =
    useState<GetInitialMedicalRecordsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInitialRecord = async () => {
    if (!appointmentId) return;
    setIsLoading(true);
    const response = await medicalRecordService.GetInitialMedicalRecords(
      Number(appointmentId),
    );
    setInitialRecord(response);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInitialRecord();
  }, [appointmentId]);

  return (
    <div className="space-y-6">
      <ContentLoading isLoading={isLoading} size={18} className="h-150" loadingContent="Loading..."> 
        {initialRecord && (
          <>
            <PersonInfoCard details={initialRecord} />
            <CheckupForm initialData={initialRecord} />
          </>
        )}
      </ContentLoading>
    </div>
  );
};

export default CheckupPage;
