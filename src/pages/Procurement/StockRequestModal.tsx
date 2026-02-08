import Alert from "@/components/badge/Alert";
import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import Label from "@/components/form/Label";
import { SearchablePaginatedSelect } from "@/components/form/SeachablePaginatedSelect";
import Input from "@/components/input/InputField";
import TextArea from "@/components/input/TextArea";
import ContentLoading from "@/components/loadings/ContentLoading";
import { MainModal } from "@/components/modals/MainModal";
import SimpleTable from "@/components/tables/simpletable/SimpleTable";
import SimpleTableData from "@/components/tables/simpletable/SimpleTableData";
import SimpleTableHead from "@/components/tables/simpletable/SimpleTableHead";
import { ApprovalStatus, UOM } from "@/enums/commons";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { productService } from "@/services/productService";
import {
  CreateDeliveryProductsDTOP,
  SelectedProductDTO,
} from "@/types/productTypes";
import { formatCurrencyWithPesoSign, formatStatus } from "@/utilities/helpers";
import { Trash } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface StocksModalProps {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
  poId?: number;
}

const StockRequestModal = ({ isOpen, onClose, poId }: StocksModalProps) => {
  if (!isOpen) return;
  const paginated = usePaginatedTable({
    fetchFunction: productService.GetProductsPaginated,
  });
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [temporaryQuantity, setTemporaryQuantity] = useState<number>(0);
  const [submitLoading, setSubmitLoading] = useTransition();
  const [fetchPOLoading, setFetchPOLoading] = useTransition();

  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateDeliveryProductsDTOP>();

  useEffect(() => {
    if (!isOpen || !poId) return;
    const fetchPO = () => {
      setFetchPOLoading(async () => {
        const response = await productService.ViewSinglePO(poId);
        reset(response);
      });
    };

    fetchPO();
  }, [isOpen, poId]);

  const handleClose = () => {
    onClose(false);
  };

  const allAddedProducts = watch("SelectedProducts");
  const approvalStatus = watch("ApprovalStatus");
  const rejectReason = watch("RejectReason");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "SelectedProducts",
  });

  const onAddProducts = () => {
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }
    if (temporaryQuantity <= 0) {
      toast.error("Please add a quantity");
      return;
    }
    const selectedMasterProduct = paginated.tableValues.find(
      (prod) => prod.Id === selectedProductId,
    );
    append(
      new SelectedProductDTO({
        ProductId: selectedMasterProduct?.Id,
        Title: selectedMasterProduct?.Title,
        UOM: selectedMasterProduct?.UOM,
        Quantity: temporaryQuantity,
        AtCostPrice: 0,
      }),
    );

    setTemporaryQuantity(0);
    setSelectedProductId(null);
  };

  const onSubmit = (data: CreateDeliveryProductsDTOP) => {
    if (data.SelectedProducts.length === 0) {
      toast.error("Please select atleast 1 product");
      return;
    }

    // Check if all products have AtCostPrice
    const missingAtCost = data.SelectedProducts.some(
      (product) => !product.AtCostPrice || product.AtCostPrice <= 0,
    );

    if (missingAtCost && !poId) {
      toast.error("Please enter at cost price for all products");
      return;
    }

    setSubmitLoading(async () => {
      if (!poId) return;
      data.ApprovalStatus = ApprovalStatus.APPROVED;
      const response = await productService.UpdateRequestStock(data, poId);
      if (response) {
        onClose(true);
        reset();
      }
    });
  };

  // Calculate total summary
  const calculateTotal = () => {
    if (!allAddedProducts || allAddedProducts.length === 0) return 0;

    return allAddedProducts.reduce((total, product) => {
      const quantity = product.Quantity || 0;
      const atCost = product.AtCostPrice || 0;
      return total + quantity * atCost;
    }, 0);
  };

  const headers =
    !poId || approvalStatus === ApprovalStatus.REJECTED
      ? ["Products", "UOM", "Quantity", "Total Receive"]
      : [
          "Products",
          "UOM",
          "Quantity",
          "At Cost Price per Qty",
          "Total",
          "Receive",
        ];

  return (
    <div>
      <MainModal
        title={!poId ? "REQUEST STOCKS" : "VIEW REQUESTED STOCKS"}
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-4xl"
      >
        <>
          <ContentLoading isLoading={fetchPOLoading} className="h-50">
            {(approvalStatus !== 0 && approvalStatus !== ApprovalStatus.RECEIVED) && (
              <Alert
                variant={
                  approvalStatus === ApprovalStatus.APPROVED
                    ? "approved"
                    : "reject"
                }
                className="mb-4"
                title={
                  approvalStatus === ApprovalStatus.APPROVED
                    ? "Request Approved"
                    : "Request Rejected"
                }
                description={
                  approvalStatus === ApprovalStatus.APPROVED
                    ? "Your stock request has been processed."
                    : rejectReason
                }
              />
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <Label
                  htmlFor="findings"
                  className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  Notes (optional)
                </Label>
                <Controller
                  control={control}
                  name="Notes"
                  render={({ field, fieldState }) => (
                    <>
                      <TextArea
                        placeholder="Enter your notes here"
                        {...field}
                        value={field.value ?? ""}
                        readonly={poId ? true : false}
                        className={`
                          min-h-24 resize-none border-slate-200 focus:border-sky-500 focus:ring-sky-500
                          ${
                            fieldState.error
                              ? "border-red-500"
                              : "border-gray-300"
                          }
                      `}
                        rows={4}
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              {!poId && (
                <div className="flex items-center w-full gap-3">
                  <SearchablePaginatedSelect
                    tableValues={paginated.tableValues.filter(
                      (p) =>
                        !allAddedProducts?.some((ap) => ap.ProductId === p.Id),
                    )}
                    currentPage={paginated.currentPage}
                    totalPages={paginated.totalPages}
                    isLoading={paginated.isLoading}
                    onPageChange={paginated.onPageChange}
                    onSearchChange={(value) => {
                      paginated.handleSearchValueChange(value);
                    }}
                    allowClear
                    getOptionLabel={(p) =>
                      `${p.Title}  (${formatStatus(UOM[p.UOM])})`
                    }
                    getOptionValue={(p) => p.Id}
                    value={selectedProductId}
                    onChange={setSelectedProductId}
                  />
                  <div className="w-1/2">
                    <Input
                      isQty
                      type="number"
                      placeholder="Add Quantity"
                      value={temporaryQuantity}
                      onChange={(e) =>
                        setTemporaryQuantity(Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <Button size="sm" type="button" onClick={onAddProducts}>
                      ADD
                    </Button>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <SimpleTable tableLoading={false}>
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      {headers.map((title, i) => (
                        <SimpleTableHead key={i}>{title}</SimpleTableHead>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {fields.length > 0 ? (
                      fields?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <SimpleTableData>{item.Title}</SimpleTableData>
                            <SimpleTableData>
                              {poId && <>{item.PkgQty} / </>}
                              {formatStatus(UOM[item.UOM])}
                            </SimpleTableData>
                            <SimpleTableData>
                              <div className="max-w-[100px]">
                                {!poId ? (
                                  <Input
                                    isQty
                                    className="w-full"
                                    type="number"
                                    {...register(
                                      `SelectedProducts.${index}.Quantity`,
                                      {
                                        valueAsNumber: true,
                                        required: "Quantity is required",
                                        min: {
                                          value: 1,
                                          message:
                                            "Quantity must be at least 1",
                                        },
                                      },
                                    )}
                                  />
                                ) : (
                                  <>{item.Quantity}</>
                                )}
                              </div>
                            </SimpleTableData>
                            {approvalStatus !== ApprovalStatus.REJECTED && (
                              <>
                                <SimpleTableData>
                                  <div className="max-w-[150px]">
                                    {!approvalStatus ? (
                                      <>
                                        <Input
                                          isPeso
                                          className="w-full"
                                          type="number"
                                          step="0.01"
                                          placeholder="0.00"
                                          {...register(
                                            `SelectedProducts.${index}.AtCostPrice`,
                                            {
                                              valueAsNumber: true,
                                              required:
                                                "At cost price is required",
                                              min: {
                                                value: 0.01,
                                                message:
                                                  "Price must be greater than 0",
                                              },
                                            },
                                          )}
                                        />
                                        {errors.SelectedProducts?.[index]
                                          ?.AtCostPrice && (
                                          <p className="text-red-500 text-xs mt-1">
                                            {
                                              errors.SelectedProducts[index]
                                                ?.AtCostPrice?.message
                                            }
                                          </p>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        {formatCurrencyWithPesoSign(
                                          item.AtCostPrice,
                                        )}
                                      </>
                                    )}
                                  </div>
                                </SimpleTableData>
                                <SimpleTableData>
                                  <div className="max-w-[120px]">
                                    {formatCurrencyWithPesoSign(
                                      (watch(
                                        `SelectedProducts.${index}.Quantity`,
                                      ) || 0) *
                                        (watch(
                                          `SelectedProducts.${index}.AtCostPrice`,
                                        ) || 0),
                                    )}
                                  </div>
                                </SimpleTableData>
                              </>
                            )}

                            {!poId && (
                              <SimpleTableData>
                                <IconButton
                                  tooltipTitle="REMOVE"
                                  addedClass="reject-icon mr-2"
                                  icon={() => <Trash size={15} />}
                                  onClick={() => remove(index)}
                                />
                              </SimpleTableData>
                            )}
                            {poId && (
                              <SimpleTableData>
                                + {item.Receive}
                              </SimpleTableData>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <SimpleTableData tdClass="text-center" colSpan={6}>
                          No items added
                        </SimpleTableData>
                      </tr>
                    )}
                  </tbody>
                </SimpleTable>
              </div>

              {/* Summary Section */}
              {fields.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-end">
                    <div className="w-full max-w-xs">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-base font-bold text-gray-900">
                          Total At Cost:
                        </span>
                        <span className="text-lg font-bold text-sky-600">
                          {formatCurrencyWithPesoSign(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-1.5 justify-end mt-4">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  {poId ? <>Close</> : <>Cancel</>}
                </Button>
                {!approvalStatus && (
                  <Button
                    size="sm"
                    type="submit"
                    disabled={submitLoading}
                    isLoading={submitLoading}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </form>
          </ContentLoading>
        </>
      </MainModal>
    </div>
  );
};

export default StockRequestModal;
