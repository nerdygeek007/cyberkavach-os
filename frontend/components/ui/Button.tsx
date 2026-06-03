import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit";
}

export default function Button({
  children,
  type = "button",
}: ButtonProps) {
  return (
    <button type={type}>
      {children}
    </button>
  );
}