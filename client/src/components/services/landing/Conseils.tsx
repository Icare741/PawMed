import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ConseilsProps = {
  navigate: (path: string) => void;
};

const Conseils: React.FC<ConseilsProps> = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
  };

  return (
    <section className="px-4 md:px-16 py-16 md:py-24 bg-white" id="conseils">
      {/* En-tête avec titre et barre de recherche */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="flex-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-extrabold text-black mb-4"
              style={{fontFamily:'inherit'}}
            >
              Nos derniers conseils
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600 text-lg"
            >
              Des conseils d'experts pour le bien-être de votre animal
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 max-w-xl"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un conseil..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F4A259] focus:border-transparent transition-all"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#F4A259] hover:bg-[#e08a2b] text-black rounded-full px-4 py-2"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Grille des conseils */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              image: "/img/conseil1.png",
              title: "Les signes d'urgence chez le chien",
              description: "Apprenez à reconnaître les symptômes qui nécessitent une intervention vétérinaire immédiate.",
              author: "Dr. Martin",
              date: "15/03/2025",
              path: "/articles/urgence-chien"
            },
            {
              image: "/img/conseil2.png",
              title: "L'hygiène dentaire du chat",
              description: "Découvrez comment prendre soin des dents de votre chat et prévenir les problèmes dentaires.",
              author: "Dr. Sophie",
              date: "10/03/2025",
              path: "/articles/hygiene-dentaire-chat"
            },
            {
              image: "/img/conseil3.png",
              title: "Le stress chez le lapin",
              description: "Comprendre et gérer le stress chez votre lapin pour une meilleure qualité de vie.",
              author: "Dr. Emma",
              date: "05/03/2025",
              path: "/articles/stress-lapin"
            },
            {
              image: "/img/conseil4.png",
              title: "L'éducation du chiot",
              description: "Les bases de l'éducation positive pour établir une relation de confiance avec votre chiot.",
              author: "Dr. Thomas",
              date: "01/03/2025",
              path: "/articles/education-chiot"
            }
          ].map((conseil, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#F4A259]/30"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={conseil.image}
                  alt={conseil.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-[#7A90C3] text-xs font-medium px-3 py-1 rounded-full">
                    {conseil.author.split(' ')[1]}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#F4A259]" />
                  <h3 className="text-xl font-bold text-[#7A90C3] line-clamp-2">
                    {conseil.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {conseil.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="font-medium text-[#7A90C3]">{conseil.author}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-[#F4A259] hover:text-[#e08a2b] p-0 h-auto group-hover:translate-x-1 transition-transform"
                    onClick={() => navigate(conseil.path)}
                  >
                    Lire la suite
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Conseils;
