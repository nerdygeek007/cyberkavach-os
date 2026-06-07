import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div>
      <Sidebar />
      <Navbar />
      {children}
    </div>
  );
}