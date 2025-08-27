import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { createConsultation } from "@/app/reducers/ConsultationReducer";
import { fetchPatients } from "@/app/reducers/PatientsReducer";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Stethoscope, CheckCircle } from "lucide-react";

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

interface AppointmentFormProps {
  vet: Vet;
  slot: string;
  onCancel: () => void;
  onSubmit?: (data: any) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ vet, slot, onCancel, onSubmit }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { patients, isLoading: patientsLoading } = useAppSelector((state) => state.patients);
  const [selectedType, setSelectedType] = useState("video");
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  useEffect(() => {
    if (patients.length > 0 && !selectedAnimal) {
      setSelectedAnimal(patients[0].id.toString());
    }
  }, [patients, selectedAnimal]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedAnimal) {
      alert("Veuillez sélectionner un animal");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const consultationData = {
        practitionerId: vet.id,
        patientId: parseInt(selectedAnimal),
        date: vet.date.split(' ')[1], // Extraire la date du format "Dim. 25/05"
        time: slot,
        type: selectedType,
        notes: reason || undefined,
      };

      await dispatch(createConsultation(consultationData)).unwrap();
      
      if (onSubmit) {
        onSubmit({ vet, slot, selectedType, selectedAnimal, reason });
      } else {
        alert("Consultation créée avec succès !");
        navigate('/consultations');
      }
      
      onCancel();
    } catch (error: any) {
      alert(`Erreur lors de la création de la consultation: ${error.message || 'Une erreur est survenue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    // Convertir "Dim. 25/05" en date lisible
    const parts = dateStr.split(' ');
    if (parts.length >= 2) {
      return parts[1]; // Retourner "25/05"
    }
    return dateStr;
  };

  if (patientsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F7AF4]"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-10 rounded-3xl shadow-2xl bg-white/70 border-0 backdrop-blur-xl relative max-w-xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#4F7AF4]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-[#4F7AF4]" />
          </div>
          <h2 className="text-2xl font-bold text-[#4F7AF4] mb-2">
            Prendre une consultation
          </h2>
          <p className="text-gray-600">
            avec <strong>{vet.name}</strong>
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Type de rendez-vous */}
          <div>
            <label className="block text-[#4F7AF4] font-semibold mb-2">
              <Stethoscope className="w-4 h-4 inline mr-2" />
              Type de rendez-vous
            </label>
            <div className="flex gap-4">
              {[
                { value: "video", label: "Téléconsultation" },
                { value: "clinic", label: "Consultation en clinique" }
              ].map((type) => (
                <button
                  type="button"
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all font-medium shadow-sm backdrop-blur-xl ${
                    selectedType === type.value 
                      ? "bg-[#F4A259]/10 border-[#F4A259] text-[#F4A259]" 
                      : "bg-white/60 border-gray-200 text-gray-500 hover:bg-[#FDE7EF]/30"
                  }`}
                >
                  {type.value === "video" ? "📹" : "🏥"} {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date et heure (readonly) */}
          <div>
            <label className="block text-[#4F7AF4] font-semibold mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Date et heure
            </label>
            <div className="px-4 py-3 rounded-xl border border-gray-200 bg-[#4F7AF4]/10 shadow-sm text-[#4F7AF4] font-medium w-full">
              {formatDate(vet.date)} à {slot}
            </div>
          </div>

          {/* Animal */}
          <div>
            <label className="block text-[#4F7AF4] font-semibold mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Animal concerné
            </label>
            <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
              <SelectTrigger className="px-4 py-3 rounded-xl border border-gray-200 bg-white/60 shadow-sm focus:border-[#4F7AF4] focus:ring-2 focus:ring-[#4F7AF4]/20 outline-none text-gray-700 w-full">
                <SelectValue placeholder="Sélectionner un animal" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((animal) => (
                  <SelectItem key={animal.id} value={animal.id.toString()}>
                    {animal.name} ({animal.species})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Motif */}
          <div>
            <label className="block text-[#4F7AF4] font-semibold mb-2">
              Motif du rendez-vous
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white/60 shadow-sm focus:border-[#4F7AF4] focus:ring-2 focus:ring-[#4F7AF4]/20 outline-none text-gray-700 w-full min-h-[80px]"
              placeholder="Décrivez le motif de la consultation..."
            />
          </div>

          <Separator className="my-2 bg-[#F4A259]/20" />

          {/* Résumé du rendez-vous */}
          <div className="bg-[#4F7AF4]/5 p-4 rounded-xl border border-[#4F7AF4]/20">
            <h3 className="font-semibold text-[#4F7AF4] mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Résumé du rendez-vous
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Vétérinaire:</strong> {vet.name}</p>
              <p><strong>Date:</strong> {formatDate(vet.date)} à {slot}</p>
                              <p><strong>Type:</strong> {selectedType === "video" ? "Téléconsultation" : "Consultation physique"}</p>
              <p><strong>Animal:</strong> {patients.find(p => p.id.toString() === selectedAnimal)?.name || 'Non sélectionné'}</p>
              {reason && <p><strong>Motif:</strong> {reason}</p>}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !selectedAnimal}
            className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white font-bold rounded-2xl shadow hover:shadow-lg transition-all text-lg group px-8 py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Création en cours...
              </div>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirmer le rendez-vous
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="text-[#F44F7A] font-semibold mt-2"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Retour
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default AppointmentForm;
