import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, User, PawPrint, ArrowLeft, LogOut, Bot, User as UserIcon } from "lucide-react";
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/app/reducers/AuthReducers';

const JoinConsultationPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [chatHistory, setChatHistory] = React.useState<{ sender: 'bot' | 'user', text: string }[]>([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [isChatFinished, setIsChatFinished] = React.useState(false);

  // Questions prédéfinies
  const presetQuestions = [
    {
      id: "symptoms",
      question: "Quels sont les symptômes de votre animal ?",
      options: ["Perte d'appétit", "Fatigue", "Douleurs", "Changement de comportement", "Autre"]
    },
    {
      id: "duration",
      question: "Depuis combien de temps observez-vous ces symptômes ?",
      options: ["Aujourd'hui", "Quelques jours", "Une semaine", "Plus d'une semaine"]
    },
    {
      id: "medication",
      question: "Votre animal prend-il des médicaments actuellement ?",
      options: ["Oui", "Non"]
    }
  ];

  React.useEffect(() => {
    // Démarre le chat avec la première question
    if (chatHistory.length === 0) {
      setChatHistory([{ sender: 'bot', text: presetQuestions[0].question }]);
    }
  }, []);

  const handleUserAnswer = (answer: string) => {
    const question = presetQuestions[currentQuestion];
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: answer }
    ]);
    setAnswers(prev => ({ ...prev, [question.id]: answer }));

    // Passe à la question suivante ou termine
    if (currentQuestion < presetQuestions.length - 1) {
      const nextQuestion = presetQuestions[currentQuestion + 1];
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          { sender: 'bot', text: nextQuestion.question }
        ]);
        setCurrentQuestion(currentQuestion + 1);
      }, 600);
    } else {
      setTimeout(() => {
        setIsChatFinished(true);
      }, 600);
    }
  };

  // Données de la consultation (à remplacer par les vraies données)
  const consultation = {
    id: "200", // ID fixe pour la room de test
    date: "Vendredi 14 juin 2024",
    hour: "16:30",
    vet: "Dr. Martin",
    animal: "Médor",
    type: "Consultation vidéo",
    duration: "30 minutes",
    status: "En attente",
  };

  const handleJoinConsultation = () => {
    // Rediriger vers la page VideoChat avec l'ID de la consultation
    navigate(`/video-chat/${consultation.id}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Fonction utilitaire pour les classes de bulle de chat
  const getBubbleClass = (sender: 'bot' | 'user') =>
    sender === 'bot'
      ? 'relative rounded-2xl px-4 py-2 text-base max-w-[80%] shadow-md bg-[#EAF1FF] text-[#4F7AF4] rounded-bl-none before:content-[" "] before:absolute before:-left-2 before:bottom-2 before:w-3 before:h-3 before:bg-[#EAF1FF] before:rounded-br-2xl before:rounded-tl-2xl before:shadow-md'
      : 'relative rounded-2xl px-4 py-2 text-base max-w-[80%] shadow-md bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white rounded-br-none';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] flex items-center justify-center p-4">
      {/* Bulles décoratives */}
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

      <Card className="w-full max-w-2xl p-8 rounded-3xl shadow-2xl bg-white/70 border-0 backdrop-blur-xl relative z-10">
        <Button
          variant="ghost"
          className="absolute top-6 left-6 text-[#4F7AF4] hover:bg-[#4F7AF4]/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#4F7AF4] mb-2">
            Rejoindre la téléconsultation
          </h1>
          <p className="text-gray-600">
            Votre rendez-vous est prêt à commencer
          </p>
        </div>

        <div className="space-y-6">
          {/* Chatbot au lieu du questionnaire */}
          {!isChatFinished ? (
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto px-2 py-4 bg-[#F8FAFC]/80 rounded-2xl border border-[#EAF1FF] shadow-inner">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex items-end ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  {msg.sender === 'bot' && (
                    <div className="mr-2 flex-shrink-0">
                      <div className="w-8 h-8 bg-[#4F7AF4] rounded-full flex items-center justify-center shadow-md">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  <div className={getBubbleClass(msg.sender)}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#F44F7A] rounded-full flex items-center justify-center shadow-md">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* Afficher les options de réponse si pas fini */}
              <div className="flex justify-end mt-2">
                {presetQuestions[currentQuestion]?.options && (
                  <div className="flex flex-wrap gap-2">
                    {presetQuestions[currentQuestion].options.map(option => (
                      <Button
                        key={option}
                        variant="outline"
                        className="bg-white text-[#4F7AF4] border-[#4F7AF4] hover:bg-[#4F7AF4]/10"
                        onClick={() => handleUserAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Merci pour vos réponses !
                </h2>
                <p className="text-gray-600">
                  Vous pouvez maintenant accéder à la consultation.
                </p>
              </div>
              <Button
                className="w-full bg-[#4F7AF4] text-white mt-6"
                onClick={() => navigate(`/video-chat/${consultation.id}`)}
              >
                Continuer vers la consultation
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default JoinConsultationPage;
