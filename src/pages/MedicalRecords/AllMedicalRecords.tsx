import IconButton from "@/components/buttons/IconButton";
import PageBreadCrumb, {
  BreadcrumbItem,
} from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableData from "@/components/tables/TableData";
import TableHead from "@/components/tables/TableHead";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { medicalRecordService } from "@/services/medicalRecordService";
import { formatDate } from "@/utilities/helpers";
import { Eye,  } from "lucide-react";
import { useNavigate } from "react-router";

const AllMedicalRecords = () => {
  const navigate = useNavigate();
  const paginated = usePaginatedTable({
    fetchFunction: medicalRecordService.GetMedicalRecordsPaginated,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Products", href: "/all-products" },
  ];

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

        <PaginatedTable title="BRAND" usePaginated={paginated}>
          <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
            <tr>
              {[
                "ID",
                "Full Name",
                "Created By",
                "Reference No",
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
                <TableData label="ID">{item.Id}</TableData>
                <TableData label="Full Name" highlight>
                  {item.FullName}
                </TableData>
                <TableData label="Created By">{item.CreatedBy}</TableData>
                <TableData label="Reference No">{item.ReferenceNo}</TableData>
                <TableData label="Created At">{formatDate(item.CreatedAt)}</TableData>
                <TableData>
                  <IconButton
                    tooltipTitle={`VIEW MEDICAL DATA`}
                    addedClass="edit-icon bg-green-100 hover:bg-green-600 mr-2"
                    icon={() => <Eye size={15} />}
                    onClick={() => {
                      navigate(`/view-medical-records/${item.Id}`);
                    }}
                  />
                </TableData>
              </tr>
            ))}
          </tbody>
        </PaginatedTable>
      </div>
    </div>
  );
};

export default AllMedicalRecords;
