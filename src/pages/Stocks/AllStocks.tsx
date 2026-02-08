import Button from "@/components/buttons/Button";
import PageBreadCrumb, {
  BreadcrumbItem,
} from "@/components/common/PageBreadCrumb";
import { useModal } from "@/hooks/useModal";
import { Eye, Plus, Truck } from "lucide-react";
import StocksModal from "./StocksModal";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableHead from "@/components/tables/TableHead";
import TableData from "@/components/tables/TableData";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { productService } from "@/services/productService";
import {
  formatDate,
  formatStatus,
  getBadgeApprovalStatusColor,
} from "@/utilities/helpers";
import Badge from "@/components/badge/Badge";
import { ApprovalStatus } from "@/enums/commons";
import IconButton from "@/components/buttons/IconButton";
import { useState, useTransition } from "react";
import StockRequestModal from "../Procurement/StockRequestModal";
import { GetRequestStocksDTO } from "@/types/productTypes";
import ApprovalModal from "@/components/modals/ApprovalModal";

const AllStocks = () => {
  const stockModal = useModal();
  const approvalModal = useModal();
  const [selectedPO, setSelectedPO] = useState<GetRequestStocksDTO | undefined>(
    undefined,
  );
  const [submitLoading, setSubmitLoading] = useTransition();

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

  const handleCloseApprovalModal = async (isSuccess: boolean) => {
    if (isSuccess) {
      setSubmitLoading(async () => {
        if (!selectedPO) return;
        const response = await productService.ReceiveDelivery(selectedPO?.Id);
        if (response) {
          paginated.refresh();
        }
      });
    }
    approvalModal.closeModal();
  };
  return (
    <div>
      {selectedPO?.ApprovalStatus !== ApprovalStatus.PENDING && selectedPO ? (
        <StockRequestModal
          isOpen={stockModal.isOpen}
          onClose={handleCloseModal}
          poId={selectedPO?.Id}
        />
      ) : (
        <StocksModal
          isOpen={stockModal.isOpen}
          onClose={handleCloseModal}
          poId={selectedPO?.Id}
        />
      )}

      <ApprovalModal
        isOpen={approvalModal.isOpen}
        title="Receive Delivery"
        buttonLoading={submitLoading}
        description="Are you sure you want to receive this delivery?"
        onClose={handleCloseApprovalModal}
      />
      <PageBreadCrumb
        title="MANAGE STOCKS"
        items={breadcrumbItems}
        showHome={false}
        buttonChilren={
          <Button
            variant="primary"
            onClick={() => {
              stockModal.openModal();
            }}
            startIcon={<Plus size={15} />}
          >
            Request Stocks
          </Button>
        }
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
                <IconButton
                  tooltipTitle={`VIEW REQUEST`}
                  addedClass="view-icon mr-2"
                  icon={() => <Eye size={15} />}
                  onClick={() => {
                    setSelectedPO(item);
                    stockModal.openModal();
                  }}
                />
                {item.ApprovalStatus === ApprovalStatus.APPROVED && (
                  <IconButton
                    tooltipTitle={`RECEIVE DELIVERY`}
                    addedClass="payment-icon mr-2"
                    icon={() => <Truck size={15} />}
                    onClick={() => {
                      setSelectedPO(item);
                      approvalModal.openModal();
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

export default AllStocks;
