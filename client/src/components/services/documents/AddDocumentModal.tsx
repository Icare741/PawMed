import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Image, Table, Archive, Info, Upload, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  animals?: { name: string; id: string | number }[];
}

const categories = [
  { label: "Santé", value: "sante" },
  { label: "Examens", value: "examens" },
  { label: "Administratif", value: "administratif" },
  { label: "Autres", value: "autres" },
];

const types = [
  { label: "PDF", value: "pdf", icon: FileText },
  { label: "Image", value: "image", icon: Image },
  { label: "Tableur", value: "spreadsheet", icon: Table },
  { label: "Archive", value: "archive", icon: Archive },
  { label: "Autre", value: "other", icon: Info },
];

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ isOpen, onClose, onSubmit, animals = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "pdf",
    file: null as File | null,
    animal: "",
    category: "sante",
    description: "",
  });
  const [fileName, setFileName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "file" && files && files[0]) {
      setFormData(prev => ({ ...prev, file: files[0] }));
      setFileName(files[0].name);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAnimalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, animal: e.target.value }));
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl overflow-hidden flex flex-col">
        <DialogHeader className="flex-none pb-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FolderOpen className="w-7 h-7 text-[#4F7AF4]" />
            Ajouter un document
          </DialogTitle>
        </DialogHeader>
        <form id="add-document-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-1 py-6 space-y-6 custom-scrollbar">
          {/* Nom du document */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold text-gray-700">Nom du document</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex : Carnet de santé, Radiographie..."
              value={formData.name}
              onChange={handleChange}
              required
              className="h-11 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
            />
          </div>
          {/* Type de document */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-700">Type de fichier</Label>
            <div className="flex gap-2">
              {types.map((t) => (
                <motion.button
                  type="button"
                  key={t.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl border-2 transition-all text-sm font-medium ${
                    formData.type === t.value
                      ? "bg-[#EAF1FF] border-[#4F7AF4] text-[#4F7AF4] shadow"
                      : "bg-white border-gray-200 hover:border-[#4F7AF4]/50 text-gray-500"
                  }`}
                  onClick={() => handleTypeChange(t.value)}
                >
                  <t.icon className="w-5 h-5 mb-1" />
                  {t.label}
                </motion.button>
              ))}
            </div>
          </div>
          {/* Fichier à uploader */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-base font-semibold text-gray-700">Fichier</Label>
            <div className="flex items-center gap-3">
              <Input
                id="file"
                name="file"
                type="file"
                accept=".pdf,image/*,.xlsx,.xls,.csv,.zip,.rar,.7z,.doc,.docx"
                onChange={handleChange}
                className="h-11 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
                required
              />
              {fileName && (
                <span className="text-xs text-gray-500 truncate max-w-[180px]">{fileName}</span>
              )}
            </div>
          </div>
          {/* Animal concerné */}
          <div className="space-y-2">
            <Label htmlFor="animal" className="text-base font-semibold text-gray-700">Animal concerné</Label>
            <select
              id="animal"
              name="animal"
              value={formData.animal}
              onChange={handleAnimalChange}
              required
              className="h-11 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20 px-3 text-gray-700"
            >
              <option value="" disabled>Sélectionner un animal</option>
              {animals.map((a) => (
                <option key={a.id} value={a.name}>{a.name}</option>
              ))}
            </select>
          </div>
          {/* Catégorie */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-700">Catégorie</Label>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <motion.button
                  type="button"
                  key={cat.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-2 rounded-xl border-2 transition-all text-sm font-medium ${
                    formData.category === cat.value
                      ? "bg-[#FDE7EF] border-[#F44F7A] text-[#F44F7A] shadow"
                      : "bg-white border-gray-200 hover:border-[#F44F7A]/50 text-gray-500"
                  }`}
                  onClick={() => handleCategoryChange(cat.value)}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold text-gray-700">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description du document, informations complémentaires..."
              value={formData.description}
              onChange={handleChange}
              className="h-24 rounded-xl border-gray-200 focus:border-[#4F7AF4] focus:ring-[#4F7AF4]/20"
            />
          </div>
        </form>
        {/* Boutons d'action */}
        <div className="flex-none flex justify-center gap-6 py-6 border-t border-gray-100 bg-white/80 backdrop-blur-lg rounded-b-3xl shadow-inner">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-8 py-3 rounded-xl border-gray-200 hover:border-[#4F7AF4] hover:text-[#4F7AF4] transition-all text-base font-semibold"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            form="add-document-form"
            className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
          >
            Ajouter le document
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentModal;
