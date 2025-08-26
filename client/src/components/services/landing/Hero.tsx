import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Clock, Sparkles, Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="w-full min-h-[600px] flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-[#7A90C3] to-[#5A6F9E] px-8 md:px-16 lg:px-24 overflow-hidden mt-16 md:mt-24 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-[#F4A259] rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 right-20 w-32 h-32 bg-white rounded-full opacity-10"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 left-1/4 w-24 h-24 bg-[#F4A259] rounded-full opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Particules flottantes */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-start justify-center py-8 md:py-16 z-10 max-w-2xl pl-12 md:pl-14 lg:pl-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <motion.div
            className="absolute -top-4 -left-4 text-[#F4A259]"
            animate={{
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          <motion.div
            className="absolute -top-2 right-0"
            animate={{
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Star className="w-6 h-6 text-[#F4A259]" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 md:mb-8 text-white leading-tight" style={{fontFamily:'inherit', letterSpacing:'0.5px'}}>
            Soins vétérinaires<br />
            <span className="text-[#F4A259] relative inline-block">
              à distance
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4A259]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-white/90 max-w-xl leading-relaxed">
            Consultez un vétérinaire qualifié depuis chez vous, pour le bien-être de votre animal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8 w-full"
        >
          <Button size="lg" className="bg-[#F4A259] hover:bg-[#e08a2b] text-black text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 group">
            Trouver mon vétérinaire
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full transform hover:scale-105 transition-all duration-200">
            En savoir plus
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full"
        >
          <motion.div
            className="flex items-center gap-3 text-white bg-white/10 p-3 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Clock className="h-5 w-5 text-[#F4A259]" />
            <span className="text-sm font-medium">Consultation rapide</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-3 text-white bg-white/10 p-3 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Shield className="h-5 w-5 text-[#F4A259]" />
            <span className="text-sm font-medium">Vétérinaires certifiés</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-3 text-white bg-white/10 p-3 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Heart className="h-5 w-5 text-[#F4A259]" />
            <span className="text-sm font-medium">Soins personnalisés</span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="flex-1 flex justify-end items-center h-full w-full md:w-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="relative">
          <motion.div
            className="absolute -top-6 -right-6 bg-[#F4A259] text-black px-6 py-3 rounded-full text-sm font-medium shadow-lg z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            À partir de 15€
          </motion.div>
          <div className="relative group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#F4A259]/20 to-transparent rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <img
              src="/img/hero-dog.png"
              alt="Famille avec chien"
              className="w-full md:w-[600px] h-auto object-cover md:rounded-[32px] md:mr-8 shadow-2xl transform group-hover:scale-[1.02] transition-all duration-300"
            />
            <motion.div
              className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 rounded-full bg-[#7A90C3] border-2 border-white"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-bold">+500 vétérinaires</p>
                  <p className="text-gray-500">disponibles</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
