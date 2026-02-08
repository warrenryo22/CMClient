import { Plus } from "lucide-react";
import { Button } from "../../components/buttons/ReusableButton";
import PageBreadCrumb, {
  BreadcrumbItem,
} from "../../components/common/PageBreadCrumb";
import UserModal from "./UserModal";
import { useModal } from "@/hooks/useModal";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableHead from "@/components/tables/TableHead";
import TableData from "@/components/tables/TableData";
import { UserRoles } from "@/enums/commons";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { userManagementService } from "@/services/userManagementService";
import ActivationButton from "@/components/buttons/ActivationButton";
import { GetUsersDTO } from "@/types/userManagementTypes";
import { useState } from "react";
import ApprovalModal from "@/components/modals/ApprovalModal";
import PageMeta from "@/components/common/PageMeta";

const AllUsers = () => {
  const userModal = useModal();
  const toggleModal = useModal();

  const [selectedData, setSelectedData] = useState<GetUsersDTO | null>(null);

  const paginated = usePaginatedTable({
    fetchFunction: userManagementService.GetUserPaginated,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Users", href: "/all-users" },
  ];

  const handleCloseUserModal = (isSuccess: boolean) => {
    userModal.closeModal();
    if (isSuccess) {
      paginated.refresh();
    }
  };

  const handleToggleActivation = (data: GetUsersDTO) => {
    setSelectedData(data);
    toggleModal.openModal();
  };

  const handleToggleUserActivationClose = async (status: boolean) => {
    toggleModal.closeModal();

    if (status) {
      if (!selectedData) return;

      const response = await userManagementService.enableDisableUser(
        selectedData.Id,
      );

      if (response) {
        paginated.refresh();
      }
    }
  };

  return (
    <div>
      <div>
        <PageMeta title="CMS | All Users" description="CMS |  All Users" />
      </div>
      {userModal.isOpen && (
        <UserModal isOpen={userModal.isOpen} onClose={handleCloseUserModal} />
      )}
      {toggleModal.isOpen && (
        <ApprovalModal
          isOpen={toggleModal.isOpen}
          title="TOGGLE ACTIVATION"
          description={`Are you sure you want to ${
            selectedData?.Active ? "Disable" : "Enable"
          } this account?`}
          onClose={handleToggleUserActivationClose}
        />
      )}
      <PageBreadCrumb
        title="USER MANAGEMENT"
        items={breadcrumbItems}
        showHome={false}
        buttonChilren={
          <Button
            variant="primary"
            onClick={() => {
              userModal.openModal();
            }}
            leftIcon={<Plus size={15} />}
          >
            Add User
          </Button>
        }
      />

      <PaginatedTable title="BRAND" usePaginated={paginated}>
        <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
          <tr>
            {["Name", "Email", "Role", "Action"].map((title, i) => (
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
              <TableData label="Name" highlight>
                {item.FullName}
              </TableData>
              <TableData label="Email">{item.Email}</TableData>
              <TableData label="Role">{UserRoles[item.Role]}</TableData>
              <TableData>
                <ActivationButton
                  item={item}
                  isActive={item.Active}
                  onToggle={handleToggleActivation}
                />
              </TableData>
            </tr>
          ))}
        </tbody>
      </PaginatedTable>
    </div>
  );
};

export default AllUsers;
