import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Stripe from '@ioc:Mezielabs/Stripe'

// Idéalement, ces plans seraient stockés dans une base de données
const pricingPlans = [
  {
    id: 'debutant',
    title: 'Débutant',
    description: 'Meilleure option pour un usage personnel et pour votre prochain projet.',
    price: '29€',
    features: [
      'Configuration individuelle',
      'Pas de frais de configuration ou cachés',
      "Taille de l'équipe : 1 développeur",
      'Support premium : 6 mois',
      'Mises à jour gratuites : 6 mois',
    ],
  },
  {
    id: 'entreprise',
    title: 'Entreprise',
    description: 'Pertinent pour plusieurs utilisateurs, support étendu et premium.',
    price: '99€',
    features: [
      'Configuration individuelle',
      'Pas de frais de configuration ou cachés',
      "Taille de l'équipe : 10 développeurs",
      'Support premium : 24 mois',
      'Mises à jour gratuites : 24 mois',
    ],
  },
  {
    id: 'entreprise_plus',
    title: 'Entreprise+',
    description:
      'Idéal pour les utilisations à grande échelle et les droits de redistribution étendus.',
    price: '499€',
    features: [
      'Configuration individuelle',
      'Pas de frais de configuration ou cachés',
      "Taille de l'équipe : 100+ développeurs",
      'Support premium : 36 mois',
      'Mises à jour gratuites : 36 mois',
    ],
  },
];

export default class PaymentsController {
  public async createCheckoutSession({ request, response }: HttpContextContract) {
    try {
      const { offerId, price } = request.all()
      // Vérifier si le plan existe
      const plan = pricingPlans.find(plan => plan.id === offerId)
      if (!plan) {
        return response.status(400).json({
          success: false,
          message: 'Plan invalide',
        })
      }

      // Créer une session Checkout
      const session = await Stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: plan.title,
                description: plan.description,
              },
              unit_amount: price * 100,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/cancel',
      })

      // Renvoyer l'ID de la session au frontend
      return response.status(200).json({
        success: true,
        sessionId: session.id,
      })

    } catch (error) {
      console.error('Erreur lors de la création de la session Checkout:', error)
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la session Checkout',
        error: error.message,
      })
    }
  }

  public async checkSessionStatus({ params, response }: HttpContextContract) {
    try {
      const { sessionId } = params
      const session = await Stripe.checkout.sessions.retrieve(sessionId)

      if (session.payment_status === 'paid') {
        // Le paiement a réussi
        // Ajoutez ici la logique pour attribuer l'offre à l'utilisateur
        return response.status(200).json({
          success: true,
          message: 'Paiement réussi',
          sessionId: session.id,
          status: session.payment_status,
        })
      } else {
        return response.status(202).json({
          success: false,
          message: 'Le paiement est en attente ou a échoué',
          sessionId: session.id,
          status: session.payment_status,
        })
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut de la session:', error)
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification du statut de la session',
        error: error.message,
      })
    }
  }
}
