import { useRef, useState } from 'react';
import { MainModal } from '@/components/modals/MainModal';
import Button from '@/components/buttons/Button';
import SignatureCanvas from 'react-signature-canvas';
import { Check, RotateCcw, X } from 'lucide-react';

interface ESignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureFile: File) => void;
  doctorName: string;
}

const ESignatureModal = ({ isOpen, onClose, onSave, doctorName}: ESignatureModalProps) => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Helper function to convert base64 to File
  const base64ToFile = (base64String: string, filename: string): File => {
    // Split the base64 string to get the mime type and data
    const arr = base64String.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsEmpty(true);
    }
  };

  const handleSave = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      // Use toDataURL() directly instead of getTrimmedCanvas()
      const dataUrl = signatureRef.current.toDataURL('image/png');
      
      // Convert base64 to File
      const timestamp = new Date().getTime();
      const filename = `signature_${doctorName.replace(/\s+/g, '_')}_${timestamp}.png`;
      const signatureFile = base64ToFile(dataUrl, filename);
      
      onSave(signatureFile);
      onClose();
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
  };

  const handleCancel = () => {
    handleClear();
    onClose();
  };

  return (
    <MainModal isOpen={isOpen} onClose={handleCancel} className="max-w-3xl">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Electronic Signature
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please sign below to certify this medical certificate
          </p>
        </div>

        {/* Signature Pad */}
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: 'w-full h-64 cursor-crosshair',
              style: { width: '100%', height: '256px' },
            }}
            backgroundColor="white"
            penColor="black"
            onBegin={handleBegin}
          />
        </div>

        {/* Doctor Name Display */}
        <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Signing as:</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{doctorName}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleClear}
            startIcon={<RotateCcw className="w-4 h-4" />}
            disabled={isEmpty}
          >
            Clear
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            startIcon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isEmpty}
            startIcon={<Check className="w-4 h-4" />}
          >
            Save Signature
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Instructions:</strong> Draw your signature in the box above using your mouse or touchpad.
            The signature will be saved as a PNG image for the medical certificate.
          </p>
        </div>
      </div>
    </MainModal>
  );
};

export default ESignatureModal;