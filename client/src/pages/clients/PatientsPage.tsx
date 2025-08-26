import React, { useState } from "react";
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

// Données de test pour les animaux
const animals = [
  {
    id: 1,
    name: "Médor",
    type: "Chien",
    breed: "Labrador",
    age: "3 ans",
    weight: "28 kg",
    lastVisit: "12 juin 2024",
    nextVisit: "14 juin 2024",
    color: "bg-[#EAF1FF]",
    iconColor: "text-[#7A90C3]",
    avatar: null,
    healthStatus: "Bon",
    vaccinations: [
      { name: "CHPL", date: "01/01/2024", next: "01/01/2025" },
      { name: "Rage", date: "15/03/2024", next: "15/03/2025" }
    ]
  },
  {
    id: 2,
    name: "Félix",
    type: "Chat",
    breed: "Siamois",
    age: "2 ans",
    weight: "4.5 kg",
    lastVisit: "05 juin 2024",
    nextVisit: "18 juin 2024",
    color: "bg-[#FFF6E9]",
    iconColor: "text-[#F4A259]",
    avatar: null,
    healthStatus: "Bon",
    vaccinations: [
      { name: "Typhus", date: "10/02/2024", next: "10/02/2025" },
      { name: "Leucose", date: "10/02/2024", next: "10/02/2025" }
    ]
  },
  {
    id: 3,
    name: "Luna",
    type: "Chat",
    breed: "Persan",
    age: "1 an",
    weight: "3.8 kg",
    lastVisit: "28 mai 2024",
    nextVisit: "20 juin 2024",
    color: "bg-[#F3E6FD]",
    iconColor: "text-[#A259F4]",
    avatar: null,
    healthStatus: "Bon",
    vaccinations: [
      { name: "Typhus", date: "15/04/2024", next: "15/04/2025" },
      { name: "Leucose", date: "15/04/2024", next: "15/04/2025" }
    ]
  }
];

const PatientsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddAnimal = (data: any) => {
    // Ici, vous pouvez ajouter la logique pour sauvegarder le nouvel animal
    console.log('Nouvel animal:', data);
  };

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
                      <span className="text-[#F4A259] font-medium">{animals.length} animaux enregistrés</span>
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
            {animals.map((animal) => (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    {/* Avatar et informations principales */}
                    <div className="flex flex-col items-center">
                      <div className={`p-4 rounded-2xl ${animal.color} mb-3`}>
                        {animal.type === "Chien" ? (
                          <Dog className={`w-12 h-12 ${animal.iconColor}`} />
                        ) : (
                          <Cat className={`w-12 h-12 ${animal.iconColor}`} />
                        )}
                      </div>
                      <Badge variant="outline" className="bg-white">
                        {animal.healthStatus}
                      </Badge>
                    </div>

                    {/* Informations détaillées */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{animal.name}</h3>
                          <p className="text-gray-500">{animal.breed} • {animal.age}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#4F7AF4]">
                            <Edit className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Statistiques */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-[#F8FAFC] p-3 rounded-xl">
                          <p className="text-sm text-gray-500">Poids</p>
                          <p className="font-semibold text-gray-900">{animal.weight}</p>
                        </div>
                        <div className="bg-[#F8FAFC] p-3 rounded-xl">
                          <p className="text-sm text-gray-500">Dernière visite</p>
                          <p className="font-semibold text-gray-900">{animal.lastVisit}</p>
                        </div>
                      </div>

                      {/* Vaccinations */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 mb-2">Vaccinations</p>
                        {animal.vaccinations.map((vacc, index) => (
                          <div key={index} className="flex items-center justify-between bg-[#F8FAFC] p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#4F7AF4]" />
                              <span className="text-sm text-gray-700">{vacc.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#F4A259]" />
                              <span className="text-xs text-[#F4A259]">Prochain: {vacc.next}</span>
                            </div>
                          </div>
                        ))}
                      </div>
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
            ))}
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
