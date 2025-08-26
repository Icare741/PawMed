import React from 'react';
import ArticleLayout from '@/components/ArticleLayout';

const EducationChiot: React.FC = () => {
  return (
    <ArticleLayout
      title="L'éducation du chiot : les bases essentielles"
      author="Dr. Thomas"
      date="01/03/2025"
      image="/img/conseil4.png"
      content={
        <div className="space-y-4 md:space-y-6">
          <p className="text-sm md:text-base">
            L'éducation d'un chiot est une étape cruciale qui déterminera son comportement futur. Commencer tôt et utiliser des méthodes positives sont les clés du succès.
          </p>

          <h2 className="text-xl md:text-2xl font-bold text-[#7A90C3] mt-6 md:mt-8 mb-3 md:mb-4">1. Les périodes clés du développement</h2>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 text-sm md:text-base">
            <li>Période de socialisation (3-12 semaines)</li>
            <li>Période de peur (8-11 semaines)</li>
            <li>Période juvénile (3-6 mois)</li>
            <li>Adolescence (6-18 mois)</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-bold text-[#7A90C3] mt-6 md:mt-8 mb-3 md:mb-4">2. Les commandes de base</h2>
          <div className="bg-[#DDE6F2] p-4 md:p-6 rounded-lg">
            <h3 className="font-bold mb-2 text-sm md:text-base">Commandes essentielles à enseigner :</h3>
            <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 text-sm md:text-base">
              <li>"Assis" - Pour calmer et contrôler</li>
              <li>"Couché" - Pour la relaxation</li>
              <li>"Pas bouger" - Pour la sécurité</li>
              <li>"Au pied" - Pour le rappel</li>
            </ul>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[#7A90C3] mt-6 md:mt-8 mb-3 md:mb-4">3. La socialisation</h2>
          <p className="text-sm md:text-base">
            La socialisation est cruciale pendant les premières semaines. Exposez votre chiot à :
          </p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 text-sm md:text-base">
            <li>Différentes personnes (adultes, enfants, personnes âgées)</li>
            <li>Autres chiens et animaux</li>
            <li>Environnements variés (ville, campagne, transports)</li>
            <li>Sons et situations nouvelles</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-bold text-[#7A90C3] mt-6 md:mt-8 mb-3 md:mb-4">4. La gestion des comportements indésirables</h2>
          <div className="bg-[#DDE6F2] p-4 md:p-6 rounded-lg">
            <h3 className="font-bold mb-2 text-sm md:text-base">Solutions pour les problèmes courants :</h3>
            <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 text-sm md:text-base">
              <li>Mordillements : Proposez des jouets appropriés</li>
              <li>Aboiements excessifs : Identifiez la cause et utilisez la distraction</li>
              <li>Propreté : Établissez une routine régulière</li>
              <li>Destruction : Assurez-vous que le chiot a assez d'exercice et de stimulation</li>
            </ul>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[#7A90C3] mt-6 md:mt-8 mb-3 md:mb-4">5. Conseils pratiques</h2>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 text-sm md:text-base">
            <li>Utilisez toujours le renforcement positif (récompenses, caresses, félicitations)</li>
            <li>Soyez cohérent dans vos commandes et vos règles</li>
            <li>Gardez les séances d'entraînement courtes (5-10 minutes)</li>
            <li>Terminez toujours sur une note positive</li>
            <li>Ne punissez jamais physiquement votre chiot</li>
          </ul>

          <div className="bg-[#F4A259] p-4 md:p-6 rounded-lg mt-6 md:mt-8">
            <h3 className="font-bold mb-2 text-sm md:text-base">Points clés à retenir :</h3>
            <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 text-sm md:text-base">
              <li>Commencez l'éducation dès l'arrivée du chiot</li>
              <li>La patience et la constance sont essentielles</li>
              <li>Privilégiez toujours les méthodes positives</li>
              <li>N'hésitez pas à consulter un éducateur canin si nécessaire</li>
            </ul>
          </div>
        </div>
      }
    />
  );
};

export default EducationChiot; 