import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';

interface Offer {
  id: string;
  name: string;
  price: number;
  description: string;
}

const offers: Offer[] = [
  { id: 'offer1', name: 'Offre Basic', price: 1000, description: 'Accès basique pendant 1 mois' },
  { id: 'offer2', name: 'Offre Premium', price: 2500, description: 'Accès premium pendant 3 mois' },
];

function Paiments() {
  const stripe = useStripe();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleOfferSelect = (offer: Offer) => {
    setSelectedOffer(offer);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !selectedOffer) {
      setError("Veuillez sélectionner une offre et vérifier que Stripe est chargé.");
      return;
    }

    setProcessing(true);

    try {
      // Créer une session Checkout
      const response = await axios.post('http://localhost:3333/payments/create-checkout-session', {
        offerId: selectedOffer.id,
      });

      const { sessionId } = response.data;

      // Rediriger vers Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setProcessing(false);
    }
  };

  return (
    <div>
      <h2>Choisissez votre offre</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        {offers.map((offer) => (
          <div
            key={offer.id}
            style={{
              border: selectedOffer?.id === offer.id ? '2px solid blue' : '1px solid gray',
              padding: '10px',
              cursor: 'pointer'
            }}
            onClick={() => handleOfferSelect(offer)}
          >
            <h3>{offer.name}</h3>
            <p>{offer.description}</p>
            <p>Prix: {offer.price / 100}€</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={processing || !selectedOffer}>
          {processing ? 'Redirection...' : `Payer ${selectedOffer ? selectedOffer.price / 100 : 0}€`}
        </button>
      </form>
    </div>
  );
}

export default Paiments;
