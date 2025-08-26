import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, HeartPulse, Dog, Cat, Rabbit, Bird, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HealthAdvicePage: React.FC = () => {
  const navigate = useNavigate();

  const articles = [
    {
      title: "Urgences canines : les signes à ne pas ignorer",
      description: "Apprenez à reconnaître les signes d'urgence chez votre chien et comment réagir rapidement.",
      icon: Dog,
      color: "bg-[#EAF1FF]",
      iconColor: "text-[#7A90C3]",
      path: "/articles/urgence-chien",
      gradient: "from-[#7A90C3]/20 to-[#4F7AF4]/20"
    },
    {
      title: "L'hygiène dentaire de votre chat",
      description: "Guide complet pour maintenir une bonne santé bucco-dentaire chez votre chat.",
      icon: Cat,
      color: "bg-[#FFF6E9]",
      iconColor: "text-[#F4A259]",
      path: "/articles/hygiene-dentaire-chat",
      gradient: "from-[#F4A259]/20 to-[#F44F7A]/20"
    },
    {
      title: "Gérer le stress chez le lapin",
      description: "Conseils pratiques pour réduire l'anxiété et améliorer le bien-être de votre lapin.",
      icon: Rabbit,
      color: "bg-[#E6F7E6]",
      iconColor: "text-[#3CB371]",
      path: "/articles/stress-lapin",
      gradient: "from-[#3CB371]/20 to-[#4F7AF4]/20"
    },
    {
      title: "L'éducation du chiot : les bases",
      description: "Les fondamentaux pour bien éduquer votre chiot et établir une relation harmonieuse.",
      icon: Dog,
      color: "bg-[#F3E6FD]",
      iconColor: "text-[#A259F4]",
      path: "/articles/education-chiot",
      gradient: "from-[#A259F4]/20 to-[#F44F7A]/20"
    }
  ];

  const categories = [
    {
      title: "Conseils nutrition",
      description: "Alimentation équilibrée et besoins spécifiques",
      icon: HeartPulse,
      color: "bg-[#FDE7EF]",
      iconColor: "text-[#F44F7A]",
      gradient: "from-[#F44F7A]/20 to-[#F4A259]/20"
    },
    {
      title: "Soins préventifs",
      description: "Vaccinations, vermifuges et contrôles réguliers",
      icon: HeartPulse,
      color: "bg-[#E6F0FD]",
      iconColor: "text-[#4F7AF4]",
      gradient: "from-[#4F7AF4]/20 to-[#A259F4]/20"
    },
    {
      title: "Comportement",
      description: "Comprendre et gérer le comportement de votre animal",
      icon: MessageCircle,
      color: "bg-[#FFF6E5]",
      iconColor: "text-[#F4A259]",
      gradient: "from-[#F4A259]/20 to-[#F44F7A]/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] p-8 relative overflow-hidden">
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
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-0 left-1/3 w-[200px] h-[200px] bg-[#4F7AF4]/10 rounded-full blur-2xl z-0"
      />

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
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] bg-clip-text text-transparent">
                  Conseils Santé
                </h1>
              </div>
              <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                Des conseils pratiques et des articles pour prendre soin de votre animal. Découvrez nos guides experts et nos recommandations pour le bien-être de votre compagnon.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden md:block"
            >
              <div className="flex items-center gap-2 bg-[#F4A259]/10 p-3 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-[#F4A259] animate-pulse" />
                <span className="text-[#F4A259] font-medium">Nouveaux articles chaque semaine</span>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Articles récents */}
      <div className="mb-16 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#7A90C3]">Articles récents</h2>
          <Button variant="ghost" className="text-[#4F7AF4] hover:text-[#F44F7A] transition-colors">
            Voir tous les articles <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className={`p-6 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group bg-gradient-to-br ${article.gradient}`}
                onClick={() => navigate(article.path)}>
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`p-4 rounded-xl ${article.color} group-hover:scale-110 transition-transform duration-300`}>
                    <article.icon className={`w-8 h-8 ${article.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#4F7AF4] transition-colors">{article.title}</h3>
                    <p className="text-gray-600">{article.description}</p>
                  </div>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Catégories */}
      <div className="mb-16 relative z-10">
        <h2 className="text-2xl font-bold text-[#7A90C3] mb-8">Catégories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={`p-8 ${category.color} hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group bg-gradient-to-br ${category.gradient}`}>
                <div className="flex flex-col items-center text-center relative z-10">
                  <motion.div
                    className={`p-5 rounded-full bg-white mb-6 shadow-lg group-hover:shadow-xl transition-all`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <category.icon className={`w-10 h-10 ${category.iconColor}`} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#4F7AF4] transition-colors">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section d'aide */}
      <Card className="bg-gradient-to-br from-[#E6F0FD] via-[#FDE7EF]/60 to-[#F4A259]/10 p-12 rounded-3xl shadow-2xl relative overflow-hidden z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10"
        >
          <div className="flex-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] bg-clip-text text-transparent mb-6">
              Besoin de conseils personnalisés ?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Nos vétérinaires sont disponibles pour répondre à toutes vos questions et vous guider dans les soins de votre animal. Une consultation rapide et efficace pour la santé de votre compagnon.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#4F7AF4] to-[#F44F7A] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg px-8 py-6 group"
              onClick={() => navigate('/book-appointment')}
            >
              <span className="flex items-center gap-2">
                Consulter un vétérinaire
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 flex justify-center"
          >
            <img
              src="/img/veterinaire.png"
              alt="Vétérinaire conseil"
              className="w-80 h-auto drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
        {/* Effets décoratifs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4A259]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4F7AF4]/20 rounded-full blur-3xl" />
      </Card>
    </div>
  );
};

export default HealthAdvicePage;
