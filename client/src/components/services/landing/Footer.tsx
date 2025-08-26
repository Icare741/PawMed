import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Facebook, Instagram, Linkedin, Youtube, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'inscription à la newsletter
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#7A90C3] to-[#5A6F9C] pt-20 md:pt-24 pb-8 px-0 mt-20 md:mt-24 overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1 }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-white rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
      </div>

      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm rounded-[32px] md:rounded-[48px] px-8 md:px-12 py-12 md:py-16 flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12 relative shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex-1 min-w-[280px] md:min-w-[320px]"
        >
          <div className="relative">
            <img src="/img/logo.svg" alt="Pawmed" className="h-16 md:h-24 w-auto mb-6" />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute -bottom-2 left-0 h-1 bg-[#F4A259] rounded-full"
            />
          </div>
          <p className="text-lg md:text-2xl font-normal text-gray-800 mb-8">Rejoignez notre newsletter pour rester informés de nos derniers conseils.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Entrez votre email"
                className="w-full rounded-full border border-gray-200 pl-12 pr-4 py-3 md:py-4 text-base text-gray-800 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#F4A259] focus:border-transparent transition-all"
              />
            </div>
            <Button
              type="submit"
              className="bg-[#F4A259] hover:bg-[#e08a2b] text-black text-base font-medium rounded-full px-8 py-3 transition-all w-full sm:w-auto shadow-lg hover:shadow-xl hover:scale-105"
            >
              S'inscrire
            </Button>
          </form>
          <p className="text-gray-500 text-sm">En vous inscrivant, vous acceptez notre politique de confidentialité et consentez à recevoir des mises à jour de notre société.</p>
        </motion.div>

        <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-12 justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-lg text-gray-800 mb-4">Parent d'animaux</h3>
            <ul className="space-y-3">
              {['Nos conseils', 'Trouver son vétérinaire', 'Prise en main plateforme', 'Contacter nos commerciaux', 'FAQ'].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#F4A259] transition-colors cursor-pointer group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-lg text-gray-800 mb-4">Vétérinaire</h3>
            <ul className="space-y-3">
              {['Créer sa fiche', 'Gérer ses rendez-vous', 'Prise en main plateforme', 'Contacter nos commerciaux', 'FAQ'].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#F4A259] transition-colors cursor-pointer group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-lg text-gray-800 mb-4">Suivez-nous</h3>
            <ul className="space-y-4">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Youtube, label: 'Youtube' }
              ].map((social, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-gray-600 hover:text-[#F4A259] transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#F4A259]/10 transition-colors">
                    <social.icon className="w-4 h-4" />
                  </div>
                  {social.label}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-8 md:px-12 mt-8"
      >
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center text-white text-sm gap-4">
          <span>© 2025 Pawmed. Tous droits réservés.</span>
          <div className="flex flex-wrap justify-center gap-6">
            {['Mentions légales', 'Politique de confidentialité', 'Conditions générales', 'Réglage des cookies'].map((item, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ y: -2 }}
                className="hover:text-[#F4A259] transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
