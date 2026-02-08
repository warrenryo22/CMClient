import IconButton from "@/components/buttons/IconButton";
import PageBreadCrumb, {
  BreadcrumbItem,
} from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ApprovalModal from "@/components/modals/ApprovalModal";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableData from "@/components/tables/TableData";
import TableHead from "@/components/tables/TableHead";
import { useModal } from "@/hooks/useModal";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { medicalRecordService } from "@/services/medicalRecordService";
import { formatDate } from "@/utilities/helpers";
import { Eye, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { useNavigate } from "react-router";

const AllStudentMedicalRecords = () => {
  const navigate = useNavigate();
  const approvalModal = useModal();
  const [selectedMedicalRec, setSelectedMedicalRec] = useState<number | null>(
    null,
  );
  const [submitLoading, setSubmitLoading] = useTransition();
  const paginated = usePaginatedTable({
    fetchFunction: medicalRecordService.GetMedicalRecordsPaginated,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Products", href: "/all-products" },
  ];

  const handleConfirmationClose = (isSuccess: boolean) => {
    if (isSuccess) {
      setSubmitLoading(async () => {
        if (!selectedMedicalRec) return;
        const response =
          await medicalRecordService.RequestMedicalRecords(selectedMedicalRec);
        if (response) {
          paginated.refresh();
        }
        approvalModal.closeModal();
      });
    } else {
      approvalModal.closeModal();
    }
  };

  return (
    <div>
      <div>
        <PageMeta
          title="CMS | All Medical Records"
          description="CMS |  All Medical Records"
        />

        <PageBreadCrumb
          title="PRODUCTS"
          items={breadcrumbItems}
          showHome={false}
        />

        <ApprovalModal
          buttonLoading={submitLoading}
          isOpen={approvalModal.isOpen}
          title={`REQUEST MEDICAL CERTIFICATE`}
          description={`Are you sure you want to proceed?`}
          onClose={handleConfirmationClose}
          buttonSubmitTitle="Request Certificate"
          buttonCancelTitle="Cancel"
        />

        <PaginatedTable title="BRAND" usePaginated={paginated}>
          <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
            <tr>
              {["ID", "Created By", "Reference No", "Created At", "Action"].map(
                (title, i) => (
                  <TableHead key={i}>{title}</TableHead>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.tableValues.map((item) => (
              <tr
                key={item.Id}
                className="hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-colors duration-50 text-[12.5px] text-center border-2 border-gray-200 dark:border-gray-800"
              >
                <TableData label="ID">{item.Id}</TableData>
                <TableData label="Created By">{item.CreatedBy}</TableData>
                <TableData label="Reference No">{item.ReferenceNo}</TableData>
                <TableData label="Created At">
                  {formatDate(item.CreatedAt)}
                </TableData>
                <TableData>
                  <IconButton
                    tooltipTitle={`VIEW MEDICAL DATA`}
                    addedClass="edit-icon bg-green-100 hover:bg-green-600 mr-2"
                    icon={() => <Eye size={15} />}
                    onClick={() => {
                      navigate(`/view-medical-records/${item.Id}`);
                    }}
                  />
                  {!item.IsRequested && (
                    <IconButton
                      tooltipTitle={`REQUEST CERTIFICATE`}
                      addedClass="payment-icon bg-green-100 hover:bg-green-600 mr-2"
                      icon={() => <Send size={15} />}
                      onClick={() => {
                        approvalModal.openModal();
                        setSelectedMedicalRec(item.Id);
                      }}
                    />
                  )}
                </TableData>
              </tr>
            ))}
          </tbody>
        </PaginatedTable>
      </div>
    </div>
  );
};

export default AllStudentMedicalRecords;
