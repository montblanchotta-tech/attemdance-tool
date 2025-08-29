
import React from 'react';

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  colorClassName: string;
  disabled?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ label, onClick, icon, colorClassName, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`col-span-1 md:col-span-1 flex items-center justify-center w-full px-6 py-4 text-white font-bold text-lg rounded-xl shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${colorClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

export default ControlButton;
