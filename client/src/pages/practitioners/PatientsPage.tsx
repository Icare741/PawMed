import React, { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Stethoscope,
  Calendar,
  FileText,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchPatients } from "@/app/reducers/PatientsReducer";
import SidebarPractitioners from "@/components/core/practitioners/SidebarPractitioners";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const PatientsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { patients, isLoading, error } = useAppSelector((state) => state.patients);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#F4A259] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600 bg-red-50 p-4 rounded-xl shadow-sm">
          Une erreur est survenue: {error}
        </div>
      </div>
    );
  }

  // Vérification de sécurité : seuls les praticiens peuvent accéder
  if (!user || user.role_id !== 2) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] flex">
      <SidebarPractitioners />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#4F7AF4] mb-2">
            Mes patients
          </h1>
          <p className="text-gray-600">
            Gérez et suivez vos patients
          </p>
        </motion.div>

        {/* Barre de recherche */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher un patient..."
              className="pl-10 pr-4 py-3 border-0 shadow-lg bg-white/80 backdrop-blur-xl"
            />
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total patients', value: patients.length, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { label: 'Consultations ce mois', value: '12', icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-50' },
            { label: 'Ordonnances actives', value: '8', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Liste des patients */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#4F7AF4]">Tous mes patients</h2>
                <Button
                  onClick={() => navigate('/practitioner/patients/new')}
                  className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau patient
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {patients.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Aucun patient pour le moment</p>
                  <p className="text-sm">Les patients apparaîtront ici une fois créés</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.map((patient) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer border border-gray-200"
                      onClick={() => navigate(`/practitioner/patients/${patient.id}`)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-[#4F7AF4]/20 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-[#4F7AF4]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {patient.species}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Propriétaire:</strong> {patient.ownerName}</p>
                        <p><strong>Âge:</strong> {patient.birthDate ? new Date(patient.birthDate + 'T00:00:00').toLocaleDateString('fr-FR') : 'Non spécifié'}</p>
                        <p><strong>Race:</strong> {patient.breed || 'Non spécifiée'}</p>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/practitioner/consultations?patient=${patient.id}`);
                          }}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          Consultations
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/practitioner/prescriptions?patient=${patient.id}`);
                          }}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          Ordonnances
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientsPage;
