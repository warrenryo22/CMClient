import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import PageBreadCrumb, {
  BreadcrumbItem,
} from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableData from "@/components/tables/TableData";
import TableHead from "@/components/tables/TableHead";
import { CaseType, Severity } from "@/enums/emergencyCase";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { medicalRecordService } from "@/services/medicalRecordService";
import { formatDate, formatStatus } from "@/utilities/helpers";
import { Eye, Plus, User } from "lucide-react";
import { useNavigate } from "react-router";
import ViewCaseModal from "./components/ViewCaseModal";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";

const EmergencyCase = () => {
  const navigate = useNavigate();
  const caseModal = useModal();
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Emergency Case", href: "/all-products" },
  ];

  const paginated = usePaginatedTable({
    fetchFunction: medicalRecordService.GetCasesPaginated,
  });

  return (
    <div>
      <ViewCaseModal
        caseId={selectedCaseId}
        isOpen={caseModal.isOpen}
        onClose={caseModal.closeModal}
      />
      <PageMeta
        title="CMS | Emergency Cases"
        description="CMS |  All Emergency Cases"
      />

      <PageBreadCrumb
        title="ALL EMERGENCY CASES"
        items={breadcrumbItems}
        showHome={false}
        buttonChilren={
          <Button
            variant="primary"
            onClick={() => {
              navigate("/create-emergency-case");
            }}
            startIcon={<Plus size={15} />}
          >
            Create Emergency Case
          </Button>
        }
      />

      <PaginatedTable title="BRAND" usePaginated={paginated}>
        <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
          <tr>
            {[
              "Case Number",
              "Full Name",
              "Severity",
              "Case Type",
              "Created At",
              "Action",
            ].map((title, i) => (
              <TableHead key={i}>{title}</TableHead>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.tableValues.map((item) => (
            <tr
              key={item.Id}
              className="hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-colors duration-50 text-[12.5px] text-center border-2 border-gray-200 dark:border-gray-800"
            >
              <TableData label="Case Number" highlight>
                {item.CaseNumber}
              </TableData>
              <TableData label="Full Name">{item.FullName}</TableData>
              <TableData label="Severity">
                {formatStatus(Severity[item.Severity])}
              </TableData>
              <TableData label="Case Type">
                {formatStatus(CaseType[item.CaseType])}
              </TableData>
              <TableData label="Created At">
                {formatDate(item.CreatedAt)}
              </TableData>
              <TableData>
                <IconButton
                  tooltipTitle={`VIEW`}
                  addedClass="view-icon bg-green-100 hover:bg-green-600 mr-2"
                  icon={() => <Eye size={15} />}
                  onClick={() => {
                    setSelectedCaseId(item.Id);
                    caseModal.openModal();
                  }}
                />
                <IconButton
                  tooltipTitle={`VIEW PATIENT`}
                  addedClass="payment-icon bg-green-100 hover:bg-green-600 mr-2"
                  icon={() => <User size={15} />}
                  onClick={() => {
                    navigate(`/user-profile/${item.UserDetailsId}?is_walkin=${false}`);
                  }}
                />
              </TableData>
            </tr>
          ))}
        </tbody>
      </PaginatedTable>
    </div>
  );
};

export default EmergencyCase;
