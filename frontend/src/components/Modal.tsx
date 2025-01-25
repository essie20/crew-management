import React from "react";

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-96">
        {children}
      </div>
    </div>
  );
};
