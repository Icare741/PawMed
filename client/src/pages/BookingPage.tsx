import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAvailabilities } from '@/app/reducers/AvailabilityReducer';
import { createConsultation } from '@/app/reducers/ConsultationReducer';

const BookingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: availabilities, isLoading } = useAppSelector(state => state.availability);
  const [selectedAvailability, setSelectedAvailability] = useState<number | null>(null);
  const [consultationType, setConsultationType] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    dispatch(fetchAvailabilities());
  }, [dispatch]);

  const handleBooking = async () => {
    if (!selectedAvailability || !consultationType) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const availability = availabilities.find(a => a.id === selectedAvailability);

    if (!availability) {
      toast.error('Disponibilité invalide');
      return;
    }

    try {
      await dispatch(createConsultation({
        availabilityId: availability.id,
        type: consultationType,
        date: availability.startTime,
        time: format(parseISO(availability.startTime), 'HH:mm'),
        notes: notes || undefined
      })).unwrap();

      toast.success('Rendez-vous pris avec succès !');
      setSelectedAvailability(null);
      setConsultationType('');
      setNotes('');
    } catch (error) {
      toast.error('Erreur lors de la prise de rendez-vous');
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Prendre un rendez-vous
      </h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Disponibilités
        </h2>

        <div className="grid gap-4 mb-6">
          {availabilities.length === 0 ? (
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-center text-gray-600">
                Aucune disponibilité pour le moment. Veuillez réessayer ultérieurement.
              </p>
            </div>
          ) : (
            availabilities.map((availability) => (
              <div
                key={availability.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAvailability === availability.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
                onClick={() => setSelectedAvailability(availability.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {availability.practitioner?.user?.name
                        ? `Dr. ${availability.practitioner.user.name}`
                        : 'Praticien non spécifié'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {availability.practitioner?.speciality || 'Spécialité non spécifiée'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {availability.practitioner?.clinicName || 'Clinique non spécifiée'}
                    </p>
                  </div>
                  <p className="text-indigo-600 font-medium">
                    {formatDateTime(availability.startTime)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedAvailability && (
          <div className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type de consultation
              </label>
              <select
                id="type"
                value={consultationType}
                onChange={(e) => setConsultationType(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="Consultation générale">Consultation générale</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Suivi">Suivi</option>
                <option value="Urgence">Urgence</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (optionnel)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ajoutez des notes pour le praticien..."
              />
            </div>

            <button
              onClick={handleBooking}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirmer le rendez-vous
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
