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
import { UOM } from "@/enums/commons";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { productService } from "@/services/productService";
import {
  CreateDeliveryProductsDTOP,
  SelectedProductDTO,
} from "@/types/productTypes";
import { formatStatus } from "@/utilities/helpers";
import { Trash } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface StocksModalProps {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
  poId?: number;
}

const StocksModal = ({ isOpen, onClose, poId }: StocksModalProps) => {
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

  const {  watch, handleSubmit, control, reset, setValue } =
    useForm<CreateDeliveryProductsDTOP>();

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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "SelectedProducts",
  });

  // Calculate receive value based on quantity and packaging quantity
  const calculateReceive = (quantity: number, pkgQty: number) => {
    if (!quantity || !pkgQty || pkgQty === 0) return 0;
    return quantity * pkgQty;
  };

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

    const receive = calculateReceive(
      temporaryQuantity,
      selectedMasterProduct?.PackagingQty || 0,
    );

    append(
      new SelectedProductDTO({
        ProductId: selectedMasterProduct?.Id,
        Title: selectedMasterProduct?.Title,
        UOM: selectedMasterProduct?.UOM,
        Quantity: temporaryQuantity,
        PkgQty: selectedMasterProduct?.PackagingQty,
        Receive: receive,
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
    setSubmitLoading(async () => {
      const response = await productService.RequestStocks(data);
      if (response) {
        onClose(true);
        reset();
      }
    });
  };

  const headers = !poId
    ? ["Products", "UOM", "Quantity", "Receive Stock", " "]
    : ["Products", "UOM", "Quantity", "Receive Stock"];
  return (
    <div>
      <MainModal
        title={!poId ? "REQUEST STOCKS" : "VIEW REQUESTED STOCKS"}
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-3xl"
      >
        <>
          <ContentLoading isLoading={fetchPOLoading} className="h-50">
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
                        !allAddedProducts.some((ap) => ap.ProductId === p.Id),
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
                              <>{item.PkgQty} / </>
                              {formatStatus(UOM[item.UOM])}
                            </SimpleTableData>
                            <SimpleTableData>
                              <div className="max-w-[150px]">
                                {!poId ? (
                                  <Controller
                                    control={control}
                                    name={`SelectedProducts.${index}.Quantity`}
                                    render={({ field }) => (
                                      <Input
                                        isQty
                                        className="w-full"
                                        type="number"
                                        value={field.value || 0}
                                        onChange={(e) => {
                                          const newQty = Number(e.target.value);
                                          field.onChange(newQty);
                                          const newReceive = calculateReceive(
                                            newQty,
                                            item.PkgQty,
                                          );
                                          setValue(
                                            `SelectedProducts.${index}.Receive`,
                                            newReceive,
                                          );
                                        }}
                                      />
                                    )}
                                  />
                                ) : (
                                  <>{item.Quantity}</>
                                )}
                              </div>
                            </SimpleTableData>
                            <SimpleTableData>
                              + {watch(`SelectedProducts.${index}.Receive`) || 0}
                            </SimpleTableData>
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
              <div className="flex gap-1.5 justify-end mt-4">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  {poId ? <>Close</> : <>Cancel</>}
                </Button>
                {!poId && (
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

export default StocksModal;
