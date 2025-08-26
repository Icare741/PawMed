import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Dog, Cat, Calendar, Scale, Info, Sparkles, HeartPulse, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Style pour la barre de défilement personnalisée
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #7A90C3;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #4F7AF4;
  }
  .custom-scrollbar {
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #7A90C3 transparent;
  }
`;

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddAnimalModal: React.FC<AddAnimalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [animalType, setAnimalType] = React.useState<string>("");
  const [formData, setFormData] = React.useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
    birthDate: "",
    gender: "",
    description: "",
    microchip: "",
    allergies: "",
    medications: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl overflow-hidden flex flex-col">
          {/* Fond décoratif */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] opacity-50" />
          <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#F4A259]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#A259F4]/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col h-full">
            <DialogHeader className="flex-none pb-6 border-b border-gray-100">
              <DialogTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] shadow-lg"
                >
                  {animalType === "Chien" ? (
                    <Dog className="w-8 h-8 text-white" />
                  ) : animalType === "Chat" ? (
                    <Cat className="w-8 h-8 text-white" />
                  ) : (
                    <Info className="w-8 h-8 text-white" />
                  )}
                </motion.div>
                <div>
                  <span className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] bg-clip-text text-transparent">
                    Ajouter un animal
                  </span>
                  <p className="text-sm text-gray-500 font-normal mt-1">
                    Remplissez les informations de votre animal
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-1 py-4 min-h-0 max-h-[calc(85vh-200px)]">
              <form id="add-animal-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Type d'animal */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-gray-700">Type d'animal</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`h-28 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-all ${
                        animalType === "Chien"
                          ? "bg-[#EAF1FF] border-[#4F7AF4] text-[#4F7AF4] shadow-lg"
                          : "bg-white border-gray-200 hover:border-[#4F7AF4]/50"
                      }`}
                      onClick={() => {
                        setAnimalType("Chien");
                        setFormData(prev => ({ ...prev, type: "Chien" }));
                      }}
                    >
                      <Dog className={`w-10 h-10 ${animalType === "Chien" ? "text-[#4F7AF4]" : "text-gray-400"}`} />
                      <span className="font-medium">Chien</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`h-28 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-all ${
                        animalType === "Chat"
                          ? "bg-[#FFF6E9] border-[#F4A259] text-[#F4A259] shadow-lg"
                          : "bg-white border-gray-200 hover:border-[#F4A259]/50"
                      }`}
                      onClick={() => {
                        setAnimalType("Chat");
                        setFormData(prev => ({ ...prev, type: "Chat" }));
                      }}
                    >
                      <Cat className={`w-10 h-10 ${animalType === "Chat" ? "text-[#F4A259]" : "text-gray-400"}`} />
                      <span className="font-medium">Chat</span>
                    </motion.button>
                  </div>
                </div>

                {/* Informations de base */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg font-semibold text-gray-700">Nom</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nom de l'animal"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breed" className="text-lg font-semibold text-gray-700">Race</Label>
                    <Input
                      id="breed"
                      name="breed"
                      placeholder="Race de l'animal"
                      value={formData.breed}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
                    />
                  </div>
                </div>

                {/* Âge et poids */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-lg font-semibold text-gray-700">Âge</Label>
                    <Input
                      id="age"
                      name="age"
                      placeholder="Âge de l'animal"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-lg font-semibold text-gray-700">Poids (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      placeholder="Poids de l'animal"
                      value={formData.weight}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
                    />
                  </div>
                </div>

                {/* Date de naissance et genre */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-lg font-semibold text-gray-700">Date de naissance</Label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-lg font-semibold text-gray-700">Genre</Label>
                    <Select
                      onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20">
                        <SelectValue placeholder="Sélectionner le genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Mâle</SelectItem>
                        <SelectItem value="female">Femelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Numéro de puce */}
                <div className="space-y-2">
                  <Label htmlFor="microchip" className="text-lg font-semibold text-gray-700">Numéro de puce</Label>
                  <Input
                    id="microchip"
                    name="microchip"
                    placeholder="Numéro de puce électronique"
                    value={formData.microchip}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
                  />
                </div>

                {/* Allergies et médicaments */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="allergies" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-[#F44F7A]" />
                      Allergies
                    </Label>
                    <Textarea
                      id="allergies"
                      name="allergies"
                      placeholder="Allergies connues"
                      value={formData.allergies}
                      onChange={handleChange}
                      className="h-32 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#4F7AF4]" />
                      Médicaments
                    </Label>
                    <Textarea
                      id="medications"
                      name="medications"
                      placeholder="Médicaments en cours"
                      value={formData.medications}
                      onChange={handleChange}
                      className="h-32 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#F4A259]" />
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Description de l'animal (comportement, particularités...)"
                    value={formData.description}
                    onChange={handleChange}
                    className="h-32 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
                  />
                </div>
              </form>
            </div>

            {/* Boutons d'action - Toujours visibles en bas */}
            <div className="flex-none flex items-center justify-end gap-4 py-2 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-8 py-3 rounded-xl border-gray-200 hover:border-[#4F7AF4] hover:text-[#4F7AF4] transition-all"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                form="add-animal-form"
                className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Ajouter l'animal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddAnimalModal;
