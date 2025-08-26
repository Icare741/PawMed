import { ClipboardList, PawPrint, Users, MessageCircle, LogOut, Home, Pill, FileText, HeartPulse } from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/app/reducers/AuthReducers';

const SidebarClients = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const sidebarIcons = [
        { icon: Home, path: "/", label: "Dashboard" },
        { icon: ClipboardList, path: "/appointments", label: "Rendez-vous" },
        { icon: Users, path: "/patients", label: "Mes animaux" },
        { icon: Pill, path: "/prescriptions", label: "Ordonnances" },
        { icon: FileText, path: "/documents", label: "Documents" },
        { icon: HeartPulse, path: "/health-advice", label: "Conseils santé" },
    ];

    return (
        <aside className="hidden md:flex flex-col items-center py-6 px-2 bg-white/80 border-r border-gray-100 w-24 min-h-screen gap-6 z-10 backdrop-blur-xl">
            <div className="mb-8">
                <Link to="/" className="block">
                    <div className="bg-[#7A90C3]/10 p-3 rounded-xl hover:bg-[#7A90C3]/20 transition-colors">
                        <Home className="w-7 h-7 text-[#7A90C3]" />
                    </div>
                </Link>
            </div>
            <nav className="flex flex-col gap-6 flex-1">
                {sidebarIcons.map((item, idx) => (
                    <Link
                        key={idx}
                        to={item.path}
                        className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                            location.pathname === item.path
                                ? "bg-[#F4A259]/10 text-[#F4A259]"
                                : "text-gray-400 hover:bg-gray-50"
                        }`}
                    >
                        <item.icon className="w-6 h-6" />
                    </Link>
                ))}
            </nav>
            <button
                onClick={handleLogout}
                className="mt-auto p-3 rounded-xl text-[#F44F7A] hover:bg-[#FDE7EF] transition-colors"
                title="Se déconnecter"
            >
                <LogOut className="w-6 h-6" />
            </button>
        </aside>
    );
}

export default SidebarClients;
