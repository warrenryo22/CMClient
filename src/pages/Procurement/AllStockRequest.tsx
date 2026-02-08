import Badge from "@/components/badge/Badge";
import IconButton from "@/components/buttons/IconButton";
import PageBreadCrumb, {
  BreadcrumbItem,
} from "@/components/common/PageBreadCrumb";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableData from "@/components/tables/TableData";
import TableHead from "@/components/tables/TableHead";
import { ApprovalStatus } from "@/enums/commons";
import { useModal } from "@/hooks/useModal";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { productService } from "@/services/productService";
import {
  formatDate,
  formatStatus,
  getBadgeApprovalStatusColor,
} from "@/utilities/helpers";
import { Check, Eye, X } from "lucide-react";
import { useState } from "react";
import StockRequestModal from "./StockRequestModal";
import RejectReasonModal from "@/components/modals/RejectReasonModal";
import { CreateDeliveryProductsDTOP } from "@/types/productTypes";

const AllStockRequest = () => {
  const stockModal = useModal();
  const rejectReasonModal = useModal();

  const [rejectReason, setRejectReason] = useState<string | undefined>(
    undefined,
  );
  const [selectedPO, setSelectedPO] = useState<number | undefined>(undefined);

  const paginated = usePaginatedTable({
    fetchFunction: productService.GetRequestStocksPaginated,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Stocks", href: "/stocks" },
  ];

  const handleCloseModal = (isSuccess: boolean) => {
    if (isSuccess) {
      paginated.refresh();
    }
    stockModal.closeModal();
    setSelectedPO(undefined);
  };

  const rejectClose = async (isSuccess: boolean) => {
    if (isSuccess) {
      const data = new CreateDeliveryProductsDTOP({
        ApprovalStatus: ApprovalStatus.REJECTED,
        RejectReason: rejectReason,
      });
      if (!selectedPO) return;
      const response = await productService.UpdateRequestStock(
        data,
        selectedPO,
      );

      if (response) {
        paginated.refresh();
        setSelectedPO(undefined);
      }
    }
    rejectReasonModal.closeModal();
  };
  return (
    <div>
      <StockRequestModal
        isOpen={stockModal.isOpen}
        onClose={handleCloseModal}
        poId={selectedPO}
      />

      <RejectReasonModal
        isOpen={rejectReasonModal.isOpen}
        reason={rejectReason}
        setReason={setRejectReason}
        onClose={rejectClose}
      />

      <PageBreadCrumb
        title="MANAGE STOCKS"
        items={breadcrumbItems}
        showHome={false}
      />

      <PaginatedTable title="BRAND" usePaginated={paginated}>
        <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
          <tr>
            {[
              "ID",
              "Created By",
              "Date Created",
              "Total Items",
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
              <TableData label="Created By" highlight>
                {item.CreatedBy}
              </TableData>
              <TableData label="Date Created">
                {formatDate(item.DateCreated)}
              </TableData>
              <TableData label="Total Items">{item.TotalItems}</TableData>
              <TableData label="Status">
                <Badge color={getBadgeApprovalStatusColor(item.ApprovalStatus)}>
                  {formatStatus(ApprovalStatus[item.ApprovalStatus])}
                </Badge>
              </TableData>
              <TableData>
                {(item.ApprovalStatus !== ApprovalStatus.APPROVED && item.ApprovalStatus !== ApprovalStatus.REJECTED)? (
                  <>
                    <IconButton
                      tooltipTitle={`APPROVE REQUEST`}
                      addedClass="edit-icon mr-2"
                      icon={() => <Check size={15} />}
                      onClick={() => {
                        setSelectedPO(item.Id);
                        stockModal.openModal();
                      }}
                    />
                    <IconButton
                      tooltipTitle={`REJECT REQUEST`}
                      addedClass="reject-icon mr-2"
                      icon={() => <X size={15} />}
                      onClick={() => {
                        setSelectedPO(item.Id);
                        rejectReasonModal.openModal();
                      }}
                    />
                  </>
                ) : (
                  <IconButton
                    tooltipTitle={`VIEW REQUEST`}
                    addedClass="view-icon mr-2"
                    icon={() => <Eye size={15} />}
                    onClick={() => {
                      setSelectedPO(item.Id);
                      stockModal.openModal();
                    }}
                  />
                )}
              </TableData>
            </tr>
          ))}
        </tbody>
      </PaginatedTable>
    </div>
  );
};

export default AllStockRequest;
