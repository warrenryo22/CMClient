import React from "react";

type SpinLoadingProps = {
  colorClass?: string;
  size?: number;
  thickness?: number;
};

const SpinLoading: React.FC<SpinLoadingProps> = ({
  colorClass = "border-blue-500",
  size = 64,
  thickness = 4,
}) => {
  return (
    <div className={`flex items-center justify-center z-50`}>
      <div
        className={`rounded-full animate-spin border-t-transparent border-solid ${colorClass}`}
        style={{
          width: size,
          height: size,
          borderWidth: thickness,
        }}
      />
    </div>
  );
};

export default SpinLoading;
