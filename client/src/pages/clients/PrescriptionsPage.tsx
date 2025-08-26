import React from "react";
import { motion } from "framer-motion";
import {
  Pill,
  Calendar,
  Download,
  Printer,
  Search,
  Filter,
  ChevronRight,
  Sparkles,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

// Données de test pour les ordonnances
const prescriptions = [
  {
    id: 1,
    date: "12 juin 2024",
    status: "active",
    vet: {
      name: "Dr. Martin",
      specialty: "Vétérinaire généraliste",
      avatar: null
    },
    animal: "Médor",
    medications: [
      { name: "Antibiotique", dosage: "1 comprimé matin et soir", duration: "7 jours" },
      { name: "Anti-inflammatoire", dosage: "1 comprimé par jour", duration: "5 jours" }
    ]
  },
  {
    id: 2,
    date: "05 juin 2024",
    status: "terminée",
    vet: {
      name: "Dr. Dupont",
      specialty: "Dermatologie",
      avatar: null
    },
    animal: "Félix",
    medications: [
      { name: "Vermifuge", dosage: "1 comprimé", duration: "1 jour" }
    ]
  },
  {
    id: 3,
    date: "28 mai 2024",
    status: "terminée",
    vet: {
      name: "Dr. Martin",
      specialty: "Vétérinaire généraliste",
      avatar: null
    },
    animal: "Rex",
    medications: [
      { name: "Anti-puce", dosage: "1 pipette", duration: "1 jour" }
    ]
  }
];

const PrescriptionsPage = () => {
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
                      <Pill className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] bg-clip-text text-transparent">
                      Mes ordonnances
                    </h1>
                  </div>
                  <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                    Consultez et gérez toutes vos ordonnances vétérinaires. Téléchargez ou imprimez vos documents médicaux en quelques clics.
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
                      <span className="text-[#F4A259] font-medium">2 ordonnances actives</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Barre de recherche et filtres */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
              <Search className="w-5 h-5 text-[#F4A259]" />
              <input type="text" placeholder="Rechercher une ordonnance..." className="bg-transparent outline-none text-gray-700 w-full" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtres
            </Button>
          </div>

          {/* Liste des ordonnances en grille */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prescriptions.map((prescription) => (
              <motion.div
                key={prescription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-gray-100"
              >
                {/* En-tête de l'ordonnance */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#EAF1FF]">
                      <Pill className="w-5 h-5 text-[#4F7AF4]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Ordonnance #{prescription.id}</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{prescription.date}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={prescription.status === "active" ? "default" : "secondary"}
                         className={prescription.status === "active" ? "bg-[#3CB371]" : "bg-[#F4A259]"}>
                    {prescription.status === "active" ? (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> En cours
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terminée
                      </div>
                    )}
                  </Badge>
                </div>

                {/* Informations du vétérinaire */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-[#F8FAFC] rounded-xl">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={prescription.vet.avatar || undefined} />
                    <AvatarFallback>{prescription.vet.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{prescription.vet.name}</p>
                    <p className="text-sm text-gray-500">{prescription.vet.specialty}</p>
                  </div>
                </div>

                {/* Liste des médicaments */}
                <div className="space-y-3 mb-4">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-xl">
                      <div className="p-2 rounded-lg bg-[#4F7AF4]/10">
                        <Pill className="w-4 h-4 text-[#4F7AF4]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.dosage}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-[#F4A259]" />
                          <span className="text-xs text-[#F4A259]">{med.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white">
                    <Download className="w-4 h-4 mr-2" /> Télécharger
                  </Button>
                  <Button variant="outline" className="flex-1 border-[#4F7AF4] text-[#4F7AF4]">
                    <Printer className="w-4 h-4 mr-2" /> Imprimer
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PrescriptionsPage;
