import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchConsultations, updateConsultation, deleteConsultation } from "@/app/reducers/ConsultationReducer";
import SidebarPractitioners from "@/components/core/practitioners/SidebarPractitioners";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ConsultationsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { consultations, isLoading, error } = useAppSelector((state) => state.consultations);
  const { user } = useAppSelector((state) => state.auth);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchConsultations());
  }, [dispatch]);

  const handleStatusUpdate = async (consultationId: number, newStatus: string, notes?: string) => {
    try {
      await dispatch(updateConsultation({ id: consultationId, data: { status: newStatus as any, notes } })).unwrap();
      setIsEditDialogOpen(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDelete = async (consultationId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      try {
        await dispatch(deleteConsultation(consultationId)).unwrap();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmé';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

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
            Gestion des consultations
          </h1>
          <p className="text-gray-600">
            Gérez vos consultations et suivez vos patients
          </p>
        </motion.div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total', value: consultations.length, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { label: 'En attente', value: consultations.filter(apt => apt.status === 'pending').length, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
            { label: 'Terminées', value: consultations.filter(apt => apt.status === 'completed').length, color: 'text-green-600', bgColor: 'bg-green-50' },
            { label: 'Annulées', value: consultations.filter(apt => apt.status === 'cancelled').length, color: 'text-purple-600', bgColor: 'bg-purple-50' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-xl border-0 shadow-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Liste des rendez-vous */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#4F7AF4]">Tous les rendez-vous</h2>
            </div>
            
            <div className="p-6">
              {consultations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Aucune consultation pour le moment</p>
                  <p className="text-sm">Les consultations apparaîtront ici une fois créées</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <motion.div
                      key={consultation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#4F7AF4]/20 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-[#4F7AF4]" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {consultation.patient?.name || 'Patient inconnu'}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {consultation.patient?.species || 'Espèce inconnue'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(consultation.date + 'T00:00:00').toLocaleDateString('fr-FR')} à {consultation.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Stethoscope className="w-4 h-4" />
                              {consultation.type === 'video' ? 'Téléconsultation' : 'Consultation physique'}
                            </div>
                          </div>
                          
                          {consultation.notes && (
                            <p className="text-sm text-gray-500 mt-1">
                              <strong>Notes:</strong> {consultation.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(consultation.status)} border`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(consultation.status)}
                            {getStatusLabel(consultation.status)}
                          </div>
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Dialog open={isEditDialogOpen && editingAppointment?.id === consultation.id} onOpenChange={(open) => {
                            if (open) {
                              setEditingAppointment(consultation);
                              setIsEditDialogOpen(true);
                            } else {
                              setIsEditDialogOpen(false);
                              setEditingAppointment(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Modifier la consultation</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Statut
                                  </label>
                                  <Select
                                    value={editingAppointment?.status || consultation.status}
                                    onValueChange={(value) => setEditingAppointment({ ...editingAppointment, status: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">En attente</SelectItem>
                                      <SelectItem value="completed">Terminé</SelectItem>
                                      <SelectItem value="cancelled">Annulé</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                  </label>
                                  <Textarea
                                    value={editingAppointment?.notes || consultation.notes || ''}
                                    onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
                                    placeholder="Ajouter des notes..."
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsEditDialogOpen(false);
                                      setEditingAppointment(null);
                                    }}
                                  >
                                    Annuler
                                  </Button>
                                  <Button
                                    onClick={() => handleStatusUpdate(
                                      consultation.id,
                                      editingAppointment?.status || consultation.status,
                                      editingAppointment?.notes || consultation.notes
                                    )}
                                  >
                                    Mettre à jour
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(consultation.id)}
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

export default ConsultationsPage;
