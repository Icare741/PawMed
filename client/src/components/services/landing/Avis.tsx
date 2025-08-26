import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Avis: React.FC = () => {
  const avis = [
    {
      nom: "Julie Moreau",
      texte: "Service exceptionnel ! J'ai pu obtenir un rendez-vous en urgence pour mon chien qui présentait des symptômes inquiétants. Le vétérinaire a été très rassurant et les conseils suivis ont été efficaces.",
      note: 5,
      animal: "🐕"
    },
    {
      nom: "Marc Lefebvre",
      texte: "En tant que propriétaire de trois chats, j'apprécie particulièrement la possibilité de consulter plusieurs vétérinaires spécialisés. Les conseils sont toujours personnalisés et adaptés à chaque situation.",
      note: 5,
      animal: "🐱"
    },
    {
      nom: "Emma Petit",
      texte: "La qualité du suivi post-consultation est remarquable. J'ai reçu des rappels pour les traitements et des conseils personnalisés pour mon lapin. Un service vraiment au top !",
      note: 5,
      animal: "🐰"
    },
    {
      nom: "Lucas Bernard",
      texte: "PawMed m'a permis de gérer une situation d'urgence avec mon chien en pleine nuit. La rapidité et le professionnalisme de l'équipe ont fait toute la différence.",
      note: 5,
      animal: "🐕"
    }
  ];

  return (
    <section className="relative px-4 md:px-16 py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white" id="avis">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-black relative inline-block" style={{fontFamily:'inherit'}}>
            Vos avis
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute -bottom-2 left-0 h-1 bg-[#F4A259] rounded-full"
            />
          </h2>
          <p className="text-gray-600 text-lg">Découvrez ce que nos clients pensent de nos services</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {avis.map((avis, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#F4A259]/10 rounded-full" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#7A90C3]/10 rounded-full" />

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-[#F4A259]/30 transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{avis.animal}</span>
                  <Quote className="w-6 h-6 text-[#F4A259] opacity-50" />
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(avis.note)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#F4A259] fill-current" />
                  ))}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {avis.texte}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="font-bold text-[#7A90C3]">{avis.nom}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Avis;
