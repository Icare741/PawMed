import React from 'react';
import ArticleLayout from '../../components/ArticleLayout';

const UrgenceChien: React.FC = () => {
  return (
    <ArticleLayout
      title="Les signes d'urgence chez le chien : quand consulter un vétérinaire ?"
      author="Dr. Martin"
      date="15/03/2025"
      image="/img/conseil1.png"
      content={
        <>
          <p className="mb-6">
            En tant que propriétaire de chien, il est crucial de savoir reconnaître les signes qui nécessitent une intervention vétérinaire immédiate. Voici les situations d'urgence les plus courantes et comment y réagir.
          </p>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">1. Difficultés respiratoires</h2>
          <p className="mb-6">
            Si votre chien présente des difficultés à respirer, halète excessivement, ou a les gencives bleues, c'est une urgence absolue. Ces symptômes peuvent indiquer un problème cardiaque, une obstruction des voies respiratoires, ou un coup de chaleur.
          </p>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">2. Vomissements et diarrhée sévères</h2>
          <p className="mb-6">
            Des vomissements ou une diarrhée persistants, surtout s'ils contiennent du sang, peuvent rapidement déshydrater votre chien. Si ces symptômes durent plus de 24 heures ou s'ils sont accompagnés de léthargie, consultez immédiatement.
          </p>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">3. Problèmes neurologiques</h2>
          <p className="mb-6">
            Des signes comme des convulsions, une désorientation, une perte d'équilibre, ou des mouvements anormaux nécessitent une attention immédiate. Ils peuvent indiquer une intoxication, une blessure à la tête, ou un problème neurologique grave.
          </p>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">4. Abdomen distendu</h2>
          <p className="mb-6">
            Un abdomen gonflé et douloureux peut être le signe d'une torsion d'estomac, une condition potentiellement mortelle qui nécessite une intervention chirurgicale immédiate. Votre chien peut aussi se montrer agité et incapable de se reposer.
          </p>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">5. Traumatismes</h2>
          <p className="mb-6">
            Après un accident, une chute, ou une bagarre avec un autre animal, même si votre chien semble aller bien, une consultation vétérinaire est recommandée. Les blessures internes ne sont pas toujours visibles immédiatement.
          </p>

          <h2 className="text-2xl font-bold text-[#7A90C3] mb-4">Que faire en cas d'urgence ?</h2>
          <p className="mb-6">
            En cas d'urgence, gardez votre calme et contactez immédiatement votre vétérinaire. Si c'est en dehors des heures d'ouverture, rendez-vous dans une clinique d'urgence. En attendant, assurez-vous que votre chien est dans un endroit calme et sécurisé.
          </p>

          <div className="bg-[#DDE6F2] p-6 rounded-[16px] mt-8">
            <h3 className="text-xl font-bold text-[#7A90C3] mb-4">Points clés à retenir :</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ne sous-estimez jamais les changements de comportement soudains</li>
              <li>Gardez les numéros d'urgence à portée de main</li>
              <li>Préparez une trousse de premiers soins pour votre chien</li>
              <li>Connaissez l'emplacement de la clinique vétérinaire d'urgence la plus proche</li>
            </ul>
          </div>
        </>
      }
    />
  );
};

export default UrgenceChien; 