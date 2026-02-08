import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  DragEvent,
  ChangeEvent,
} from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

interface UploadMutiImagesProps {
  existingUrls?: string[];
  onFilesSelected: (files: File[]) => void;
  onRemovedExistingUrls?: (urls: string[]) => void;
}

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  uploaded: boolean;
}

const UploadMultiImages: React.FC<UploadMutiImagesProps> = ({
  existingUrls = [],
  onFilesSelected,
  onRemovedExistingUrls,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [removedExistingUrls, setRemovedExistingUrls] = useState<string[]>([]);

  useEffect(() => {
    if (existingUrls.length > 0) {
      setPreviewUrls(existingUrls);
      setRemovedExistingUrls([]);
    }
  }, [existingUrls]);

  useEffect(() => {
    if (onRemovedExistingUrls) {
      onRemovedExistingUrls(removedExistingUrls);
    }
  }, [removedExistingUrls, onRemovedExistingUrls]);

  const processFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: UploadFile[] = [];
      const validFiles: File[] = [];
      const rejectedMessages: string[] = [];

      Array.from(fileList).forEach((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          rejectedMessages.push(`File type not allowed: ${file.type}`);
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          rejectedMessages.push(`File too large: ${file.name}`);
          return;
        }

        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);

        newFiles.push({
          id,
          file,
          preview,
          progress: 0,
          uploaded: false,
        });

        validFiles.push(file);
      });

      rejectedMessages.forEach((msg) => toast.error(msg));

      setFiles((prev) => [...prev, ...newFiles]);
      onFilesSelected(validFiles);

      newFiles.forEach((file) => simulateUpload(file.id));
    },
    [onFilesSelected]
  );

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? {
                ...file,
                progress: Math.min(file.progress + Math.random() * 30, 100),
                uploaded: file.progress >= 100,
              }
            : file
        )
      );
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? { ...file, progress: 100, uploaded: true }
            : file
        )
      );
    }, 1500 + Math.random() * 1000);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const removeExistingImage = (imageUrl: string) => {
    setRemovedExistingUrls((prev) => [...prev, imageUrl]);
    setPreviewUrls((prev) => prev.filter((url) => url !== imageUrl));
  };

//   const restoreExistingImage = (imageUrl: string) => {
//     setRemovedExistingUrls((prev) => prev.filter((url) => url !== imageUrl));
//     if (existingUrls.includes(imageUrl)) {
//       setPreviewUrls((prev) => [...prev, imageUrl]);
//     }
//   };

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearAll = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview));
    setFiles([]);

    if (existingUrls.length > 0) {
      setRemovedExistingUrls(existingUrls);
      setPreviewUrls([]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg">
      {/* Upload area */}
      <div
        className={`relative border border-dashed rounded-lg py-3 text-center ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <span
          onClick={openFileDialog}
          className="cursor-pointer text-blue-600 font-semibold"
        >
          Drop files here or browse
        </span>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Preview section */}
      <div className="mt-5 flex gap-2 overflow-x-auto">
        {previewUrls.map((url) => (
          <div key={url} className="relative w-28">
            <img src={url} className="rounded" />
            <button
              onClick={() => removeExistingImage(url)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {files.map((file) => (
          <div key={file.id} className="relative w-28">
            <img src={file.preview} className="rounded" />
            <button
              onClick={() => removeFile(file.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <X size={14} />
            </button>
            <div className="text-xs mt-1">{Math.round(file.progress)}%</div>
          </div>
        ))}
      </div>

      {(files.length > 0 || previewUrls.length > 0) && (
        <button
          onClick={clearAll}
          className="mt-4 text-sm text-red-600 font-medium"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default UploadMultiImages;
