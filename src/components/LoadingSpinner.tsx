import React from "react";

interface LoadingSpinnerProps {
  className?: string;
  size?: string;
}

const LoadingSpinner = ({
  className,
  size = "w-8 h-8",
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex h-screen items-center justify-center`}>
      <div
        className={`${className || ""} ${size} border-primary animate-spin rounded-full border-2 border-t-transparent`}
      />
    </div>
  );
};

export default LoadingSpinner;
