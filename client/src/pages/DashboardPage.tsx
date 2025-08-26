import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Video,
  Calendar,
  Users,
  Plus,
  PawPrint,
  ClipboardList,
  Stethoscope,
  MessageCircle,
  Search,
  Grid,
  HeartPulse,
  Dog,
  Pill,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchConsultations,
  fetchConsultationStats,
} from "@/app/reducers/ConsultationReducer";
import { fetchPatients } from "@/app/reducers/PatientsReducer";
import { fetchPrescriptions } from "@/app/reducers/PrescriptionsReducer";
import { motion } from "framer-motion";
import PetCharacter from "@/assets/images/pet_character.svg";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import SidebarClients from "@/components/core/clients/SidebarClients";



// Fonction utilitaire pour formater la date en français
const formatNextAppointmentDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return 'Date non définie';
  }
};

// Couleurs pour les types d'animaux
const animalColors = {
  "Chien": { bg: "bg-[#EAF1FF]", icon: "text-[#7A90C3]" },
  "Chat": { bg: "bg-[#FFF6E9]", icon: "text-[#F4A259]" },
  "Lapin": { bg: "bg-[#F3E6FD]", icon: "text-[#A259F4]" },
  "Oiseau": { bg: "bg-[#E6F7E6]", icon: "text-[#3CB371]" },
  "default": { bg: "bg-[#F0F0F0]", icon: "text-[#666666]" }
};

