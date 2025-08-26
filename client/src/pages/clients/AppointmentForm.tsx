import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Vet {
  name: string;
  avatar: string;
  speciality: string;
  tarif: string;
  ville: string;
  tiersPayant: boolean;
  slots: string[];
  date: string;
}

interface Animal {
  name: string;
  type: string;
}

interface AppointmentFormProps {
  vet: Vet;
  slot: string;
  animals: Animal[];
  types: { label: string }[];
  onCancel: () => void;
  onSubmit?: (data: any) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ vet, slot, animals, types, onCancel, onSubmit }) => {
  const [selectedType, setSelectedType] = useState(types[0].label);
  const [selectedAnimal, setSelectedAnimal] = useState(animals[0].name);
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ vet, slot, selectedType, selectedAnimal, reason });
    } else {
      alert("Rendez-vous demandé !");
    }
    onCancel();
  };

  return (
    <Card className="p-10 rounded-3xl shadow-2xl bg-white/70 border-0 backdrop-blur-xl relative max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-[#4F7AF4] mb-4">Prendre rendez-vous avec {vet.name}</h2>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Type de rendez-vous */}
        <div>
          <label className="block text-[#4F7AF4] font-semibold mb-2">Type de rendez-vous</label>
          <div className="flex gap-4">
            {types.map((type) => (
              <button
                type="button"
                key={type.label}
                onClick={() => setSelectedType(type.label)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all font-medium shadow-sm backdrop-blur-xl ${selectedType === type.label ? "bg-[#F4A259]/10 border-[#F4A259] text-[#F4A259]" : "bg-white/60 border-gray-200 text-gray-500 hover:bg-[#FDE7EF]/30"}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        {/* Date et heure (readonly) */}
        <div>
          <label className="block text-[#4F7AF4] font-semibold mb-2">Date et heure</label>
          <input
            type="text"
            value={`${vet.date} à ${slot}`}
            readOnly
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white/60 shadow-sm text-gray-700 w-full cursor-not-allowed"
          />
        </div>
        {/* Animal */}
        <div>
          <label className="block text-[#4F7AF4] font-semibold mb-2">Animal concerné</label>
          <select
            value={selectedAnimal}
            onChange={e => setSelectedAnimal(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white/60 shadow-sm focus:border-[#4F7AF4] focus:ring-2 focus:ring-[#4F7AF4]/20 outline-none text-gray-700 w-full"
            required
          >
            {animals.map((animal) => (
              <option key={animal.name} value={animal.name}>{animal.name} ({animal.type})</option>
            ))}
          </select>
        </div>
        {/* Motif */}
        <div>
          <label className="block text-[#4F7AF4] font-semibold mb-2">Motif du rendez-vous</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white/60 shadow-sm focus:border-[#4F7AF4] focus:ring-2 focus:ring-[#4F7AF4]/20 outline-none text-gray-700 w-full min-h-[80px]"
            placeholder="Décrivez le motif de la consultation..."
            required
          />
        </div>
        <Separator className="my-2 bg-[#F4A259]/20" />
        <Button
          type="submit"
          size="lg"
          className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white font-bold rounded-2xl shadow hover:shadow-lg transition-all text-lg group px-8 py-3 mt-2"
        >
          Valider le rendez-vous
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-[#F44F7A] font-semibold mt-2"
          onClick={onCancel}
        >
          Retour
        </Button>
      </form>
    </Card>
  );
};

export default AppointmentForm;
