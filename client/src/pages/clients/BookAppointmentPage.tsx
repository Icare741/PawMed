import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchPractitioners } from "@/app/reducers/PractitionersReducer";
import AppointmentForm from "./AppointmentForm";

// Définir un type pour un vétérinaire
interface Vet {
  id: number;
  name: string;
  avatar: string;
  speciality: string;
  tarif: string;
  ville: string;
  tiersPayant: boolean;
  slots: string[];
  date: string;
}

const BookAppointmentPage = () => {
  const dispatch = useAppDispatch();
  const { practitioners, isLoading: practitionersLoading } = useAppSelector((state) => state.practitioners);
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    dispatch(fetchPractitioners());
  }, [dispatch]);

  // Générer des dates pour les 7 prochains jours
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const dayName = dayNames[date.getDay()];
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      
      dates.push({
        value: `${day}/${month}`,
        label: `${dayName}. ${day}/${month}`,
        fullDate: date
      });
    }
    
    return dates;
  };

  const dates = generateDates();

  // Créer des vétérinaires avec les données de l'API
  const createVetsFromPractitioners = (): Vet[] => {
    if (!practitioners || practitioners.length === 0) {
      // Retourner des vétérinaires de démonstration si aucun praticien n'est disponible
      return [
        {
          id: 1,
          name: "Dr Ilhem REJEB",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg",
          speciality: "Médecin Généraliste",
          tarif: "25€ • Secteur 1",
          ville: "Saint-Maur-des-Fossés (94210)",
          tiersPayant: true,
          slots: ["6:30", "7:00", "7:15", "7:30", "7:45"],
          date: "Dim. 25/05",
        },
        {
          id: 2,
          name: "Dr Jean MARTIN",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
          speciality: "Vétérinaire Généraliste",
          tarif: "30€ • Secteur 2",
          ville: "Paris (75012)",
          tiersPayant: false,
          slots: ["8:00", "8:30", "9:00", "9:30"],
          date: "Lun. 26/05",
        },
      ];
    }

    // Convertir les praticiens de l'API en format Vet
    return practitioners.map((practitioner, index) => ({
      id: practitioner.id,
      name: practitioner.name,
      avatar: practitioner.avatar || `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${index + 1}.jpg`,
      speciality: practitioner.speciality || "Vétérinaire Généraliste",
      tarif: `${25 + (index * 5)}€ • Secteur ${index % 2 + 1}`,
      ville: practitioner.city || `Ville ${index + 1}`,
      tiersPayant: index % 2 === 0,
      slots: ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "14:00", "14:30", "15:00", "15:30"],
      date: dates[index % dates.length]?.label || "Aujourd'hui",
    }));
  };

  const vets = createVetsFromPractitioners();

  const handleSlotClick = (vet: Vet, slot: string, date: string) => {
    setSelectedVet(vet);
    setSelectedSlot(slot);
    setSelectedDate(date);
  };

  const handleCancel = () => {
    setSelectedVet(null);
    setSelectedSlot("");
    setSelectedDate("");
  };

  if (practitionersLoading) {
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

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] py-12 px-2 md:px-8 overflow-x-hidden">
      {/* Bulles décoratives */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#F4A259]/20 rounded-full blur-3xl z-0" />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#A259F4]/20 rounded-full blur-3xl z-0" />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="absolute bottom-0 left-1/3 w-[200px] h-[200px] bg-[#4F7AF4]/10 rounded-full blur-2xl z-0" />

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#4F7AF4] mb-2">Praticiens disponibles sur rendez-vous</h1>
        </motion.div>
        
        {/* Afficher la liste seulement si aucun créneau n'est sélectionné */}
        {!selectedVet || !selectedSlot ? (
          <div className="flex flex-col gap-6 mt-8">
            {vets.map((vet) => (
              <Card key={vet.id} className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4 md:gap-0 p-6 md:p-8 rounded-3xl shadow-xl bg-white/80 border-0 backdrop-blur-xl relative">
                {/* Avatar & infos */}
                <div className="flex flex-row items-center gap-4 md:gap-6 flex-1 min-w-0">
                  <img src={vet.avatar} alt={vet.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-[#F4A259]/30 shadow" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-lg md:text-xl text-gray-900 truncate">{vet.name}</span>
                    <span className="text-[#7A90C3] text-sm md:text-base font-medium truncate">{vet.speciality}</span>
                  </div>
                </div>
                
                {/* Infos tarif/ville/badge */}
                <div className="flex flex-col items-end md:items-start gap-2 md:ml-8 min-w-[180px]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Tarif</span>
                    <span className="text-base font-bold text-[#4F7AF4]">{vet.tarif}</span>
                    {vet.tiersPayant && (
                      <Badge className="ml-2 bg-[#4F7AF4]/10 text-[#4F7AF4] font-bold">Tiers payant</Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">Ville<br /><span className="font-semibold text-gray-700">{vet.ville}</span></span>
                </div>
                
                {/* Sélection de date et créneaux horaires */}
                <div className="flex flex-col items-end md:items-center gap-2 min-w-[280px]">
                  <div className="flex gap-2 mb-2">
                    {dates.slice(0, 3).map((date) => (
                      <Button
                        key={date.value}
                        size="sm"
                        variant="outline"
                        className={`text-xs ${selectedDate === date.label ? 'bg-[#4F7AF4] text-white border-[#4F7AF4]' : 'border-[#4F7AF4]/30 text-[#4F7AF4]'}`}
                        onClick={() => setSelectedDate(date.label)}
                      >
                        {date.label}
                      </Button>
                    ))}
                  </div>
                  
                  {selectedDate && (
                    <div className="flex flex-row flex-wrap gap-2 mb-2">
                      {vet.slots.map((slot) => (
                        <Button
                          key={slot}
                          size="sm"
                          variant="outline"
                          className="rounded-lg border-[#4F7AF4]/30 text-[#4F7AF4] font-bold bg-white/80 hover:bg-[#F4A259]/10 transition-all"
                          onClick={() => handleSlotClick(vet, slot, selectedDate)}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <Button size="sm" variant="ghost" className="text-[#4F7AF4] font-semibold underline underline-offset-2 px-2 py-1">
                    Voir l'agenda complet
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <AppointmentForm
            vet={selectedVet}
            slot={selectedSlot}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default BookAppointmentPage;
