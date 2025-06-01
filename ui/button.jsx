import React from "react";

export const Button = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};
