import React from "react";
import { twMerge } from "tailwind-merge";

const Modal = ({
  isOpen,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black bg-opacity-50">
      <div className={twMerge("bg-white p-6 rounded-md shadow-lg", className)}>
        {children}
      
      </div>
    </div>
  );
};

export default Modal;
