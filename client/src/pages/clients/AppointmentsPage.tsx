import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  ChevronRight,
  Search,
  Filter,
  Plus,
  PawPrint,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchConsultations } from '@/app/reducers/ConsultationReducer';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Fonction utilitaire pour formater la date
const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'dd MMMM yyyy', { locale: fr });
  } catch {
    return dateString;
  }
};

// Fonction utilitaire pour obtenir le statut en français
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'en attente';
    case 'completed':
      return 'terminé';
    case 'cancelled':
      return 'annulé';
    default:
      return status;
  }
};

// Fonction utilitaire pour obtenir la couleur du badge selon le statut
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-[#F4A259]';
    case 'completed':
      return 'bg-[#4F7AF4]';
    case 'cancelled':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { consultations, isLoading, error } = useAppSelector(state => state.consultations);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchConsultations());
  }, [dispatch]);

  // Filtrer les consultations selon la recherche
  const filteredConsultations = consultations.filter(consultation => 
    (consultation.patient?.name || consultation.patientName || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer le prochain rendez-vous
  const nextAppointment = consultations
    .filter(c => c.status === 'pending' && new Date(c.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const daysUntilNext = nextAppointment 
    ? Math.ceil((new Date(nextAppointment.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F4A259] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] flex items-center justify-center">
        <div className="text-center text-red-600 bg-red-50 p-6 rounded-xl">
          <p>Erreur lors du chargement : {error}</p>
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
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] bg-clip-text text-transparent">
                      Mes rendez-vous
                    </h1>
                  </div>
                  <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                    Gérez vos rendez-vous vétérinaires, consultez l'historique et planifiez de nouvelles consultations pour vos animaux.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {daysUntilNext && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="hidden md:block"
                    >
                      <div className="flex items-center gap-2 bg-[#F4A259]/10 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-[#F4A259] animate-pulse" />
                        <span className="text-[#F4A259] font-medium">
                          Prochain RDV dans {daysUntilNext} jour{daysUntilNext > 1 ? 's' : ''}
                        </span>
                      </div>
                    </motion.div>
                  )}
                  <Button
                    className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white font-bold rounded-xl shadow hover:shadow-lg transition-all px-6 py-3"
                    onClick={() => navigate('/book-appointment')}
                  >
                    <Plus className="w-5 h-5 mr-2" /> Nouveau rendez-vous
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Barre de recherche et filtres */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
              <Search className="w-5 h-5 text-[#F4A259]" />
              <input 
                type="text" 
                placeholder="Rechercher un rendez-vous..." 
                className="bg-transparent outline-none text-gray-700 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtres
            </Button>
          </div>

          {/* Message si aucun rendez-vous */}
          {filteredConsultations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'Aucun rendez-vous trouvé pour cette recherche' : 'Aucun rendez-vous pour le moment'}
              </p>
            </div>
          )}

          {/* Liste des rendez-vous */}
          <div className="grid grid-cols-1 gap-6">
            {filteredConsultations.map((consultation) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    {/* Date et heure */}
                    <div className="flex flex-col items-center justify-center bg-[#EAF1FF] rounded-2xl p-4 min-w-[100px]">
                      <Calendar className="w-6 h-6 text-[#4F7AF4] mb-2" />
                      <span className="text-sm font-medium text-[#4F7AF4]">{formatDate(consultation.date)}</span>
                      <span className="text-lg font-bold text-[#4F7AF4]">{consultation.time}</span>
                    </div>

                    {/* Informations du rendez-vous */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{consultation.type}</h3>
                          <Badge variant="default" className={getStatusColor(consultation.status)}>
                            {getStatusLabel(consultation.status)}
                          </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{consultation.notes || 'Aucune note'}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {consultation.practitioner?.user?.name?.[0] || 'V'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              Dr. {consultation.practitioner?.user?.name || 'Vétérinaire'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {consultation.practitioner?.speciality || 'Vétérinaire généraliste'}
                            </p>
                          </div>
                        </div>
                        <Separator orientation="vertical" className="h-8" />
                        <div className="flex items-center gap-2">
                          <PawPrint className="w-5 h-5 text-[#F4A259]" />
                          <span className="text-gray-700">{consultation.patient?.name || consultation.patientName || 'Patient inconnu'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3">
                    {consultation.type === "Téléconsultation" ? (
                      <Button className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white">
                        <Video className="w-5 h-5 mr-2" /> Rejoindre
                      </Button>
                    ) : (
                      <Button variant="outline" className="border-[#4F7AF4] text-[#4F7AF4]">
                        <MapPin className="w-5 h-5 mr-2" /> Voir l'adresse
                      </Button>
                    )}
                    <Button variant="ghost" className="text-gray-500 hover:text-[#4F7AF4]">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AppointmentsPage;
