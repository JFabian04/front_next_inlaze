import { ReactNode } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Footer from "../components/dashboard/Footer";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
            <Footer />
        </div>
    );
}