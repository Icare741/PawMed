import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Pill,
  Calendar,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchPrescriptions } from '@/app/reducers/PrescriptionsReducer';
import { Prescription } from '@/app/reducers/PrescriptionsReducer';
import PrescriptionActions from '@/components/services/prescriptions/PrescriptionActions';

const PrescriptionsPage = () => {
  const dispatch = useAppDispatch();
  const { prescriptions, isLoading, error } = useAppSelector((state) => state.prescriptions);

  useEffect(() => {
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  // Fonction pour formater la date en français
  const formatDate = (dateString: string) => {
    try {
      // Gérer le format YYYY-MM-DD de la base de données
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Date non définie';
    }
  };

  // Fonction pour obtenir le statut en français
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      case 'expired':
        return 'Expirée';
      default:
        return status;
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#3CB371]';
      case 'completed':
        return 'bg-[#F4A259]';
      case 'expired':
        return 'bg-[#FF6B6B]';
      default:
        return 'bg-gray-500';
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
          Une erreur est survenue lors du chargement des données: {error}
        </div>
      </div>
    );
  }

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
                      <Pill className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] bg-clip-text text-transparent">
                      Mes ordonnances
                    </h1>
                  </div>
                  <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                    Consultez et gérez toutes vos ordonnances vétérinaires. Téléchargez ou imprimez vos documents médicaux en quelques clics.
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
                      <span className="text-[#F4A259] font-medium">
                        {prescriptions.filter(p => p.status === 'active').length} ordonnance(s) active(s)
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Barre de recherche et filtres */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
              <Search className="w-5 h-5 text-[#F4A259]" />
              <input type="text" placeholder="Rechercher une ordonnance..." className="bg-transparent outline-none text-gray-700 w-full" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtres
            </Button>
          </div>

          {/* Liste des ordonnances en grille */}
          {prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune ordonnance</h3>
              <p className="text-gray-500">Vous n'avez pas encore d'ordonnances vétérinaires.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prescriptions.map((prescription: Prescription) => (
                <motion.div
                  key={prescription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-gray-100"
                >
                  {/* En-tête de l'ordonnance */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#EAF1FF]">
                        <Pill className="w-5 h-5 text-[#4F7AF4]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Ordonnance #{prescription.id}</h3>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{formatDate(prescription.prescriptionDate)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="default" className={getStatusColor(prescription.status)}>
                      {prescription.status === "active" ? (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {getStatusLabel(prescription.status)}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {getStatusLabel(prescription.status)}
                        </div>
                      )}
                    </Badge>
                  </div>

                  {/* Informations du vétérinaire */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-[#F8FAFC] rounded-xl">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{(prescription.practitioner?.name || 'V')[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{prescription.practitioner?.name || 'Vétérinaire'}</p>
                      <p className="text-sm text-gray-500">{prescription.practitioner?.speciality || 'Vétérinaire généraliste'}</p>
                    </div>
                  </div>

                  {/* Informations du patient */}
                  <div className="mb-4 p-3 bg-[#F8FAFC] rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Patient</p>
                    <p className="font-medium text-gray-900">{prescription.patient?.name || 'Patient'}</p>
                    <p className="text-sm text-gray-500">{prescription.patient?.species || 'Espèce non définie'}</p>
                  </div>

                  {/* Liste des médicaments */}
                  <div className="space-y-3 mb-4">
                    {prescription.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-xl">
                        <div className="p-2 rounded-lg bg-[#4F7AF4]/10">
                          <Pill className="w-4 h-4 text-[#4F7AF4]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.medicationName}</p>
                          <p className="text-sm text-gray-600">{item.dosage}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-[#F4A259]" />
                            <span className="text-xs text-[#F4A259]">{item.duration}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Fréquence: {item.frequency} • Quantité: {item.quantity} {item.unit}
                          </p>
                          {item.instructions && (
                            <p className="text-xs text-gray-600 mt-1 italic">{item.instructions}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notes si présentes */}
                  {prescription.notes && (
                    <div className="mb-4 p-3 bg-[#FFF6E9] rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{prescription.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <PrescriptionActions prescription={prescription} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PrescriptionsPage;
