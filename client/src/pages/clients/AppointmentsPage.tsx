import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  ChevronRight,
  Search,
  Filter,
  Plus,
  PawPrint,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

// Données de test pour les rendez-vous
const appointments = [
  {
    id: 1,
    date: "14 juin 2024",
    time: "16:30",
    type: "Téléconsultation",
    status: "confirmé",
    vet: {
      name: "Dr. Martin",
      specialty: "Vétérinaire généraliste",
      avatar: null
    },
    animal: "Médor",
    reason: "Suivi post-opératoire"
  },
  {
    id: 2,
    date: "18 juin 2024",
    time: "10:00",
    type: "Consultation physique",
    status: "en attente",
    vet: {
      name: "Dr. Dupont",
      specialty: "Dermatologie",
      avatar: null
    },
    animal: "Félix",
    reason: "Problème de peau"
  },
  {
    id: 3,
    date: "20 juin 2024",
    time: "14:15",
    type: "Téléconsultation",
    status: "confirmé",
    vet: {
      name: "Dr. Bernard",
      specialty: "Vétérinaire généraliste",
      avatar: null
    },
    animal: "Luna",
    reason: "Vaccination annuelle"
  }
];

const AppointmentsPage = () => {
  const navigate = useNavigate();

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
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] bg-clip-text text-transparent">
                      Mes rendez-vous
                    </h1>
                  </div>
                  <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                    Gérez vos rendez-vous vétérinaires, consultez l'historique et planifiez de nouvelles consultations pour vos animaux.
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
                      <span className="text-[#F4A259] font-medium">Prochain RDV dans 2 jours</span>
                    </div>
                  </motion.div>
                  <Button
                    className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white font-bold rounded-xl shadow hover:shadow-lg transition-all px-6 py-3"
                    onClick={() => navigate('/book-appointment')}
                  >
                    <Plus className="w-5 h-5 mr-2" /> Nouveau rendez-vous
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Barre de recherche et filtres */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
              <Search className="w-5 h-5 text-[#F4A259]" />
              <input type="text" placeholder="Rechercher un rendez-vous..." className="bg-transparent outline-none text-gray-700 w-full" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtres
            </Button>
          </div>

          {/* Liste des rendez-vous */}
          <div className="grid grid-cols-1 gap-6">
            {appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    {/* Date et heure */}
                    <div className="flex flex-col items-center justify-center bg-[#EAF1FF] rounded-2xl p-4 min-w-[100px]">
                      <Calendar className="w-6 h-6 text-[#4F7AF4] mb-2" />
                      <span className="text-sm font-medium text-[#4F7AF4]">{appointment.date}</span>
                      <span className="text-lg font-bold text-[#4F7AF4]">{appointment.time}</span>
                    </div>

                    {/* Informations du rendez-vous */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{appointment.type}</h3>
                        <Badge variant={appointment.status === "confirmé" ? "default" : "secondary"}
                               className={appointment.status === "confirmé" ? "bg-[#3CB371]" : "bg-[#F4A259]"}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{appointment.reason}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={appointment.vet.avatar || undefined} />
                            <AvatarFallback>{appointment.vet.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.vet.name}</p>
                            <p className="text-sm text-gray-500">{appointment.vet.specialty}</p>
                          </div>
                        </div>
                        <Separator orientation="vertical" className="h-8" />
                        <div className="flex items-center gap-2">
                          <PawPrint className="w-5 h-5 text-[#F4A259]" />
                          <span className="text-gray-700">{appointment.animal}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3">
                    {appointment.type === "Téléconsultation" ? (
                      <Button className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white">
                        <Video className="w-5 h-5 mr-2" /> Rejoindre
                      </Button>
                    ) : (
                      <Button variant="outline" className="border-[#4F7AF4] text-[#4F7AF4]">
                        <MapPin className="w-5 h-5 mr-2" /> Voir l'adresse
                      </Button>
                    )}
                    <Button variant="ghost" className="text-gray-500 hover:text-[#4F7AF4]">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AppointmentsPage;
