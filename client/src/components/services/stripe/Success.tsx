import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';
import { PaymentIntentResult } from '@stripe/stripe-js';

function Success() {
  const stripe = useStripe();
  const [session, setSession] = useState<PaymentIntentResult | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionId = new URLSearchParams(window.location.search).get('session_id');
      if (stripe && sessionId) {
        try {
          const result = await stripe.retrievePaymentIntent(sessionId);
          setSession(result);
        } catch (error) {
          console.error('Erreur lors de la récupération de la session:', error);
        }
      }
    };

    fetchSession();
  }, [stripe]);

  return (
    <div className='bg-gray-100 h-screen flex justify-center items-center'>
      <div className='bg-white p-6  md:mx-auto'>
        <svg viewBox='0 0 24 24' className='text-green-600 w-16 h-16 mx-auto my-6'>
          <path
            fill='currentColor'
            d='M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z'
          ></path>
        </svg>
        <div className='text-center'>
          <h3 className='md:text-2xl text-base text-gray-900 font-semibold text-center'>
            Paiement effectué !
          </h3>
          <p className='text-gray-600 my-2'>
            Merci d'avoir effectué votre paiement en ligne sécurisé.
          </p>
          <p> Passez une excellente journée ! </p>
          <div className='py-10 text-center'>
            <Link
              to='/login'
              className='px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3'
            >
              RETOUR
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
