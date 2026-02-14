import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/Card";
import Label from "@/components/form/Label";
import Input from "@/components/input/InputField";
import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import { Pill, Users, Trash, ShoppingBag } from "lucide-react";
import { formatStatus } from "@/utilities/helpers";
import { UOM, UserRoles } from "@/enums/commons";
import { GetProductPaginatedDTO } from "@/types/productTypes";
import { StaffDTO } from "@/pages/UserProfile/types";
import { userManagementService } from "@/services/userManagementService";
import { productService } from "@/services/productService";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { SearchablePaginatedSelect } from "@/components/form/SeachablePaginatedSelect";
import { MedicationDTO } from "@/types/emergencyCaseV2Types";

interface TreatmentFormProps {
  medications: MedicationDTO[];
  assignedStaff: StaffDTO[];
  onMedicationsChange: (medications: MedicationDTO[]) => void;
  onAssignedStaffChange: (staff: StaffDTO[]) => void;
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({
  medications,
  assignedStaff,
  onMedicationsChange,
  onAssignedStaffChange,
}) => {
  const [staff, setStaff] = useState<StaffDTO[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<GetProductPaginatedDTO | null>(null);
  const [temporaryQuantity, setTemporaryQuantity] = useState<number>(0);
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);

  const paginated = usePaginatedTable({
    fetchFunction: productService.GetProductsPaginated,
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    const response = await userManagementService.GetAllStaff();
    setStaff(response);
  };

  const addMedication = (product: GetProductPaginatedDTO, quantity: number) => {
    const newMedication: MedicationDTO = {
      id: Date.now().toString(),
      productId: product.Id,
      productName: product.Title,
      quantity,
      notes: "",
    };

    onMedicationsChange([...medications, newMedication]);
  };

  const removeMedication = (id: string) => {
    onMedicationsChange(medications.filter((m) => m.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    const updated = medications.map((m) =>
      m.id === id ? { ...m, quantity } : m,
    );
    onMedicationsChange(updated);
  };

  const onAddProducts = () => {
    if (!selectedProduct || temporaryQuantity <= 0) return;

    addMedication(selectedProduct, temporaryQuantity);

    setTemporaryQuantity(0);
    setSelectedProduct(null);
    setAvailableQuantity(0);
  };

  const toggleStaff = (member: StaffDTO) => {
    const exists = assignedStaff.some((s) => s.id === member.id);

    if (exists) {
      onAssignedStaffChange(assignedStaff.filter((s) => s.id !== member.id));
    } else {
      onAssignedStaffChange([...assignedStaff, member]);
    }
  };

  return (
    <div className="space-y-6">
      {/* PRODUCTS SECTION */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <Pill size={20} />
            Medications & Treatment
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <ShoppingBag className="h-4 w-4 text-slate-500" />
            Products
          </Label>

          {/* Search row */}
          <div className="flex items-center gap-3">
            <SearchablePaginatedSelect
              tableValues={paginated.tableValues.filter(
                (p) => !medications.some((m) => m.productId === p.Id),
              )}
              currentPage={paginated.currentPage}
              totalPages={paginated.totalPages}
              isLoading={paginated.isLoading}
              onPageChange={paginated.onPageChange}
              onSearchChange={paginated.handleSearchValueChange}
              allowClear
              getOptionLabel={(p) => `${p.Title} (${formatStatus(UOM[p.UOM])})`}
              getOptionValue={(p) => p}
              value={selectedProduct}
              onChange={(value) => {
                setSelectedProduct(value);
                setAvailableQuantity(value?.Quantity || 0);
              }}
            />

            <Input
              isReadOnly
              type="number"
              value={availableQuantity}
              placeholder="Available"
            />

            <Input
              type="number"
              value={temporaryQuantity}
              placeholder="Qty"
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < 1) setTemporaryQuantity(1);
                else if (val > availableQuantity)
                  setTemporaryQuantity(availableQuantity);
                else setTemporaryQuantity(val);
              }}
            />

            <Button size="sm" type="button" onClick={onAddProducts}>
              ADD
            </Button>
          </div>

          {/* Selected Products Table */}
          {medications.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="border rounded-lg p-3 bg-gray-50 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-sky-600">
                      {med.productName}
                    </div>
                    <IconButton
                      tooltipTitle="Remove"
                      addedClass="reject-icon mr-2"
                      icon={() => <Trash size={14} />}
                      onClick={() => removeMedication(med.id)}
                    />
                  </div>

                  <Input
                    isQty
                    type="number"
                    isReadOnly
                    min={1}
                    value={med.quantity}
                    onChange={(e) =>
                      updateQuantity(med.id, Number(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* STAFF SECTION */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <Users size={20} />
            Assigned Medical Staff
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {staff.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => toggleStaff(member)}
              className={`w-full flex gap-2 items-center p-3 rounded-lg border text-left ${
                assignedStaff.some((s) => s.id === member.id)
                  ? "border-sky-500 bg-sky-50"
                  : "border-gray-200"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-sm font-semibold">
                {member.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-xs text-gray-500">
                  {formatStatus(UserRoles[member.role])}
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentForm;
