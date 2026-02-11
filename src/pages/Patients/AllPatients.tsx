import PageBreadCrumb, {
  BreadcrumbItem,
} from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableHead from "@/components/tables/TableHead";
import TableData from "@/components/tables/TableData";
import IconButton from "@/components/buttons/IconButton";
import { userManagementService } from "@/services/userManagementService";
import { Eye } from "lucide-react";
import { formatDate, formatStatus } from "@/utilities/helpers";
import { UserRoles } from "@/enums/commons";
import { useNavigate } from "react-router";

const AllPatients = () => {
  const navigate = useNavigate();

  const paginated = usePaginatedTable({
    fetchFunction: userManagementService.GetAllPatientsPaginated,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Products", href: "/all-products" },
  ];

  return (
    <div>
      <div>
        <PageMeta
          title="CMS | All Products"
          description="CMS |  All Products"
        />

        <PageBreadCrumb
          title="ALL PATIENTS"
          items={breadcrumbItems}
          showHome={false}
        />

        <PaginatedTable title="BRAND" usePaginated={paginated}>
          <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
            <tr>
              {[
                "Full Name",
                "Birth Date",
                "Role",
                "Patient Type",
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
                <TableData label="Full Name" highlight>
                  {item.FullName}
                </TableData>
                <TableData label="Birth Date">
                  {formatDate(item.Birthdate)}
                </TableData>
                <TableData label="Role">
                  {formatStatus(UserRoles[item.Role || UserRoles.VISITOR])}
                </TableData>
                <TableData label="Patient Type">{item.PatientType}</TableData>
                <TableData>
                  <IconButton
                    tooltipTitle={`VIEW PATIENT`}
                    addedClass="view-icon bg-green-100 hover:bg-green-600 mr-2"
                    icon={() => <Eye size={15} />}
                    onClick={() => {
                      const isWalkin = item.PatientType === "WALKIN PATIENT";
                      const id = isWalkin ? item.WalkinId : item.Id;

                      navigate(`/user-profile/${id}?is_walkin=${isWalkin}`);
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

export default AllPatients;
