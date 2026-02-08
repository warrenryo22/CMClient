import SpinLoading from "./SpinLoading";

interface LoadingOverlayProps {
  isLoading: boolean;
  className?: string;
  size?: number;
}

const LoadingOverlay = ({
  isLoading,
  className,
  size,
}: LoadingOverlayProps) => {
  return (
    isLoading && (
      <div
        className={`absolute bg inset-0 flex items-center justify-center h-full bg-gray-100/50 z-10 ${className}`}
      >
        <SpinLoading size={size} />
      </div>
    )
  );
};

export default LoadingOverlay;
