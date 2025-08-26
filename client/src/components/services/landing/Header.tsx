import React, { ElementType } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

type HeaderProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  handleScrollTop: () => void;
};

const AnimatePresenceFixedType = AnimatePresence as ElementType;


const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen, handleScrollTop }) => {
  const navigate = useNavigate();

  const menuItems = [
    { href: '#veterinaire', label: 'Trouver mon vétérinaire', onClick: () => { setIsMenuOpen(false); handleScrollTop(); } },
    { href: '#conseils', label: 'Conseils', onClick: () => setIsMenuOpen(false) },
    { href: '#about', label: 'À propos de nous', onClick: () => setIsMenuOpen(false) }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="w-full fixed top-0 left-0 z-50"
    >
      {/* Fond blanc avec effet de verre */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-b border-gray-100" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src="/img/logo.svg" alt="Pawmed" className="h-12 md:h-20 w-auto" />
          </motion.div>

          {/* Menu Hamburger pour mobile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 text-gray-600 hover:text-[#F4A259] transition-colors relative z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <AnimatePresenceFixedType mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresenceFixedType>
          </motion.button>

          {/* Menu déroulant mobile */}
          <AnimatePresenceFixedType>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-white/95 backdrop-blur-xl z-40 pt-20"
              >
                <nav className="flex flex-col space-y-6 p-6 w-full">
                  {menuItems.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.href}
                      className="text-black text-xl font-medium hover:text-[#F4A259] transition-colors py-2 w-full relative group"
                      style={{fontFamily:'inherit'}}
                      onClick={item.onClick}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center justify-between">
                        {item.label}
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F4A259] transition-all duration-300 group-hover:w-full" />
                    </motion.a>
                  ))}
                  <div className="flex flex-col space-y-4 pt-6 border-t border-gray-100 w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-[#F4A259] to-[#e08a2b] text-white font-bold text-lg px-6 py-3 rounded-full transition-all hover:shadow-lg w-full"
                      style={{fontFamily:'inherit'}}
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/register');
                      }}
                    >
                      S'inscrire
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="border-2 border-[#F4A259] text-[#F4A259] bg-white font-semibold rounded-full px-6 py-3 text-lg transition-all hover:bg-[#F4A259]/5 hover:shadow-lg w-full"
                      style={{fontFamily:'inherit'}}
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/login');
                      }}
                    >
                      Se connecter
                    </motion.button>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresenceFixedType>

          {/* Navigation desktop */}
          <nav className="hidden md:flex flex-1 justify-center gap-16">
            {menuItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="text-black text-lg font-medium hover:text-[#F4A259] transition-colors relative group"
                style={{fontFamily:'inherit'}}
                onClick={item.onClick}
                whileHover={{ y: -2 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F4A259] transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </nav>

          {/* Boutons desktop */}
          <div className="hidden md:flex gap-4 items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#F4A259] to-[#e08a2b] text-white font-bold text-lg px-8 py-2.5 rounded-full transition-all hover:shadow-lg relative overflow-hidden group"
              style={{fontFamily:'inherit'}}
              onClick={() => navigate('/register')}
            >
              <span className="relative z-10">S'inscrire</span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-[#F4A259] text-[#F4A259] bg-white font-semibold rounded-full px-6 py-2.5 text-base transition-all hover:bg-[#F4A259]/5 hover:shadow-lg relative overflow-hidden group"
              style={{fontFamily:'inherit'}}
              onClick={() => navigate('/login')}
            >
              <span className="relative z-10">Se connecter</span>
              <motion.div
                className="absolute inset-0 bg-[#F4A259]/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
