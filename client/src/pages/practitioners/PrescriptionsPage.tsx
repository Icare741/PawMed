import React, { useEffect, useState } from "react";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Plus,
  Filter,
  Calendar,
  User,
  Stethoscope,
  Download,
  Printer,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchPrescriptions } from "@/app/reducers/PrescriptionsReducer";
import { fetchPatients } from "@/app/reducers/PatientsReducer";
import SidebarPractitioners from "@/components/core/practitioners/SidebarPractitioners";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PrescriptionActions from "@/components/services/prescriptions/PrescriptionActions";

const PrescriptionsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  
  const { prescriptions, isLoading, error } = useAppSelector((state) => state.prescriptions);
  const { patients } = useAppSelector((state) => state.patients);
  const { user } = useAppSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [patientFilter, setPatientFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchPrescriptions());
    dispatch(fetchPatients());
  }, [dispatch]);

  // Filtrer les prescriptions
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const medicationNames = prescription.items?.map(item => item.medicationName).join(' ') || '';
    const matchesSearch = medicationNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || prescription.status === statusFilter;
    const matchesPatient = patientFilter === "all" || prescription.patient?.id?.toString() === patientFilter;
    
    return matchesSearch && matchesStatus && matchesPatient;
  });

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Terminée';
      case 'expired': return 'Expirée';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non spécifiée';
    try {
      return new Date(dateString + 'T00:00:00').toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

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
            Gestion des ordonnances
          </h1>
          <p className="text-gray-600">
            Créez et gérez les ordonnances de vos patients
          </p>
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border-0 shadow-lg bg-white/80 backdrop-blur-xl"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-0 shadow-lg bg-white/80 backdrop-blur-xl">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Terminée</SelectItem>
                <SelectItem value="expired">Expirée</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={patientFilter} onValueChange={setPatientFilter}>
              <SelectTrigger className="border-0 shadow-lg bg-white/80 backdrop-blur-xl">
                <SelectValue placeholder="Patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les patients</SelectItem>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              onClick={() => navigate('/practitioner/prescriptions/new')}
              className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle ordonnance
            </Button>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total', value: prescriptions.length, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { label: 'Actives', value: prescriptions.filter(p => p.status === 'active').length, icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-50' },
            { label: 'Terminées', value: prescriptions.filter(p => p.status === 'completed').length, icon: User, color: 'text-purple-600', bgColor: 'bg-purple-50' },
            { label: 'Expirées', value: prescriptions.filter(p => p.status === 'expired').length, icon: Stethoscope, color: 'text-red-600', bgColor: 'bg-red-50' }, 
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

        {/* Liste des ordonnances */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#4F7AF4]">
                Ordonnances ({filteredPrescriptions.length})
              </h2>
            </div>
            
            <div className="p-6">
              {filteredPrescriptions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Aucune ordonnance trouvée</p>
                  <p className="text-sm">Ajustez vos filtres ou créez une nouvelle ordonnance</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPrescriptions.map((prescription) => (
                    <motion.div
                      key={prescription.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#4F7AF4]/20 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#4F7AF4]" />
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {prescription.items?.[0]?.medicationName || 'Médicament non spécifié'}
                              </h3>
                              <Badge className={`${getStatusColor(prescription.status)} border`}>
                                {getStatusLabel(prescription.status)}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {prescription.patient?.name || 'Patient inconnu'}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(prescription.prescriptionDate)}
                              </div>
                            </div>
                            
                            {prescription.notes && (
                              <p className="text-sm text-gray-500 mt-1">
                                <strong>Notes:</strong> {prescription.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <PrescriptionActions prescription={prescription} />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/practitioner/prescriptions/${prescription.id}/edit`)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            Modifier
                          </Button>
                        </div>
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

export default PrescriptionsPage;
