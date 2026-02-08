import Badge from "@/components/badge/Badge";
import IconButton from "@/components/buttons/IconButton";
import PageBreadCrumb, {
  BreadcrumbItem,
} from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableData from "@/components/tables/TableData";
import TableHead from "@/components/tables/TableHead";
import { SYSTEMACCESS } from "@/enums/systemAccess";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { medicalRecordService } from "@/services/medicalRecordService";
import { formatDate } from "@/utilities/helpers";
import { useAuthStore } from "@/zustand/authStore";
import {  Eye, NotebookIcon, NotebookPen } from "lucide-react";
import { useNavigate } from "react-router";

const AllMedCertRequest = () => {
  const { systemAccess } = useAuthStore();
  const navigate = useNavigate();
  const paginated = usePaginatedTable({
    fetchFunction: medicalRecordService.GetMedicalRequestRecordsPaginated,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Medical Certificate Requests", href: "/all-products" },
  ];

  return (
    <div>
      <div>
        <PageMeta
          title="CMS | All Medical Request Certificates"
          description="CMS |  All Medical Records"
        />

        <PageBreadCrumb
          title="MEDICAL REQUEST CERTIFICATES"
          items={breadcrumbItems}
          showHome={false}
        />

        <PaginatedTable title="BRAND" usePaginated={paginated}>
          <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
            <tr>
              {[
                "ID",
                "Requested By",
                "Reference No",
                "Created At",
                "Status",
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
                <TableData label="ID">{item.Id}</TableData>
                <TableData label="Created By">{item.FullName}</TableData>
                <TableData label="Reference No">{item.ReferenceNo}</TableData>
                <TableData label="Created At">
                  {formatDate(item.CreatedAt)}
                </TableData>
                <TableData label="Created At">
                  <Badge color={item.IsDone ? "success" : "warning"}>
                    {!item.IsDone ? (
                        <>PENDING</>
                    ) : (
                        <>PROCESSED</>
                    )}
                  </Badge>
                </TableData>
                <TableData>
                  <IconButton
                    tooltipTitle={`VIEW MEDICAL DATA`}
                    addedClass="edit-icon bg-green-100 hover:bg-green-600 mr-2"
                    icon={() => <Eye size={15} />}
                    onClick={() => {
                      navigate(`/view-medical-records/${item.MedicalRecordId}`);
                    }}
                  />
                  {systemAccess?.includes(SYSTEMACCESS.CREATE_MEDICAL_CERT) &&
                    !item.IsDone && (
                      <IconButton
                        tooltipTitle={`CREATE CERTIFICATE`}
                        addedClass="payment-icon bg-green-100 hover:bg-green-600 mr-2"
                        icon={() => <NotebookPen size={15} />}
                        onClick={() => {
                          navigate(`/create-medical-cert/${item.Id}`);
                        }}
                      />
                    )}
                  {item.IsDone && (
                    <IconButton
                      tooltipTitle={`VIEW CERTIFICATE`}
                      addedClass="view-icon bg-green-100 hover:bg-green-600 mr-2"
                      icon={() => <NotebookIcon size={15} />}
                      onClick={() => {
                        navigate(
                          `/medical-certificate/view/${item.MedicalRecordId}`,
                        );
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

export default AllMedCertRequest;
