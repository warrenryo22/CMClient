import Label from "../form/Label";
import TextArea from "../input/TextArea";
import { MainModal } from "./MainModal";
import Button from "../buttons/Button";
import toast from "react-hot-toast";
import ApprovalModal from "./ApprovalModal";
import { useModal } from "@/hooks/useModal";

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
  isLoading?: boolean;
  readonly?: boolean;
  setReason?: (reason?: string) => void;
  reason?: string;
}

const RejectReasonModal = ({
  isOpen,
  onClose,
  isLoading,
  readonly = false,
  reason, 
  setReason
}: RejectReasonModalProps) => {
  const approvalModal = useModal();

  const handleModalClose = () => {
    onClose(false);
  };

  const handleSubmit = (isSuccess: boolean) => {
    if (isSuccess && !readonly) {
      onClose(true);
    }
    approvalModal.closeModal();
  };

  return (
    <div>
      <MainModal
        isOpen={isOpen}
        onClose={() => handleModalClose()}
        className="max-w-xl"
      >
        <ApprovalModal
          isOpen={approvalModal.isOpen}
          onClose={handleSubmit}
          title="CONFIRM SUBMIT"
          description="Are you sure you want to proceed reassign?"
        />
        <Label>Reason</Label>
        <TextArea readonly={readonly} value={reason} onChange={setReason} />
        <div className="flex gap-1.5 justify-end mt-5">
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={handleModalClose}
          >
            Cancel
          </Button>
          {!readonly && (
            <Button
              size="sm"
              type="button"
              onClick={() => {
                if (!reason || reason.trim().length === 0) {
                  toast.error("Please state your reason");
                  return;
                }
                approvalModal.openModal();
              }}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Submit
            </Button>
          )}
        </div>
      </MainModal>
    </div>
  );
};

export default RejectReasonModal;
