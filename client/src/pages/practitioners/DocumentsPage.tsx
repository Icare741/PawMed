import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Upload,
  Download,
  Trash2,
  Eye,
  Calendar,
  User,
  Folder,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import SidebarPractitioners from "@/components/core/practitioners/SidebarPractitioners";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DocumentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [patientFilter, setPatientFilter] = useState("all");

  // Données fictives pour l'exemple (à remplacer par l'API)
  const [documents] = useState([
    {
      id: 1,
      name: "Rapport consultation Max",
      category: "consultation",
      patient: "Max",
      date: "2024-01-15",
      size: "2.3 MB",
      type: "PDF"
    },
    {
      id: 2,
      name: "Radiographie patte Luna",
      category: "imagerie",
      patient: "Luna",
      date: "2024-01-14",
      size: "5.1 MB",
      type: "DICOM"
    },
    {
      id: 3,
      name: "Analyse sang Buddy",
      category: "laboratoire",
      patient: "Buddy",
      date: "2024-01-13",
      size: "1.8 MB",
      type: "PDF"
    }
  ]);

  // Filtrer les documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchesPatient = patientFilter === "all" || doc.patient === patientFilter;
    
    return matchesSearch && matchesCategory && matchesPatient;
  });

  // Vérification de sécurité : seuls les praticiens peuvent accéder
  if (!user || user.role_id !== 2) {
    return <Navigate to="/dashboard" replace />;
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'consultation': return 'Consultation';
      case 'imagerie': return 'Imagerie';
      case 'laboratoire': return 'Laboratoire';
      case 'prescription': return 'Prescription';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'consultation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'imagerie': return 'bg-green-100 text-green-800 border-green-200';
      case 'laboratoire': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'prescription': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString + 'T00:00:00').toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  const handleUpload = () => {
    // Logique d'upload à implémenter
    console.log('Upload document');
  };

  const handleDownload = (document: any) => {
    // Logique de téléchargement à implémenter
    console.log('Download:', document.name);
  };

  const handleView = (document: any) => {
    // Logique de visualisation à implémenter
    console.log('View:', document.name);
  };

  const handleDelete = (document: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${document.name}" ?`)) {
      // Logique de suppression à implémenter
      console.log('Delete:', document.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] flex">
      <SidebarPractitioners />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#4F7AF4] mb-2">
            Gestion des documents
          </h1>
          <p className="text-gray-600">
            Gérez et organisez les documents de vos patients
          </p>
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border-0 shadow-lg bg-white/80 backdrop-blur-xl"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-0 shadow-lg bg-white/80 backdrop-blur-xl">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="imagerie">Imagerie</SelectItem>
                <SelectItem value="laboratoire">Laboratoire</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={patientFilter} onValueChange={setPatientFilter}>
              <SelectTrigger className="border-0 shadow-lg bg-white/80 backdrop-blur-xl">
                <SelectValue placeholder="Patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les patients</SelectItem>
                <SelectItem value="Max">Max</SelectItem>
                <SelectItem value="Luna">Luna</SelectItem>
                <SelectItem value="Buddy">Buddy</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={handleUpload}
              className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total documents', value: documents.length, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { label: 'Consultations', value: documents.filter(d => d.category === 'consultation').length, icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-50' },
            { label: 'Imagerie', value: documents.filter(d => d.category === 'imagerie').length, icon: User, color: 'text-purple-600', bgColor: 'bg-purple-50' },
            { label: 'Laboratoire', value: documents.filter(d => d.category === 'laboratoire').length, icon: Folder, color: 'text-orange-600', bgColor: 'bg-orange-50' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Liste des documents */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#4F7AF4]">
                Documents ({filteredDocuments.length})
              </h2>
            </div>
            
            <div className="p-6">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Aucun document trouvé</p>
                  <p className="text-sm">Ajustez vos filtres ou importez un nouveau document</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments.map((document) => (
                    <motion.div
                      key={document.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#4F7AF4]/20 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#4F7AF4]" />
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{document.name}</h3>
                              <Badge className={`${getCategoryColor(document.category)} border`}>
                                {getCategoryLabel(document.category)}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {document.patient}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(document.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <span>{document.size}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                                  {document.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(document)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(document)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(document)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentsPage;
