import React from 'react';
import ArticleLayout from '../../components/ArticleLayout';

const HygieneDentaireChat: React.FC = () => {
  return (
    <ArticleLayout
      title="L'hygiène dentaire du chat : guide complet pour des dents saines"
      author="Dr. Sophie"
      date="10/03/2025"
      image="/img/conseil2.png"
      content={
        <>
          <p className="mb-6">
            Une bonne hygiène dentaire est essentielle pour la santé globale de votre chat. Les problèmes dentaires peuvent affecter non seulement la bouche, mais aussi d'autres organes comme le cœur et les reins. Voici un guide complet pour prendre soin des dents de votre chat.
          </p>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">1. Les problèmes dentaires courants chez le chat</h2>
          <p className="mb-6">
            Les chats sont sujets à plusieurs problèmes dentaires, notamment :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>La gingivite (inflammation des gencives)</li>
            <li>La parodontite (infection des tissus de soutien des dents)</li>
            <li>La résorption dentaire (destruction progressive de la dent)</li>
            <li>Le tartre et la plaque dentaire</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">2. Les signes à surveiller</h2>
          <p className="mb-6">
            Soyez attentif à ces signes qui peuvent indiquer des problèmes dentaires :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Mauvaise haleine persistante</li>
            <li>Gencives rouges ou enflées</li>
            <li>Difficulté à manger ou perte d'appétit</li>
            <li>Bave excessive</li>
            <li>Dents décolorées ou cassées</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">3. Comment brosser les dents de votre chat</h2>
          <p className="mb-6">
            Le brossage régulier est la meilleure prévention. Voici comment procéder :
          </p>
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li>Commencez tôt, idéalement quand le chaton a 3-4 mois</li>
            <li>Utilisez un dentifrice spécial pour chats (jamais de dentifrice humain)</li>
            <li>Choisissez une brosse à dents adaptée à la taille de votre chat</li>
            <li>Brossez doucement en mouvements circulaires</li>
            <li>Récompensez votre chat après chaque séance</li>
          </ol>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">4. Autres méthodes de soins dentaires</h2>
          <p className="mb-6">
            En complément du brossage, vous pouvez utiliser :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Des jouets dentaires spécialisés</li>
            <li>Des friandises dentaires</li>
            <li>Des solutions buccales pour chats</li>
            <li>Une alimentation adaptée (croquettes dentaires)</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">5. Les visites vétérinaires</h2>
          <p className="mb-6">
            Un examen dentaire annuel est recommandé. Le vétérinaire pourra :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Détecter les problèmes précoces</li>
            <li>Effectuer un détartrage si nécessaire</li>
            <li>Traiter les problèmes existants</li>
            <li>Donner des conseils personnalisés</li>
          </ul>

          <div className="bg-[#DDE6F2] p-6 rounded-[16px] mt-8">
            <h3 className="text-xl font-bold text-[#7A90C3] mb-4">Conseils pratiques :</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Commencez les soins dentaires progressivement</li>
              <li>Soyez patient et positif</li>
              <li>Créez une routine régulière</li>
              <li>Observez régulièrement la bouche de votre chat</li>
            </ul>
          </div>
        </>
      }
    />
  );
};

export default HygieneDentaireChat; 