const sidebarIcons = [
  { icon: PawPrint, path: "/", label: "Dashboard" },
  { icon: ClipboardList, path: "/appointments", label: "Rendez-vous" },
  { icon: Users, path: "/patients", label: "Patients" },
  { icon: MessageCircle, path: "/messages", label: "Messages" },
];
const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    consultations,
    stats: serverStats,
    isLoading: consultationsLoading,
    error: consultationsError,
  } = useAppSelector((state) => state.consultations);
  const { patients, isLoading: patientsLoading, error: patientsError } = useAppSelector((state) => state.patients);
  const { prescriptions: prescriptionsData, isLoading: prescriptionsLoading, error: prescriptionsError } = useAppSelector((state) => state.prescriptions);
  const { user } = useAppSelector((state) => state.auth);

  const quickActions = [
    {
      icon: Calendar,
      label: "Mes rendez-vous",
      color: "bg-[#FDE7EF]",
      iconColor: "text-[#F44F7A]",
      hover: "hover:bg-[#FBC2D7]",
      onClick: () => navigate("/appointments"),
    },
    {
      icon: Users,
      label: "Mes animaux",
      color: "bg-[#E6F7E6]",
      iconColor: "text-[#3CB371]",
      hover: "hover:bg-[#B6EFC6]",
      onClick: () => navigate("/patients"),
    },
    {
      icon: HeartPulse,
      label: "Mes ordonnances",
      color: "bg-[#E6F0FD]",
      iconColor: "text-[#4F7AF4]",
      hover: "hover:bg-[#B6C8FB]",
      onClick: () => navigate("/prescriptions"),
    },
    {
      icon: ClipboardList,
      label: "Mes documents",
      color: "bg-[#FFF6E5]",
      iconColor: "text-[#F4A259]",
      hover: "hover:bg-[#FFE1B6]",
      onClick: () => navigate("/documents"),
    },
    {
      icon: MessageCircle,
      label: "Conseils santé",
      color: "bg-[#F3E6FD]",
      iconColor: "text-[#A259F4]",
      hover: "hover:bg-[#E1B6FB]",
      onClick: () => navigate('/health-advice')
    },
    {
      icon: Grid,
      label: "Plus",
      color: "bg-[#E6F6FA]",
      iconColor: "text-[#59C3F4]",
      hover: "hover:bg-[#B6E6FB]",
    },
  ];

  useEffect(() => {
    dispatch(fetchConsultations());
    dispatch(fetchPatients());
    dispatch(fetchPrescriptions());
    if (user?.role_id === 2) {
      dispatch(fetchConsultationStats());
    }
  }, [dispatch, user?.role_id]);

  // Calculer le prochain rendez-vous depuis les consultations
  const nextAppointment = consultations
    .filter(c => c.status === 'pending' && new Date(c.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Créer la liste des animaux depuis les patients
  const animals = patients.map(patient => {
    const colors = animalColors[patient.species as keyof typeof animalColors] || animalColors.default;
    return {
      id: patient.id,
      name: patient.name,
      type: patient.species,
      color: colors.bg,
      iconColor: colors.icon,
    };
  });

  // Date du jour en français
  const today = new Date();
  const dateLocale = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
          Une erreur est survenue lors du chargement des données: {consultationsError || patientsError || prescriptionsError}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] flex relative overflow-x-hidden">
        {/* Bulles pastel décoratives */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#F4A259]/20 rounded-full blur-3xl z-0"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#A259F4]/20 rounded-full blur-3xl z-0"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-0 left-1/3 w-[200px] h-[200px] bg-[#4F7AF4]/10 rounded-full blur-2xl z-0"
        />
        {/* Sidebar */}
        <SidebarClients />


        {/* Main content */}
        <div className="flex-1 flex flex-row gap-8 p-8 z-10">
          {/* Centre */}
          <div className="flex-1 flex flex-col gap-8 w-full">
            {/* Header modernisé */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-row items-center justify-between w-full mb-2 px-2 py-4 rounded-3xl bg-white/60 shadow-lg backdrop-blur-xl border border-gray-100"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#4F7AF4]">
                  Bonjour{" "}
                  {user?.profile?.firstName || user?.name || "Utilisateur"} 👋
                </span>
                <span className="text-sm text-[#7A90C3] font-medium mt-1">
                  {dateLocale.charAt(0).toUpperCase() + dateLocale.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-100 w-[320px]">
                  <Search className="w-5 h-5 text-[#F4A259]" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="bg-transparent outline-none text-gray-700 px-2 py-1 w-full"
                  />
                </div>
                <Avatar>
                  <AvatarImage
                    src={user?.profile?.avatar || undefined}
                    alt={user?.profile?.firstName || user?.name || "Avatar"}
                  />
                  <AvatarFallback>
                    {(user?.profile?.firstName || user?.name || "U")[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.div>

            {/* Quick actions glassmorphism + tooltips */}
            <div className="w-full flex justify-between items-center gap-4 py-2">
              {quickActions.map((action, idx) => (
                <Tooltip key={action.label}>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ y: -8, scale: 1.1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={action.onClick}
                      className={`flex flex-col items-center justify-center flex-1 max-w-[140px] h-32 rounded-3xl shadow-lg ${action.color} ${action.hover} transition-all cursor-pointer group border-0 backdrop-blur-xl bg-opacity-70 border border-white/30 relative overflow-hidden`}
                      style={{ minWidth: 0 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          repeatType: "loop",
                          delay: idx * 0.1,
                        }}
                        className={`w-14 h-14 flex items-center justify-center rounded-full mb-2 shadow ${action.color} ${action.iconColor} bg-opacity-80 group-hover:scale-110 transition-transform text-3xl`}
                      >
                        <action.icon
                          className={`w-8 h-8 ${action.iconColor}`}
                        />
                      </motion.div>
                      <span className="text-sm font-bold text-gray-800 text-center mt-1 leading-tight">
                        {action.label}
                      </span>
                      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#F4A259]/30 via-transparent to-[#4F7AF4]/30 blur-lg opacity-60" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>{action.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Card "Consultez un vétérinaire en ligne" modernisée */}
            <Card className="w-full flex flex-row items-stretch gap-6 bg-gradient-to-br from-[#E6F0FD] via-[#FDE7EF]/60 to-[#F4A259]/10 rounded-3xl shadow-2xl p-14 min-h-[340px] relative overflow-hidden border-0 backdrop-blur-xl">
              <div className="flex-1 flex flex-col justify-center h-full z-10">
                <span className="text-[#4F7AF4] font-medium mb-2 text-lg">
                  Bienvenue 👋
                </span>
                <h2 className="text-4xl font-extrabold text-[#4F7AF4] mb-4 leading-tight">
                  Consultez un vétérinaire en ligne
                </h2>
                <p className="text-lg text-[#4F7AF4] mb-6">
                  Prenez rendez-vous en quelques clics pour votre animal, où que
                  vous soyez. Consultation vidéo, suivi sécurisé, conseils
                  personnalisés.
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white font-bold rounded-2xl shadow hover:shadow-lg transition-all text-lg group px-8 py-3"
                    onClick={() => navigate('/book-appointment')}
                  >
                    Prendre rendez-vous
                    <Badge
                      variant="secondary"
                      className="ml-3 bg-[#F44F7A] text-white px-3 py-1 rounded-full animate-pulse"
                    >
                      Nouveau
                    </Badge>
                  </Button>
                </div>
              </div>
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="flex-1 flex items-center justify-end h-full z-20"
              >
                <img
                  src={PetCharacter}
                  alt="Téléconsultation vétérinaire"
                  className="w-[28rem] h-auto drop-shadow-xl"
                />
              </motion.div>
              {/* Décorations modernes : cercles, ellipses, bulles, dégradés */}
              <div className="absolute right-16 top-8 w-64 h-64 bg-gradient-to-br from-[#FDE7EF]/60 to-[#E6F0FD]/60 rounded-full blur-2xl z-0" />
              <div className="absolute right-0 bottom-0 w-96 h-60 bg-[#A259F4]/10 rounded-full blur-3xl z-0 rotate-12" />
              <div className="absolute left-0 bottom-0 w-40 h-32 bg-[#4F7AF4]/10 rounded-full blur-2xl z-0" />
              <div className="absolute left-24 top-0 w-24 h-16 bg-[#F4A259]/20 rounded-full blur-xl z-0 rotate-[-20deg]" />
              <div className="absolute right-40 bottom-20 w-20 h-20 bg-[#3CB371]/10 rounded-full blur-lg z-0" />
              <div className="absolute left-1/2 top-1/2 w-32 h-12 bg-[#F44F7A]/10 rounded-full blur-2xl z-0 rotate-12" />
              <motion.div
                animate={{ x: [0, 40, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut",
                }}
                className="absolute left-1/3 top-1/4 w-32 h-8 bg-gradient-to-r from-[#F4A259]/30 to-[#4F7AF4]/30 rounded-full blur-2xl z-0 opacity-60"
              />
            </Card>

            {/* Statistiques patient modernisées */}
            <div className="flex flex-row gap-6 w-full items-stretch">
              <Card className="bg-[#EAF1FF]/80 rounded-3xl p-8 flex flex-col shadow-lg min-h-[180px] w-1/2 border-0 backdrop-blur-xl relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#7A90C3]">
                    Prochain rendez-vous
                  </span>
                  <span className="text-xs text-gray-400">À venir</span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-start mt-2">
                  {nextAppointment ? (
                    <>
                      <span className="text-lg font-bold text-[#7A90C3] mb-1">
                        {formatNextAppointmentDate(nextAppointment.date)} à {nextAppointment.time}
                      </span>
                      <span className="text-base text-gray-700">
                        Avec <b>Dr. {nextAppointment.practitioner?.user?.name || 'Vétérinaire'}</b> pour{" "}
                        <b>{nextAppointment.patient?.name || nextAppointment.patientName || 'Patient'}</b>
                      </span>
                      <span className="text-sm text-gray-500 mt-2">
                        {nextAppointment.type}
                      </span>
                      <Button className="mt-6 px-6 py-3 bg-gradient-to-r from-[#7A90C3] to-[#F4A259] text-white font-bold rounded-xl shadow hover:shadow-lg transition-all text-base flex items-center gap-2" onClick={() => navigate('/join-consultation')}>
                        <Video className="w-5 h-5 mr-1" /> Rejoindre la
                        téléconsultation
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-bold text-[#7A90C3] mb-1">
                        Aucun rendez-vous à venir
                      </span>
                      <span className="text-base text-gray-700">
                        Prenez rendez-vous pour votre animal
                      </span>
                      <Button className="mt-6 px-6 py-3 bg-gradient-to-r from-[#7A90C3] to-[#F4A259] text-white font-bold rounded-xl shadow hover:shadow-lg transition-all text-base flex items-center gap-2" onClick={() => navigate('/book-appointment')}>
                        <Calendar className="w-5 h-5 mr-1" /> Prendre rendez-vous
                      </Button>
                    </>
                  )}
                </div>
                {/* Badge aujourd'hui si besoin */}
                {/* <Badge variant="secondary" className="absolute top-6 right-8 bg-[#F44F7A] text-white px-3 py-1 rounded-full">Aujourd'hui</Badge> */}
              </Card>
              <Separator
                orientation="vertical"
                className="mx-2 bg-[#F4A259]/20 w-[2px] rounded-full"
              />
              <Card className="bg-[#FFF6E9]/80 rounded-3xl p-8 flex flex-col shadow-lg min-h-[180px] w-1/2 border-0 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-[#F4A259]">
                    Mes animaux
                  </span>
                  <span className="text-xs text-[#F4A259] font-bold">
                    {animals.length} enregistrés
                  </span>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {animals.map((animal, idx) => (
                    <motion.div
                      whileHover={{
                        scale: 1.07,
                        boxShadow: "0 4px 24px #F4A25933",
                      }}
                      key={idx}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow bg-white min-w-[110px] min-h-[120px] ${animal.color}`}
                      style={{ flex: "1 1 110px", maxWidth: "120px" }}
                    >
                      <Dog className={`w-8 h-8 mb-2 ${animal.iconColor}`} />
                      <span className="font-bold text-gray-800 text-base mb-1">
                        {animal.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {animal.type}
                      </span>
                    </motion.div>
                  ))}
                  <motion.button
                    whileHover={{
                      scale: 1.07,
                      boxShadow: "0 4px 24px #F4A25933",
                    }}
                    onClick={() => navigate('/patients')}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl shadow bg-white min-w-[110px] min-h-[120px] border-2 border-dashed border-[#F4A259] hover:bg-[#F4A259]/10 transition-all cursor-pointer"
                    style={{ flex: "1 1 110px", maxWidth: "120px" }}
                  >
                    <Plus className="w-8 h-8 mb-2 text-[#F4A259]" />
                    <span className="font-bold text-[#F4A259] text-base mb-1">
                      Ajouter
                    </span>
                    <span className="text-xs text-[#F4A259]">un animal</span>
                  </motion.button>
                </div>
              </Card>
            </div>
          </div>

          {/* Colonne droite sticky, toute hauteur, harmonisée, fond pastel glass */}
          <div className="w-[480px] flex flex-col gap-8 h-[calc(100vh-48px)] sticky top-8 z-10">
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-[#7A90C3] mb-2">
                Espace santé
              </h2>
            </div>
            {/* Mes ordonnances */}
            <Card className="bg-[#EAF1FF]/80 rounded-3xl shadow-lg p-8 border-0 w-full flex-1 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#7A90C3]">
                  Mes ordonnances
                </h3>
                <button
                  onClick={() => navigate('/prescriptions')}
                  className="text-[#7A90C3] text-base font-medium hover:underline cursor-pointer"
                >
                  Tout voir
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {prescriptionsData.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Aucune ordonnance</p>
                  </div>
                ) : (
                  prescriptionsData.slice(0, 4).map((presc, idx) => (
                    <div
                      key={presc.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#7A90C3]/10 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#7A90C3]/20 flex items-center justify-center">
                        <Pill className="w-6 h-6 text-[#7A90C3]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-base">
                          {presc.items[0]?.medicationName || 'Médicament'} - {presc.patient?.name || 'Patient'}
                        </p>
                        <p className="text-sm text-[#7A90C3]">
                          {presc.practitioner?.name || 'Dr.'} • {new Date(presc.prescriptionDate + 'T00:00:00').toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Besoin d'aide ? */}
            <Card className="bg-[#FFF6E9]/80 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border-0 w-full flex-1 mt-0 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-[#F4A259] mb-2">
                Besoin d'aide ?
              </h3>
              <p className="text-gray-700 mb-4 text-base">
                Contactez un vétérinaire en un clic pour toute question urgente
                ou pour un conseil santé.
              </p>
              <img
                src={require("@/assets/images/call_vet.svg").default}
                alt="Contacter un vétérinaire"
                className="w-64 h-auto mb-6"
              />
              <Button
                size="lg"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#F4A259] to-[#7A90C3] text-white font-bold rounded-2xl shadow hover:shadow-lg transition-all text-lg group"
              >
                <Stethoscope className="w-6 h-6 mr-3" /> Contacter un
                vétérinaire
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardPage;
