import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  ArrowLeft,
  Save,
  Plus,
  X,
  Calendar,
  User,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchPrescription, updatePrescription } from "@/app/reducers/PrescriptionsReducer";
import { fetchPatients } from "@/app/reducers/PatientsReducer";
import SidebarPractitioners from "@/components/core/practitioners/SidebarPractitioners";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const EditPrescriptionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  
  const { currentPrescription, isLoading, error } = useAppSelector((state) => state.prescriptions);
  const { patients } = useAppSelector((state) => state.patients);
  const { user } = useAppSelector((state) => state.auth);
  
  const [prescriptionForm, setPrescriptionForm] = useState({
    status: 'active' as 'active' | 'completed' | 'expired',
    notes: '',
    items: [
      {
        id: 0,
        medication_name: '',
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
    if (id) {
      dispatch(fetchPrescription(parseInt(id)));
    }
    dispatch(fetchPatients());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPrescription) {
      setPrescriptionForm({
        status: currentPrescription.status,
        notes: currentPrescription.notes || '',
        items: currentPrescription.items.map(item => ({
          id: item.id,
          medication_name: item.medication_name,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          instructions: item.instructions || '',
          quantity: item.quantity,
          unit: item.unit
        }))
      });
    }
  }, [currentPrescription]);

  const updatePrescriptionItem = (index: number, field: string, value: any) => {
    setPrescriptionForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addPrescriptionItem = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      items: [...prev.items, {
        id: 0,
        medication_name: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    try {
      await dispatch(updatePrescription({ 
        id: parseInt(id), 
        data: prescriptionForm 
      })).unwrap();
      
      toast.success("Ordonnance mise à jour avec succès !");
      navigate('/practitioner/prescriptions');
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#4F7AF4] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!currentPrescription) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg text-gray-500">Ordonnance non trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SidebarPractitioners />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/practitioner/prescriptions')}
              className="text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Modifier l'ordonnance
              </h1>
              <p className="text-gray-600">
                Patient: {currentPrescription.patient?.name} - {currentPrescription.patient?.species}
              </p>
            </div>
          </motion.div>

          {/* Formulaire */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-lg">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient">Patient</Label>
                    <Input
                      value={`${currentPrescription.patient?.name} - ${currentPrescription.patient?.species}`}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date">Date de prescription</Label>
                    <Input
                      value={currentPrescription.prescription_date}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={prescriptionForm.status}
                    onValueChange={(value: 'active' | 'completed' | 'expired') => 
                      setPrescriptionForm(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Terminée</SelectItem>
                      <SelectItem value="expired">Expirée</SelectItem>
                    </SelectContent>
                  </Select>
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
                              value={item.medication_name}
                              onChange={(e) => updatePrescriptionItem(index, 'medication_name', e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label>Dosage *</Label>
                            <Input
                              placeholder="ex: 500mg"
                              value={item.dosage}
                              onChange={(e) => updatePrescriptionItem(index, 'dosage', e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label>Fréquence *</Label>
                            <Input
                              placeholder="ex: 2 fois par jour"
                              value={item.frequency}
                              onChange={(e) => updatePrescriptionItem(index, 'frequency', e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label>Durée *</Label>
                            <Input
                              placeholder="ex: 7 jours"
                              value={item.duration}
                              onChange={(e) => updatePrescriptionItem(index, 'duration', e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label>Quantité</Label>
                            <Input
                              type="number"
                              placeholder="1"
                              value={item.quantity}
                              onChange={(e) => updatePrescriptionItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              min="1"
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
                        
                        <div className="mt-4">
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

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/practitioner/prescriptions')}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditPrescriptionPage;
