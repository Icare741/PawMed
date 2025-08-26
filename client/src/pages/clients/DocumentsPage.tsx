import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Search,
  Filter,
  Plus,
  File,
  Image,
  FileText as FilePdf,
  Table as FileSpreadsheet,
  Archive as FileArchive,
  Eye,
  Share2,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import AddDocumentModal from "@/components/services/documents/AddDocumentModal";

// Données de test pour les documents
const documents = [
  {
    id: 1,
    name: "Carnet de santé - Médor",
    type: "pdf",
    size: "2.4 MB",
    date: "12 juin 2024",
    animal: "Médor",
    category: "Santé",
    icon: FilePdf,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: 2,
    name: "Radiographie - Félix",
    type: "image",
    size: "1.8 MB",
    date: "05 juin 2024",
    animal: "Félix",
    category: "Examens",
    icon: Image,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 3,
    name: "Vaccinations - Luna",
    type: "pdf",
    size: "1.2 MB",
    date: "28 mai 2024",
    animal: "Luna",
    category: "Santé",
    icon: FilePdf,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: 4,
    name: "Analyse sanguine - Médor",
    type: "spreadsheet",
    size: "0.8 MB",
    date: "20 mai 2024",
    animal: "Médor",
    category: "Examens",
    icon: FileSpreadsheet,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: 5,
    name: "Dossier médical - Félix",
    type: "archive",
    size: "4.2 MB",
    date: "15 mai 2024",
    animal: "Félix",
    category: "Santé",
    icon: FileArchive,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

const categories = [
  { name: "Tous", count: documents.length },
  { name: "Santé", count: 3 },
  { name: "Examens", count: 2 },
  { name: "Administratif", count: 0 },
  { name: "Autres", count: 0 },
];

const animals = [
  { name: "Médor", id: 1 },
  { name: "Félix", id: 2 },
  { name: "Luna", id: 3 },
];

const DocumentsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  // Fonction de soumission du document
  const handleAddDocument = (data: any) => {
    // Ici tu ajoutes la logique pour stocker le document (API, state, etc.)
    console.log("Nouveau document :", data);
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
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] bg-clip-text text-transparent">
                      Mes documents
                    </h1>
                  </div>
                  <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                    Gérez tous les documents de vos animaux : carnets de santé, examens, radiographies et plus encore.
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
                      <span className="text-[#F4A259] font-medium">{documents.length} documents</span>
                    </div>
                  </motion.div>
                  <Button
                    className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white font-bold rounded-xl shadow hover:shadow-lg transition-all px-6 py-3"
                    onClick={() => setAddModalOpen(true)}
                  >
                    <Upload className="w-5 h-5 mr-2" /> Ajouter un document
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
              <Search className="w-5 h-5 text-[#F4A259]" />
              <input type="text" placeholder="Rechercher un document..." className="bg-transparent outline-none text-gray-700 w-full" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtres
            </Button>
          </div>

          {/* Catégories */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  selectedCategory === category.name
                    ? "bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white"
                    : "hover:bg-[#4F7AF4]/10"
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <FolderOpen className="w-4 h-4" />
                {category.name}
                <Badge
                  variant="secondary"
                  className={`ml-2 ${
                    selectedCategory === category.name
                      ? "bg-white/20 text-white"
                      : "bg-[#4F7AF4]/10 text-[#4F7AF4]"
                  }`}
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Liste des documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] ${doc.bgColor} rounded-lg`}>
                      <doc.icon className={`w-5 h-5 ${doc.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.date}</span>
                      </div>
                      <Badge variant="outline" className="mt-2">
                        {doc.animal}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#4F7AF4]">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Voir le document</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#4F7AF4]">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Télécharger</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#4F7AF4]">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Partager</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Supprimer</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* MODAL AJOUT DOCUMENT */}
          <AddDocumentModal
            isOpen={isAddModalOpen}
            onClose={() => setAddModalOpen(false)}
            onSubmit={handleAddDocument}
            animals={animals}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DocumentsPage;
