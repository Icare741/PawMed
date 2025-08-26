import React, { useEffect, useState, ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  const AnimatePresenceFixedType = AnimatePresence as ElementType;

  return (
    <AnimatePresenceFixedType>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <PawPrint className="w-16 h-16 text-[#F4A259]" />
        </motion.div>

        <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-[#F4A259] to-[#e08a2b]"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-gray-600 font-medium"
          style={{fontFamily:'inherit'}}
        >
          Chargement...
        </motion.p>
      </motion.div>
    </AnimatePresenceFixedType>
  );
};

export default LoadingScreen;
