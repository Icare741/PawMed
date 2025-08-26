import React from 'react';
import ArticleLayout from '../../components/ArticleLayout';

const StressLapin: React.FC = () => {
  return (
    <ArticleLayout
      title="Le stress chez le lapin : comprendre et gérer l'anxiété de votre compagnon"
      author="Dr. Emma"
      date="05/03/2025"
      image="/img/conseil3.png"
      content={
        <>
          <p className="mb-6">
            Les lapins sont des animaux sensibles qui peuvent facilement être stressés. Le stress chronique peut avoir des conséquences graves sur leur santé. Découvrez comment identifier et gérer le stress de votre lapin.
          </p>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">1. Les signes de stress chez le lapin</h2>
          <p className="mb-6">
            Un lapin stressé peut présenter plusieurs symptômes :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Perte d'appétit ou anorexie</li>
            <li>Comportement agressif soudain</li>
            <li>Grincement de dents</li>
            <li>Respiration rapide</li>
            <li>Posture recroquevillée</li>
            <li>Perte de poils excessive</li>
            <li>Comportement destructeur</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">2. Les causes courantes de stress</h2>
          <p className="mb-6">
            Plusieurs facteurs peuvent causer du stress chez votre lapin :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Changements dans l'environnement</li>
            <li>Présence de prédateurs (chiens, chats)</li>
            <li>Bruits forts ou soudains</li>
            <li>Manque d'espace</li>
            <li>Absence de compagnon</li>
            <li>Manque de stimulation</li>
            <li>Problèmes de santé sous-jacents</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">3. Créer un environnement apaisant</h2>
          <p className="mb-6">
            Voici comment aménager l'espace de vie de votre lapin pour réduire son stress :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Fournir un espace suffisamment grand</li>
            <li>Créer des cachettes sécurisées</li>
            <li>Maintenir une température constante</li>
            <li>Éviter les courants d'air</li>
            <li>Placer la cage dans un endroit calme</li>
            <li>Utiliser une litière adaptée</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">4. L'importance de la socialisation</h2>
          <p className="mb-6">
            Les lapins sont des animaux sociaux qui ont besoin de compagnie :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Envisagez d'adopter un second lapin</li>
            <li>Passez du temps quotidien avec votre lapin</li>
            <li>Créez des moments de jeu et d'interaction</li>
            <li>Respectez son rythme et ses besoins</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">5. Les activités anti-stress</h2>
          <p className="mb-6">
            Stimulez votre lapin avec des activités appropriées :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Jouets à mâcher</li>
            <li>Tunnels et cachettes</li>
            <li>Jeux de recherche de nourriture</li>
            <li>Exercices physiques réguliers</li>
            <li>Massages doux (si votre lapin apprécie)</li>
          </ul>

          <div className="bg-[#DDE6F2] p-6 rounded-[16px] mt-8">
            <h3 className="text-xl font-bold text-[#7A90C3] mb-4">Quand consulter un vétérinaire ?</h3>
            <p className="mb-4">Consultez un vétérinaire si :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Le stress persiste malgré vos efforts</li>
              <li>Votre lapin présente des symptômes physiques</li>
              <li>Le comportement change soudainement</li>
              <li>Votre lapin refuse de s'alimenter</li>
            </ul>
          </div>
        </>
      }
    />
  );
};

export default StressLapin; 