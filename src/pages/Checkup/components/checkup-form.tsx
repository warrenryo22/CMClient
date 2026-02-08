"use client";

import {
  ClipboardList,
  Activity,
  FileText,
  Pill,
  MessageSquare,
  RotateCcw,
  CheckCircle,
  Trash,
  ShoppingBag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/Card";
import Label from "@/components/form/Label";
import TextArea from "@/components/input/TextArea";
import Input from "@/components/input/InputField";
import Checkbox from "@/components/input/Checkbox";
import {
  AddVitalSignsDTO,
  CreateCheckupDetailsDTO,
  GetInitialMedicalRecordsDTO,
  ItemsProvided,
} from "@/types/medicalRecordsType";
import { ActionTaken, UOM } from "@/enums/commons";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Button from "@/components/buttons/Button";
import { useNavigate, useParams } from "react-router";
import SimpleTable from "@/components/tables/simpletable/SimpleTable";
import SimpleTableHead from "@/components/tables/simpletable/SimpleTableHead";
import SimpleTableData from "@/components/tables/simpletable/SimpleTableData";
import { formatStatus } from "@/utilities/helpers";
import IconButton from "@/components/buttons/IconButton";
import { SearchablePaginatedSelect } from "@/components/form/SeachablePaginatedSelect";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { productService } from "@/services/productService";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { GetProductPaginatedDTO } from "@/types/productTypes";
import { medicalRecordService } from "@/services/medicalRecordService";
import ContentLoading from "@/components/loadings/ContentLoading";

interface CheckupFormProps {
  initialData: GetInitialMedicalRecordsDTO | null;
}

export function CheckupForm({ initialData }: CheckupFormProps) {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [submitLoading, setSubmitLoadig] = useTransition();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    control,
    formState: { touchedFields, errors, isSubmitted },
  } = useForm({
    defaultValues: new CreateCheckupDetailsDTO({
      VitalSigns: new AddVitalSignsDTO({
        AppointmentId: Number(appointmentId),
        Height: initialData?.InitialVitalSign?.Height,
        Weight: initialData?.InitialVitalSign?.Weight,
        BloodPressure: initialData?.InitialVitalSign?.BloodPressure,
        PulseRate: initialData?.InitialVitalSign?.PulseRate,
        Temperature: initialData?.InitialVitalSign?.Temperature,
      }),
    }),
  });
  const [selectedProduct, setSelectedProduct] =
    useState<GetProductPaginatedDTO | null>(null);
  const [temporaryQuantity, setTemporaryQuantity] = useState<number>(0);
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);
  const selectedActions = watch("ActionTaken");
  const allAddedProducts = watch("ItemsProvided");
  const paginated = usePaginatedTable({
    fetchFunction: productService.GetProductsPaginated,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ItemsProvided",
  });

  const actionOptions = Object.values(ActionTaken)
    .filter((v) => typeof v === "number")
    .map((value) => ({
      value: value as ActionTaken,
      label: ActionTaken[value as number]
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));

  const toggleAction = (action: ActionTaken) => {
    const updated = selectedActions.includes(action)
      ? selectedActions.filter((a) => a !== action)
      : [...selectedActions, action];

    setValue("ActionTaken", updated);
  };

  const onSubmit = (data: CreateCheckupDetailsDTO) => {
    setSubmitLoadig(async () => {
      if (
        (selectedActions.includes(ActionTaken.MEDICATION_GIVEN) ||
          selectedActions.includes(ActionTaken.FIRST_AID)) &&
        data.ItemsProvided.length === 0
      ) {
        toast.error("Please provide at least 1 product");
        return;
      }
      data.UserDetailsId = initialData?.UserDetailsId;
      data.RecordId = initialData?.RecordId;
      data.WalkinId = initialData?.WalkinId;
      const response = await medicalRecordService.CreateMedicalRecords(data);
      if (response) {
        navigate("/today-appointments");
      }
    });
  };

  const handleCancel = () => {
    navigate("/today-appointments");
  };

  useEffect(() => {
    const hasMedication = selectedActions?.includes(
      ActionTaken.MEDICATION_GIVEN,
    );

    const hasFirstAid = selectedActions?.includes(ActionTaken.FIRST_AID);

    if (!hasMedication && !hasFirstAid) {
      setValue("ItemsProvided", []);

      setSelectedProduct(null);
      setTemporaryQuantity(0);
      setAvailableQuantity(0);
    }
  }, [selectedActions, setValue]);

  const tableHead = ["Product", "UOM", "Quantity", " "];

  const onAddProducts = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    if (temporaryQuantity <= 0) {
      toast.error("Please add a quantity");
      return;
    }

    append(
      new ItemsProvided({
        Product: selectedProduct,
        Quantity: temporaryQuantity,
      }),
    );

    setTemporaryQuantity(0);
    setSelectedProduct(null);
    setAvailableQuantity(0);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <ClipboardList className="h-5 w-5 text-sky-600" />
                Checkup Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Symptoms */}
              <div className="space-y-2">
                <Label
                  htmlFor="symptoms"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <FileText className="h-4 w-4 text-slate-500" />
                  Symptoms
                </Label>
                <Controller
                  control={control}
                  name="Symptoms"
                  render={({ field, fieldState }) => (
                    <>
                      <TextArea
                        placeholder="Describe the patient's symptoms..."
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

              <div className="space-y-3">
                <Label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Activity className="h-4 w-4 text-slate-500" />
                  Vital Signs
                </Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="temperature"
                      className="text-xs font-medium text-slate-500"
                    >
                      Temperature (°C)
                    </Label>
                    <Input
                      id="temperature"
                      placeholder="e.g., 37.5"
                      {...register("VitalSigns.Temperature", {
                        required: "Temperature is required",
                      })}
                      error={!!errors.VitalSigns?.Temperature}
                      hint={
                        touchedFields.VitalSigns?.Temperature || isSubmitted
                          ? errors.VitalSigns?.Temperature?.message
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="bloodPressure"
                      className="text-xs font-medium text-slate-500"
                    >
                      Blood Pressure
                    </Label>
                    <Input
                      id="bloodPressure"
                      placeholder="e.g., 120/80"
                      {...register("VitalSigns.BloodPressure", {
                        required: "Blood Pressure is required",
                      })}
                      error={!!errors.VitalSigns?.BloodPressure}
                      hint={
                        touchedFields.VitalSigns?.BloodPressure || isSubmitted
                          ? errors.VitalSigns?.BloodPressure?.message
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="pulseRate"
                      className="text-xs font-medium text-slate-500"
                    >
                      Pulse Rate (bpm)
                    </Label>
                    <Input
                      id="pulseRate"
                      placeholder="e.g., 72"
                      {...register("VitalSigns.PulseRate", {
                        required: "Pulse Rate is required",
                      })}
                      error={!!errors.VitalSigns?.PulseRate}
                      hint={
                        touchedFields.VitalSigns?.PulseRate || isSubmitted
                          ? errors.VitalSigns?.PulseRate?.message
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="pulseRate"
                      className="text-xs font-medium text-slate-500"
                    >
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      placeholder="e.g., 72"
                      {...register("VitalSigns.Height", {
                        required: "Height is required",
                      })}
                      error={!!errors.VitalSigns?.Height}
                      hint={
                        touchedFields.VitalSigns?.Height || isSubmitted
                          ? errors.VitalSigns?.Height?.message
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="pulseRate"
                      className="text-xs font-medium text-slate-500"
                    >
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      placeholder="e.g., 72"
                      {...register("VitalSigns.Weight", {
                        required: "Weight is required",
                      })}
                      error={!!errors.VitalSigns?.Weight}
                      hint={
                        touchedFields.VitalSigns?.Weight || isSubmitted
                          ? errors.VitalSigns?.Weight?.message
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="findings"
                  className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <FileText className="h-4 w-4 text-slate-500" />
                  Findings / Notes
                </Label>
                <Controller
                  control={control}
                  name="Findings"
                  render={({ field, fieldState }) => (
                    <>
                      <TextArea
                        placeholder="Document your findings and observations..."
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

              <div className="space-y-3">
                <Label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Pill className="h-4 w-4 text-slate-500" />
                  Action Taken
                </Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {actionOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50"
                    >
                      <Checkbox
                        id={option.label}
                        checked={selectedActions.includes(option.value)}
                        onChange={() => toggleAction(option.value)}
                      />
                      <Label
                        htmlFor={option.label}
                        className="cursor-pointer text-sm font-medium text-slate-700"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {(selectedActions.includes(ActionTaken.MEDICATION_GIVEN) ||
                selectedActions.includes(ActionTaken.FIRST_AID)) && (
                <>
                  <Label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <ShoppingBag className="h-4 w-4 text-slate-500" />
                    Products
                  </Label>
                  <div className="flex items-center w-full gap-3">
                    <SearchablePaginatedSelect
                      tableValues={paginated.tableValues.filter(
                        (p) =>
                          !allAddedProducts.some(
                            (ap) => ap.Product.Id === p.Id,
                          ),
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
                      getOptionValue={(p) => p}
                      value={selectedProduct}
                      onChange={(value) => {
                        setSelectedProduct(value);
                        setAvailableQuantity(value.Quantity);
                      }}
                    />
                    <div className="w-1/2">
                      <Input
                        isReadOnly
                        endIcon={<span className="text-xs">Available QTY</span>}
                        type="number"
                        placeholder="Add Quantity"
                        value={availableQuantity}
                      />
                    </div>
                    <div className="w-1/2">
                      <Input
                        isQty
                        type="number"
                        placeholder="Add Quantity"
                        value={temporaryQuantity}
                        onChange={(e) => {
                          const value = Number(e.target.value);

                          if (value < 0) {
                            setTemporaryQuantity(0);
                          } else if (value > availableQuantity) {
                            setTemporaryQuantity(availableQuantity);
                          } else {
                            setTemporaryQuantity(value);
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <Button size="sm" type="button" onClick={onAddProducts}>
                        ADD
                      </Button>
                    </div>
                  </div>
                  <SimpleTable tableLoading={false}>
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        {tableHead.map((title, i) => (
                          <SimpleTableHead key={i}>{title}</SimpleTableHead>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {fields.length > 0 ? (
                        fields?.map((item, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <SimpleTableData>
                                  {item.Product.Title}
                                </SimpleTableData>
                                <SimpleTableData>
                                  {formatStatus(UOM[item.Product.UOM])}
                                </SimpleTableData>
                                <SimpleTableData>
                                  <div className="max-w-[200px]">
                                    <Input
                                      className="w-full"
                                      type="number"
                                      {...register(
                                        `ItemsProvided.${index}.Quantity`,
                                        {
                                          valueAsNumber: true,
                                          validate: (value) =>
                                            value <= item.Product.Quantity ||
                                            `Only ${item.Product.Quantity} items available in stock`,
                                        },
                                      )}
                                    />
                                    {errors.ItemsProvided?.[index]
                                      ?.Quantity && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {
                                          errors.ItemsProvided[index].Quantity
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </div>
                                </SimpleTableData>
                                <SimpleTableData>
                                  <IconButton
                                    tooltipTitle="REMOVE"
                                    addedClass="reject-icon mr-2"
                                    icon={() => <Trash size={15} />}
                                    onClick={() => remove(index)}
                                  />
                                </SimpleTableData>
                              </tr>
                              <tr className="bg-gray-50">
                                <SimpleTableData colSpan={tableHead.length}>
                                  <div className="space-y-1">
                                    <Label className="text-xs text-slate-600">
                                      {item.Product.Title} Notes
                                    </Label>

                                    <Controller
                                      control={control}
                                      name={`ItemsProvided.${index}.Notes`}
                                      render={({ field, fieldState }) => (
                                        <>
                                          <TextArea
                                            placeholder={`Add notes for ${item.Product.Title} (e.g. dosage instructions, special handling)`}
                                            {...field}
                                            value={field.value ?? ""}
                                            rows={2}
                                            className={`
                           resize-none border-slate-200 focus:border-sky-500 focus:ring-sky-500
                          ${
                            fieldState.error
                              ? "border-red-500"
                              : "border-gray-300"
                          }
                      `}
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
                                </SimpleTableData>
                              </tr>
                            </>
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
                </>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="remarks"
                  className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                  Remarks
                </Label>
                <Controller
                  control={control}
                  name="Remarks"
                  render={({ field, fieldState }) => (
                    <>
                      <TextArea
                        placeholder="Add any additional remarks..."
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
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitLoading}
            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <ContentLoading
              isLoading={submitLoading}
              loadingContent="Loading..."
            >
              <CheckCircle className="h-4 w-4" />
              Finish Checkup
            </ContentLoading>
          </Button>
        </div>
      </form>
    </div>
  );
}
