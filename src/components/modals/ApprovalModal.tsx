import React from "react";
import { MainModal } from "./MainModal";
import ApprovalHeader from "./ApprovalHeader";
import Button from "../buttons/Button";


interface ApprovalModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  buttonLoading?: boolean;
  onClose: (success: boolean) => void;
  buttonSubmitTitle?: string;
  buttonCancelTitle?: string;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  title = "Approve Action",
  description = "Are you sure you want to approve this action?",
  onClose,
  buttonLoading = false,
  buttonSubmitTitle = "Submit",
  buttonCancelTitle = "Cancel"
}) => {
  const handleClose = (status: boolean) => {
    onClose(status);
  };

  return (
    <MainModal
      isOpen={isOpen}
      onClose={() => handleClose(false)}
      className="max-w-md"
    >
      <ApprovalHeader title={title} />
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-5">
        {description}
      </p>
      <div className="flex justify-end gap-3 mt-8 text-center">
        <Button
          variant="outline"
          onClick={() => handleClose(false)}
          size="sm"
          type="button"
        >
          {buttonCancelTitle}
        </Button>
        <Button
          size="sm"
          isLoading={buttonLoading}
          type="submit"
          onClick={() => handleClose(true)}
        >
          {buttonSubmitTitle}
        </Button>
      </div>
    </MainModal>
  );
};

export default ApprovalModal;
