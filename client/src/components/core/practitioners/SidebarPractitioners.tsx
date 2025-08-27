import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Folder,
  Settings,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/app/reducers/AuthReducers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const SidebarPractitioners = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Vérification de sécurité : seuls les praticiens peuvent voir cette sidebar
  if (!user || user.role_id !== 2) {
    return null; // Ne rien afficher si l'utilisateur n'est pas un praticien
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/practitioner/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/practitioner/consultations",
      label: "Consultations",
      icon: Calendar,
    },
    {
      path: "/practitioner/patients",
      label: "Patients",
      icon: Users,
    },
    {
      path: "/practitioner/prescriptions",
      label: "Ordonnances",
      icon: FileText,
    },
    {
      path: "/practitioner/documents",
      label: "Documents",
      icon: Folder,
    },
    {
      path: "/practitioner/settings",
      label: "Paramètres",
      icon: Settings,
    },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl h-screen sticky top-0"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4F7AF4] to-[#F44F7A] rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#4F7AF4]">PawMed</h1>
              <p className="text-sm text-gray-600">Espace Praticien</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={user?.profile?.avatar || undefined}
                alt={user?.profile?.firstName || user?.name || "Avatar"}
              />
              <AvatarFallback className="bg-gradient-to-br from-[#4F7AF4] to-[#F44F7A] text-white">
                {(user?.profile?.firstName || user?.name || "P")[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">
                Dr. {user?.profile?.firstName || user?.name || "Praticien"}
              </p>
              <p className="text-sm text-gray-600">Vétérinaire</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.li key={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 px-4 rounded-xl transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#4F7AF4]"
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200/50">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 px-4 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SidebarPractitioners;
