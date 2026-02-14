import Button from "@/components/buttons/Button";
import PageBreadCrumb, {
  BreadcrumbItem,
} from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { Pen, Plus } from "lucide-react";
import HospitalModal from "./HospitalModal";
import { useModal } from "@/hooks/useModal";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { medicalRecordService } from "@/services/medicalRecordService";
import PaginatedTable from "@/components/tables/PaginatedTable";
import TableHead from "@/components/tables/TableHead";
import TableData from "@/components/tables/TableData";
import IconButton from "@/components/buttons/IconButton";
import { useState } from "react";
import { CreateHospitalDTO } from "@/types/medicalRecordsType";

const AllHospitals = () => {
  const hospitalModal = useModal();
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Hospitals", href: "/all-hospitals" },
  ];
  const [selectedHospitalId, setSelectedHospitalId] = useState<CreateHospitalDTO | null>(null);

  const paginated = usePaginatedTable({
    fetchFunction: medicalRecordService.GetAllHospitalsPaginated,
  });

  const handleClose = (isSuccess: boolean) => {
    if (isSuccess) {
      paginated.refresh();
    }
    setSelectedHospitalId(null);
    hospitalModal.closeModal();
  };
  return (
    <div>
      <PageMeta
        title="CMS | All Hospitals"
        description="CMS |  All Hospitals"
      />
      <HospitalModal isOpen={hospitalModal.isOpen} onClose={handleClose} hospitalId={selectedHospitalId} />

      <PageBreadCrumb
        title="HOSPITALS"
        items={breadcrumbItems}
        showHome={false}
        buttonChilren={
          <Button
            variant="primary"
            onClick={() => {
              hospitalModal.openModal();
            }}
            startIcon={<Plus size={15} />}
          >
            Add Hospital
          </Button>
        }
      />

      <PaginatedTable title="BRAND" usePaginated={paginated}>
        <thead className="bg-sky-600 dark:bg-unicorp-blue/50">
          <tr>
            {["Name", "Address", "Contact Number", "Action"].map((title, i) => (
              <TableHead key={i}>{title}</TableHead>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.tableValues.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-colors duration-50 text-[12.5px] text-center border-2 border-gray-200 dark:border-gray-800"
            >
              <TableData label="Title" highlight>
                {item.name}
              </TableData>
              <TableData label="Address">{item.address}</TableData>
              <TableData label="Contact Number">{item.contactNumber}</TableData>
              <TableData>
                <IconButton
                  tooltipTitle={`EDIT ${item.name.toUpperCase()}`}
                  addedClass="edit-icon bg-green-100 hover:bg-green-600 mr-2"
                  icon={() => <Pen size={15} />}
                  onClick={() => {
                    hospitalModal.openModal();
                    setSelectedHospitalId(item);
                  }}
                />
              </TableData>
            </tr>
          ))}
        </tbody>
      </PaginatedTable>
    </div>
  );
};

export default AllHospitals;
