import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Stethoscope,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchConsultations } from "@/app/reducers/ConsultationReducer";
import { fetchPatients } from "@/app/reducers/PatientsReducer";
import { fetchPrescriptions } from "@/app/reducers/PrescriptionsReducer";
import SidebarPractitioners from "@/components/core/practitioners/SidebarPractitioners";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PractitionerDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { consultations, isLoading: consultationsLoading, error: consultationsError } = useAppSelector((state) => state.consultations);
  const { patients, isLoading: patientsLoading, error: patientsError } = useAppSelector((state) => state.patients);
  const { prescriptions, isLoading: prescriptionsLoading, error: prescriptionsError } = useAppSelector((state) => state.prescriptions);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchConsultations());
    dispatch(fetchPatients());
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  if (consultationsLoading || patientsLoading || prescriptionsLoading) {
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

  if (consultationsError || patientsError || prescriptionsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600 bg-red-50 p-4 rounded-xl shadow-sm">
          Une erreur est survenue lors du chargement des données
        </div>
      </div>
    );
  }

  // Calculer les statistiques
  const todayConsultations = consultations.filter(apt => 
    new Date(apt.date).toDateString() === new Date().toDateString()
  );
  
  const pendingConsultations = consultations.filter(apt => apt.status === 'pending');
  const completedConsultations = consultations.filter(apt => apt.status === 'completed');
  const cancelledConsultations = consultations.filter(apt => apt.status === 'cancelled');

  const stats = [
          {
        title: "Consultations aujourd'hui",
        value: todayConsultations.length,
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "En attente",
        value: pendingConsultations.length,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      },
      {
        title: "Terminées",
        value: completedConsultations.length,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Annulées",
        value: cancelledConsultations.length,
        icon: TrendingUp,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
  ];

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
             Bonjour Dr. {user?.profile?.firstName || user?.name || "Praticien"} 👋
           </h1>
           <p className="text-gray-600">
             Voici un aperçu de vos consultations aujourd'hui
           </p>
        </motion.div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
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

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prochains rendez-vous */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#4F7AF4]">Prochaines consultations</h2>
                                 <Button
                   onClick={() => navigate('/practitioner/consultations')}
                   variant="outline"
                   size="sm"
                   className="text-[#4F7AF4] border-[#4F7AF4] hover:bg-[#4F7AF4] hover:text-white"
                 >
                   Voir tout
                 </Button>
              </div>
              
              <div className="space-y-4">
                                                  {consultations.slice(0, 5).map((consultation) => (
                   <div
                     key={consultation.id}
                     className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-[#4F7AF4]/20 rounded-full flex items-center justify-center">
                         <Calendar className="w-5 h-5 text-[#4F7AF4]" />
                       </div>
                       <div>
                         <p className="font-semibold text-gray-900">
                           {consultation.patient?.name || 'Patient'}
                         </p>
                         <p className="text-sm text-gray-600">
                           {new Date(consultation.date + 'T00:00:00').toLocaleDateString('fr-FR')} à {consultation.time}
                         </p>
                       </div>
                     </div>
                     <Badge
                       variant={
                         consultation.status === 'pending' ? 'secondary' :
                         consultation.status === 'completed' ? 'outline' : 'destructive'
                       }
                     >
                       {consultation.status === 'pending' ? 'En attente' :
                        consultation.status === 'completed' ? 'Terminé' : 'Annulé'}
                     </Badge>
                   </div>
                 ))}
                 
                                  {consultations.length === 0 && (
                   <div className="text-center py-8 text-gray-500">
                     <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                     <p>Aucune consultation pour le moment</p>
                   </div>
                 )}
              </div>
            </Card>
          </motion.div>

          {/* Actions rapides */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-xl border-0 shadow-lg">
              <h2 className="text-xl font-bold text-[#4F7AF4] mb-6">Actions rapides</h2>
              
              <div className="space-y-4">
                                                                  <Button
                                   onClick={() => navigate('/practitioner/consultations')}
                                   className="w-full bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                                 >
                                   <Calendar className="w-5 h-5 mr-2" />
                                   Gérer les consultations
                                 </Button>
                
                <Button
                  onClick={() => navigate('/practitioner/prescriptions')}
                  variant="outline"
                  className="w-full border-[#F4A259] text-[#F4A259] hover:bg-[#F4A259] hover:text-white font-bold py-4 rounded-xl"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Créer une ordonnance
                </Button>
                
                <Button
                  onClick={() => navigate('/practitioner/patients')}
                  variant="outline"
                  className="w-full border-[#3CB371] text-[#3CB371] hover:bg-[#3CB371] hover:text-white font-bold py-4 rounded-xl"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Voir mes patients
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Résumé des patients */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="p-6 bg-white/80 backdrop-blur-xl border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#4F7AF4]">Mes patients récents</h2>
              <Button
                onClick={() => navigate('/practitioner/patients')}
                variant="outline"
                size="sm"
                className="text-[#4F7AF4] border-[#4F7AF4] hover:bg-[#4F7AF4] hover:text-white"
              >
                Voir tout
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.slice(0, 6).map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/practitioner/patients/${patient.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4F7AF4]/20 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-[#4F7AF4]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.species}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PractitionerDashboardPage;
