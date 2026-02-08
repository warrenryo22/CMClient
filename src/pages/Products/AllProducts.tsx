import Button from "@/components/buttons/Button";
import PageBreadCrumb, {
  BreadcrumbItem,
} from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { useModal } from "@/hooks/useModal";
import { Pen, Plus } from "lucide-react";
import ProductsModal from "./ProductsModal";
import { useState } from "react";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { productService } from "@/services/productService";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableHead from "@/components/tables/TableHead";
import TableData from "@/components/tables/TableData";
import { formatStatus } from "@/utilities/helpers";
import { UOM } from "@/enums/commons";
import IconButton from "@/components/buttons/IconButton";

const AllProducts = () => {
  const productModal = useModal();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  const paginated = usePaginatedTable({
    fetchFunction: productService.GetProductsPaginated,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Products", href: "/all-products" },
  ];

  const handleProductModalClose = (isSuccess: boolean) => {
    if (isSuccess) {
      paginated.refresh();
    }
    productModal.closeModal();
    setSelectedProductId(null);
  };
  return (
    <div>
      <div>
        <PageMeta
          title="CMS | All Products"
          description="CMS |  All Products"
        />

        <ProductsModal
          isOpen={productModal.isOpen}
          onClose={handleProductModalClose}
          productId={selectedProductId}
        />

        <PageBreadCrumb
          title="PRODUCTS"
          items={breadcrumbItems}
          showHome={false}
          buttonChilren={
            <Button
              variant="primary"
              onClick={() => {
                productModal.openModal();
                setSelectedProductId(null);
              }}
              startIcon={<Plus size={15} />}
            >
              Add Product
            </Button>
          }
        />

        <PaginatedTable title="BRAND" usePaginated={paginated}>
          <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
            <tr>
              {["Title", "UOM", "Stocks", "Action"].map((title, i) => (
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
                <TableData label="Title" highlight>
                  {item.Title}
                </TableData>
                <TableData label="UOM">{formatStatus(UOM[item.UOM])}</TableData>
                <TableData label="Quantity">{item.Quantity}</TableData>
                <TableData>
                  <IconButton
                    tooltipTitle={`EDIT ${item.Title.toUpperCase()}`}
                    addedClass="edit-icon bg-green-100 hover:bg-green-600 mr-2"
                    icon={() => <Pen size={15} />}
                    onClick={() => {
                      productModal.openModal();
                      setSelectedProductId(item.Id);
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

export default AllProducts;
