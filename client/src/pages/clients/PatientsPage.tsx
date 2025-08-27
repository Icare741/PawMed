import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dog,
  Cat,
  Plus,
  Search,
  Filter,
  Calendar,
  HeartPulse,
  FileText,
  Edit,
  Trash2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import AddAnimalModal from '@/components/services/animal/AddAnimalModal';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchPatients, createPatient, deletePatient } from '@/app/reducers/PatientsReducer';
import { Patient, CreatePatientData } from '@/app/reducers/PatientsReducer';

// Couleurs pour les types d'animaux
const animalColors = {
  "Chien": { bg: "bg-[#EAF1FF]", icon: "text-[#7A90C3]" },
  "Chat": { bg: "bg-[#FFF6E9]", icon: "text-[#F4A259]" },
  "Lapin": { bg: "bg-[#F3E6FD]", icon: "text-[#A259F4]" },
  "Oiseau": { bg: "bg-[#E6F7E6]", icon: "text-[#3CB371]" },
  "default": { bg: "bg-[#F0F0F0]", icon: "text-[#666666]" }
};

const PatientsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { patients, isLoading, error } = useAppSelector(state => state.patients);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const handleAddAnimal = async (data: CreatePatientData) => {
    try {
      await dispatch(createPatient(data)).unwrap();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
    }
  };

  const handleDeleteAnimal = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet animal ?')) {
      try {
        await dispatch(deletePatient(id)).unwrap();
      } catch (error) {
        console.error('Erreur lors de la suppression du patient:', error);
      }
    }
  };

  // Calculer l'âge et autres informations
  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return 'Âge inconnu';
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInYears = today.getFullYear() - birth.getFullYear();
    return `${ageInYears} an${ageInYears > 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F4A259] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des animaux...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] flex items-center justify-center">
        <div className="text-center text-red-600 bg-red-50 p-6 rounded-xl">
          <p>Erreur lors du chargement : {error}</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] p-8 relative">
        {/* Bulles décoratives */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#F4A259]/20 rounded-full blur-3xl z-0" />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#A259F4]/20 rounded-full blur-3xl z-0" />

        {/* Contenu principal */}
        <div className="relative z-10">
          {/* En-tête */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12 relative z-10"
          >
            <Card className="p-8 bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl rounded-3xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A]">
                      <Dog className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] bg-clip-text text-transparent">
                      Mes animaux
                    </h1>
                  </div>
                  <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                    Gérez les informations de vos animaux, suivez leur santé et consultez leur historique médical.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="hidden md:block"
                  >
                    <div className="flex items-center gap-2 bg-[#F4A259]/10 p-3 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-[#F4A259] animate-pulse" />
                      <span className="text-[#F4A259] font-medium">{patients.length} animaux enregistrés</span>
                    </div>
                  </motion.div>
                  <Button
                    className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white font-bold rounded-xl shadow hover:shadow-lg transition-all px-6 py-3"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus className="w-5 h-5 mr-2" /> Ajouter un animal
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Barre de recherche et filtres */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
              <Search className="w-5 h-5 text-[#F4A259]" />
              <input type="text" placeholder="Rechercher un animal..." className="bg-transparent outline-none text-gray-700 w-full" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtres
            </Button>
          </div>

          {/* Liste des animaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patients.map((patient) => {
              const colors = animalColors[patient.species as keyof typeof animalColors] || animalColors.default;
              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-6">
                      {/* Avatar et informations principales */}
                      <div className="flex flex-col items-center">
                        <div className={`p-4 rounded-2xl ${colors.bg} mb-3`}>
                          {patient.species === "Chien" ? (
                            <Dog className={`w-12 h-12 ${colors.icon}`} />
                          ) : (
                            <Cat className={`w-12 h-12 ${colors.icon}`} />
                          )}
                        </div>
                        <Badge variant="outline" className="bg-white">
                          Bon
                        </Badge>
                      </div>

                      {/* Informations détaillées */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{patient.name}</h3>
                            <p className="text-gray-500">{patient.breed || 'Race non spécifiée'} • {calculateAge(patient.birthDate)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#4F7AF4]">
                              <Edit className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-gray-400 hover:text-red-500"
                              onClick={() => handleDeleteAnimal(patient.id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-[#F8FAFC] p-3 rounded-xl">
                            <p className="text-sm text-gray-500">Espèce</p>
                            <p className="font-semibold text-gray-900">{patient.species}</p>
                          </div>
                          <div className="bg-[#F8FAFC] p-3 rounded-xl">
                            <p className="text-sm text-gray-500">Date de naissance</p>
                            <p className="font-semibold text-gray-900">
                              {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                            </p>
                          </div>
                        </div>

                        {/* Historique médical */}
                        {patient.medicalHistory && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500 mb-2">Historique médical</p>
                            <div className="bg-[#F8FAFC] p-3 rounded-lg">
                              <p className="text-sm text-gray-700">{patient.medicalHistory}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1 border-[#4F7AF4] text-[#4F7AF4]">
                      <HeartPulse className="w-4 h-4 mr-2" /> Historique médical
                    </Button>
                    <Button variant="outline" className="flex-1 border-[#4F7AF4] text-[#4F7AF4]">
                      <Calendar className="w-4 h-4 mr-2" /> Prendre RDV
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'animal */}
      <AddAnimalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAnimal}
      />
    </TooltipProvider>
  );
};

export default PatientsPage;
