import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ArticleLayoutProps {
  title: string;
  author: string;
  date: string;
  image: string;
  content: React.ReactNode;
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ title, author, date, image, content }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Header */}
      <header className="w-full bg-white fixed top-0 left-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-24">
            <div className="flex items-center">
              <img src="/img/logo.svg" alt="Pawmed" className="h-12 md:h-24 w-auto" />
            </div>

            {/* Menu Hamburger pour mobile */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Navigation desktop */}
            <nav className="hidden md:flex flex-1 justify-center gap-16">
              <a href="/#veterinaire" className="text-black text-lg font-normal hover:text-[#F4A259] transition" style={{fontFamily:'inherit'}}>Trouver mon vétérinaire</a>
              <a href="/#conseils" className="text-black text-lg font-normal hover:text-[#F4A259] transition" style={{fontFamily:'inherit'}}>Conseils</a>
              <a href="/#about" className="text-black text-lg font-normal hover:text-[#F4A259] transition" style={{fontFamily:'inherit'}}>À propos de nous</a>
            </nav>

            {/* Boutons desktop */}
            <div className="hidden md:flex gap-4 items-center">
              <button
                className="bg-[#F4A259] text-black font-extrabold text-lg px-8 py-2 rounded-full transition hover:bg-[#e08a2b]"
                style={{fontFamily:'inherit'}}
                onClick={() => navigate('/register')}
              >
                S'inscrire
              </button>
              <button
                className="border-2 border-[#F4A259] text-[#F4A259] bg-white font-semibold rounded-full px-6 py-2 text-base transition hover:bg-[#f4a25911]"
                style={{fontFamily:'inherit'}}
                onClick={() => navigate('/login')}
              >
                Se connecter
              </button>
            </div>
          </div>

          {/* Menu mobile */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pb-4`}>
            <nav className="flex flex-col space-y-4">
              <a href="/#veterinaire" className="text-black text-base font-normal hover:text-[#F4A259] transition" style={{fontFamily:'inherit'}}>Trouver mon vétérinaire</a>
              <a href="/#conseils" className="text-black text-base font-normal hover:text-[#F4A259] transition" style={{fontFamily:'inherit'}}>Conseils</a>
              <a href="/#about" className="text-black text-base font-normal hover:text-[#F4A259] transition" style={{fontFamily:'inherit'}}>À propos de nous</a>
              <div className="flex flex-col space-y-2 pt-2">
                <button
                  className="bg-[#F4A259] text-black font-extrabold text-base px-6 py-2 rounded-full transition hover:bg-[#e08a2b]"
                  style={{fontFamily:'inherit'}}
                  onClick={() => navigate('/register')}
                >
                  S'inscrire
                </button>
                <button
                  className="border-2 border-[#F4A259] text-[#F4A259] bg-white font-semibold rounded-full px-6 py-2 text-base transition hover:bg-[#f4a25911]"
                  style={{fontFamily:'inherit'}}
                  onClick={() => navigate('/login')}
                >
                  Se connecter
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content avec padding-top pour compenser le header fixe */}
      <main className="max-w-4xl mx-auto px-4 py-4 md:py-8 mt-16 md:mt-24">
        <article className="prose prose-sm md:prose-lg lg:prose-xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{title}</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mb-6 md:mb-8">
            <span className="text-gray-600 text-sm md:text-base">Par {author}</span>
            <span className="hidden md:inline text-gray-400">•</span>
            <span className="text-gray-600 text-sm md:text-base">{date}</span>
          </div>
          <img src={image} alt={title} className="w-full h-48 md:h-96 object-cover rounded-lg mb-6 md:mb-8" />
          {content}
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-[#F4A259] text-black py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">PawMed</h3>
              <p className="text-xs md:text-sm">
                La plateforme de téléconsultation vétérinaire qui vous connecte avec les meilleurs professionnels de la santé animale.
              </p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Liens utiles</h3>
              <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
                <li><a href="/#veterinaire" className="hover:underline">Trouver un vétérinaire</a></li>
                <li><a href="/#conseils" className="hover:underline">Conseils vétérinaires</a></li>
                <li><a href="/#about" className="hover:underline">À propos</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Contact</h3>
              <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
                <li>Email: contact@pawmed.fr</li>
                <li>Tél: 01 23 45 67 89</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-black/10 text-center text-sm md:text-base">
            <p>&copy; 2024 PawMed. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArticleLayout; 