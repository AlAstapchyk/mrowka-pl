import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
    </div>
  );
};

export default LoadingSpinner;
