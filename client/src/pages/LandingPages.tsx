import Avis from '@/components/services/landing/Avis';
import Conseils from '@/components/services/landing/Conseils';
import Footer from '@/components/services/landing/Footer';
import Header from '@/components/services/landing/Header';
import Hero from '@/components/services/landing/Hero';
import LoadingScreen from '@/components/services/landing/LoadingScreen';
import React, { useState, useEffect, ElementType } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPages: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);

  const AnimatePresenceFixedType = AnimatePresence as ElementType;

  useEffect(() => {
    // Précharger les images et ressources
    const preloadImages = async () => {
      const images = [
        '/img/logo.svg',
        '/img/veterinaire.png',
        // Ajoutez ici toutes les images utilisées dans la landing page
      ];

      const imagePromises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsContentReady(true);
      } catch (error) {
        console.error('Erreur lors du préchargement des images:', error);
        setIsContentReady(true); // On continue même en cas d'erreur
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    // Attendre que le contenu soit prêt avant de cacher le loading
    if (isContentReady) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // On garde le loading un peu plus longtemps pour une meilleure UX

      return () => clearTimeout(timer);
    }
  }, [isContentReady]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans bg-white">
      <AnimatePresenceFixedType mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
      {/* Header */}
            <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} handleScrollTop={handleScrollTop} />

            {/* Hero Section */}
            <Hero />

            {/* Conseils */}
            <Conseils navigate={navigate} />

            {/* À propos de nous */}
            <section className="relative px-4 md:px-16 py-16 md:py-24 bg-gradient-to-b from-white to-gray-50" id="about">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex-1"
                  >
                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="absolute -top-6 -left-6 w-12 h-12 bg-[#F4A259]/10 rounded-full"
                      />
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-extrabold mb-6 text-black relative"
                  style={{fontFamily:'inherit'}}
                >
                  À propos de nous
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          viewport={{ once: true }}
                          className="absolute -bottom-2 left-0 h-1 bg-[#F4A259] rounded-full"
                        />
                      </motion.h2>
                    </div>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="text-gray-600 text-lg leading-relaxed space-y-4"
                    >
                      <span className="block">
                        PawMed est née d'une vision simple : rendre les soins vétérinaires accessibles à tous les propriétaires d'animaux. Notre plateforme de téléconsultation connecte les propriétaires d'animaux avec des vétérinaires qualifiés, permettant des consultations rapides et efficaces depuis le confort de votre foyer.
                      </span>
                      <span className="block">
                        Fondée par une équipe passionnée de vétérinaires, PawMed s'engage à révolutionner les soins vétérinaires en France. Notre mission est de réduire le stress des consultations pour les animaux et leurs propriétaires, tout en garantissant des soins de qualité et un suivi personnalisé.
                      </span>
                    </motion.p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex-1 relative"
                  >
                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="absolute -top-6 -right-6 w-12 h-12 bg-[#7A90C3]/10 rounded-full"
                      />
                      <motion.img
                        src="img/veterinaire.png"
                        alt="Vétérinaire"
                        className="w-full max-w-[480px] h-auto object-cover rounded-2xl shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#F4A259]/10 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👨‍⚕️</span>
            </div>
                          <div>
                            <p className="font-bold text-[#7A90C3]">+500</p>
                            <p className="text-sm text-gray-600">Vétérinaires qualifiés</p>
          </div>
        </div>
                      </motion.div>
        </div>
                  </motion.div>
                </div>
        </div>
      </section>

      {/* Avis */}
            <Avis />

      {/* Footer */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresenceFixedType>
    </div>
  );
};

export default LandingPages;
