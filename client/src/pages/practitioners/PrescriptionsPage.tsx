import React, { useEffect, useState } from "react";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Plus,
  Filter,
  Calendar,
  User,
  Stethoscope,
  Download,
  Printer,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchPrescriptions, createPrescription } from "@/app/reducers/PrescriptionsReducer";
import { fetchPatients } from "@/app/reducers/PatientsReducer";
import SidebarPractitioners from "@/components/core/practitioners/SidebarPractitioners";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PrescriptionActions from "@/components/services/prescriptions/PrescriptionActions";

const PrescriptionsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  
  const { prescriptions, isLoading, error } = useAppSelector((state) => state.prescriptions);
  const { patients } = useAppSelector((state) => state.patients);
  const { user } = useAppSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [patientFilter, setPatientFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    consultationId: '',
    prescriptionDate: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'completed' | 'expired',
    notes: '',
    items: [
      {
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        quantity: 1,
        unit: 'comprimé'
      }
    ]
  });

  useEffect(() => {
    dispatch(fetchPrescriptions());
    // Pour les praticiens, récupérer tous les patients disponibles
    if (user?.role_id === 2) {
      // Utiliser une action spécifique pour récupérer tous les patients
      dispatch(fetchPatients());
    }
  }, [dispatch, user]);

  const handleCreatePrescription = async () => {
    try {
      const prescriptionData = {
        ...prescriptionForm,
        patientId: parseInt(prescriptionForm.patientId),
        consultationId: prescriptionForm.consultationId ? parseInt(prescriptionForm.consultationId) : undefined,
        items: prescriptionForm.items.filter(item => 
          item.medicationName && item.dosage && item.frequency && item.duration
        )
      };

      await dispatch(createPrescription(prescriptionData)).unwrap();
      setIsCreateDialogOpen(false);
      setPrescriptionForm({
        patientId: '',
        consultationId: '',
        prescriptionDate: new Date().toISOString().split('T')[0],
        status: 'active',
        notes: '',
        items: [
          {
            medicationName: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: '',
            quantity: 1,
            unit: 'comprimé'
          }
        ]
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'ordonnance:', error);
    }
  };

  const addPrescriptionItem = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      items: [...prev.items, {
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        quantity: 1,
        unit: 'comprimé'
      }]
    }));
  };

  const removePrescriptionItem = (index: number) => {
    if (prescriptionForm.items.length > 1) {
      setPrescriptionForm(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePrescriptionItem = (index: number, field: string, value: any) => {
    setPrescriptionForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Filtrer les prescriptions
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const medicationNames = prescription.items?.map(item => item.medication_name).join(' ') || '';
    const matchesSearch = medicationNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || prescription.status === statusFilter;
    const matchesPatient = patientFilter === "all" || prescription.patient?.id?.toString() === patientFilter;
    
    return matchesSearch && matchesStatus && matchesPatient;
  });

  if (isLoading) {
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600 bg-red-50 p-4 rounded-xl shadow-sm">
          Une erreur est survenue: {error}
        </div>
      </div>
    );
  }

  // Vérification de sécurité : seuls les praticiens peuvent accéder
  if (!user || user.role_id !== 2) {
    return <Navigate to="/dashboard" replace />;
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Terminée';
      case 'expired': return 'Expirée';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non spécifiée';
    try {
      return new Date(dateString + 'T00:00:00').toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
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
            Gestion des ordonnances
          </h1>
          <p className="text-gray-600">
            Créez et gérez les ordonnances de vos patients
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
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border-0 shadow-lg bg-white/80 backdrop-blur-xl"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-0 shadow-lg bg-white/80 backdrop-blur-xl">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Terminée</SelectItem>
                <SelectItem value="expired">Expirée</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={patientFilter} onValueChange={setPatientFilter}>
              <SelectTrigger className="border-0 shadow-lg bg-white/80 backdrop-blur-xl">
                <SelectValue placeholder="Patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les patients</SelectItem>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle ordonnance
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle ordonnance</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient">Patient *</Label>
                      <Select
                        value={prescriptionForm.patientId}
                        onValueChange={(value) => setPrescriptionForm(prev => ({ ...prev, patientId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.name} - {patient.species}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="date">Date de prescription *</Label>
                      <Input
                        type="date"
                        value={prescriptionForm.prescriptionDate}
                        onChange={(e) => setPrescriptionForm(prev => ({ ...prev, prescriptionDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes générales</Label>
                    <Textarea
                      placeholder="Notes sur l'ordonnance..."
                      value={prescriptionForm.notes}
                      onChange={(e) => setPrescriptionForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  {/* Médicaments */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-lg font-semibold">Médicaments</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPrescriptionItem}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un médicament
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {prescriptionForm.items.map((item, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Médicament {index + 1}</h4>
                            {prescriptionForm.items.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removePrescriptionItem(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Nom du médicament *</Label>
                              <Input
                                placeholder="Nom du médicament"
                                value={item.medicationName}
                                onChange={(e) => updatePrescriptionItem(index, 'medicationName', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label>Dosage *</Label>
                              <Input
                                placeholder="ex: 500mg"
                                value={item.dosage}
                                onChange={(e) => updatePrescriptionItem(index, 'dosage', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label>Fréquence *</Label>
                              <Input
                                placeholder="ex: 2 fois par jour"
                                value={item.frequency}
                                onChange={(e) => updatePrescriptionItem(index, 'frequency', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label>Durée *</Label>
                              <Input
                                placeholder="ex: 7 jours"
                                value={item.duration}
                                onChange={(e) => updatePrescriptionItem(index, 'duration', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label>Quantité</Label>
                              <Input
                                type="number"
                                placeholder="1"
                                value={item.quantity}
                                onChange={(e) => updatePrescriptionItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              />
                            </div>
                            
                            <div>
                              <Label>Unité</Label>
                              <Input
                                placeholder="comprimé"
                                value={item.unit}
                                onChange={(e) => updatePrescriptionItem(index, 'unit', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <Label>Instructions spéciales</Label>
                            <Textarea
                              placeholder="Instructions particulières..."
                              value={item.instructions}
                              onChange={(e) => updatePrescriptionItem(index, 'instructions', e.target.value)}
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreatePrescription}
                    disabled={!prescriptionForm.patientId || prescriptionForm.items.some(item => 
                      !item.medicationName || !item.dosage || !item.frequency || !item.duration
                    )}
                  >
                    Créer l'ordonnance
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total', value: prescriptions.length, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { label: 'Actives', value: prescriptions.filter(p => p.status === 'active').length, icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-50' },
            { label: 'Terminées', value: prescriptions.filter(p => p.status === 'completed').length, icon: User, color: 'text-purple-600', bgColor: 'bg-purple-50' },
            { label: 'Expirées', value: prescriptions.filter(p => p.status === 'expired').length, icon: Stethoscope, color: 'text-red-600', bgColor: 'bg-red-50' }, 
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

        {/* Liste des ordonnances */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#4F7AF4]">
                Ordonnances ({filteredPrescriptions.length})
              </h2>
            </div>
            
            <div className="p-6">
              {filteredPrescriptions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Aucune ordonnance trouvée</p>
                  <p className="text-sm">Ajustez vos filtres ou créez une nouvelle ordonnance</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPrescriptions.map((prescription) => (
                    <motion.div
                      key={prescription.id}
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
                              <h3 className="font-semibold text-gray-900">
                                {prescription.items && prescription.items.length > 0 
                                  ? prescription.items[0].medication_name 
                                  : 'Médicament non spécifié'}
                              </h3>
                              <Badge className={`${getStatusColor(prescription.status)} border`}>
                                {getStatusLabel(prescription.status)}
                              </Badge>
                            </div>
                            
                            {/* Affichage des médicaments */}
                            {prescription.items && prescription.items.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600">
                                  <strong>Médicaments:</strong> {prescription.items.map(item => item.medication_name).join(', ')}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {prescription.patient?.name || 'Patient inconnu'}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(prescription.prescription_date)}
                              </div>
                            </div>
                            
                            {prescription.notes && (
                              <p className="text-sm text-gray-500 mt-1">
                                <strong>Notes:</strong> {prescription.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <PrescriptionActions prescription={prescription} />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/practitioner/prescriptions/${prescription.id}/edit`)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            Modifier
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

export default PrescriptionsPage;
