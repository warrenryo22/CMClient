import Button from "@/components/buttons/Button";
import Label from "@/components/form/Label";
import SearchableSelect from "@/components/form/SearchableSelect";
import Input from "@/components/input/InputField";
import TextArea from "@/components/input/TextArea";
import ContentLoading from "@/components/loadings/ContentLoading";
import { MainModal } from "@/components/modals/MainModal";
import { UOM } from "@/enums/commons";
import { productService } from "@/services/productService";
import { CreateProductDTO } from "@/types/productTypes";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface ProductsModalProps {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
  productId: number | null;
}
const ProductsModal = ({ isOpen, onClose, productId }: ProductsModalProps) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { touchedFields, errors, isSubmitted },
  } = useForm<CreateProductDTO>();

  const handleClose = () => {
    onClose(false);
    reset(new CreateProductDTO());
  };

  const fetchSingleProduct = async () => {
    if (!productId) return;
    setIsLoading(true);
    const response = await productService.GetSingleProduct(productId);
    reset(response);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    if (productId) {
      fetchSingleProduct();
    } else {
      reset(new CreateProductDTO());
    }
  }, [isOpen]);

  const onSubmit = async (data: CreateProductDTO) => {
    setSubmitLoading(true);

    let response = null;

    if (productId) {
      response = await productService.UpdateProduct(productId, data);
    } else {
      response = await productService.CreateProduct(data);
    }
    if (response) {
      onClose(true);
      reset(new CreateProductDTO());
    }
    setSubmitLoading(false);
  };
  return (
    <div>
      <MainModal
        title="ADD PRODUCT"
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-lg"
      >
        <ContentLoading
          isLoading={isLoading}
          size={20}
          className="h-76"
          loadingContent="Loading..."
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter product title"
                {...register("Title", {
                  required: "Title is required",
                })}
                error={!!errors.Title}
                hint={
                  touchedFields.Title || isSubmitted
                    ? errors.Title?.message
                    : ""
                }
              />
            </div>
            <div className="mb-4">
              <Label
                htmlFor="findings"
                className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                Description
              </Label>
              <Controller
                control={control}
                name="Description"
                render={({ field, fieldState }) => (
                  <>
                    <TextArea
                      placeholder="Enter product description"
                      {...field}
                      value={field.value ?? ""}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Unit of Measurement</Label>
                <Controller
                  name="UOM"
                  control={control}
                  rules={{ required: "UOM is required" }}
                  render={({ field, fieldState }) => (
                    <SearchableSelect
                      placeholder="Select a UOM"
                      options={Object.entries(UOM)
                        .filter(([_, value]) => !isNaN(Number(value)))
                        .map(([key, value]) => ({
                          value: Number(value),
                          label: key.replace(/_/g, " "),
                        }))}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      className={fieldState.error ? "border-red-500" : ""}
                    />
                  )}
                />
                {touchedFields.UOM || isSubmitted ? (
                  <span className="mt-1 block text-xs text-red-500">
                    {errors.UOM?.message}
                  </span>
                ) : null}
              </div>
              <div>
                <Label className="flex items-center gap-2" htmlFor="amount">
                  Packaging Qty{" "}
                  {/* <Tooltip title="How many quantity that will add on your inventory on a delivery">
                    <InfoIcon className="text-red-500" size={14} />
                  </Tooltip> */}
                </Label>
                <Input
                  id="amount"
                  placeholder="Enter Reflenish Amount"
                  {...register("ReflenishAmount", {
                    required: "Reflenish Amount is required",
                  })}
                  type="number"
                  error={!!errors.Title}
                  hint={
                    touchedFields.Title || isSubmitted
                      ? errors.Title?.message
                      : ""
                  }
                />
              </div>
            </div>
            {/* <div>
            <Label className="flex items-center gap-2" htmlFor="atcost">
              At Cost{" "}
              <Tooltip title="How much you bought on specific product">
                <InfoIcon className="text-red-500" size={14} />
              </Tooltip>
            </Label>
            <Input
              id="atcost"
              placeholder="Enter At Cost"
              {...register("AtCost", {
                required: "At Cost is required",
              })}
              type="number"
              error={!!errors.Title}
              hint={
                touchedFields.Title || isSubmitted ? errors.Title?.message : ""
              }
            />
          </div> */}
            <div className="flex gap-1.5 justify-end mt-4">
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                disabled={submitLoading}
                isLoading={submitLoading}
              >
                Submit
              </Button>
            </div>
          </form>
        </ContentLoading>
      </MainModal>
    </div>
  );
};

export default ProductsModal;
