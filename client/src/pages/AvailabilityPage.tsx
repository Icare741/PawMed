import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import {
  fetchAvailabilities,
  createAvailability,
  deleteAvailability
} from '@/app/reducers/AvailabilityReducer';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';

const AvailabilityPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: availabilities, isLoading, error } = useAppSelector(state => state.availability);
  const { user } = useAppSelector(state => state.auth);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas un praticien
    if (user && user.role_id !== 2) {
      navigate('/dashboard');
      return;
    }
    dispatch(fetchAvailabilities());
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      toast.error('Veuillez sélectionner une date et une heure de début et de fin');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      toast.error('La date de fin doit être après la date de début');
      return;
    }

    try {
      await dispatch(createAvailability({
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      })).unwrap();

      toast.success('Disponibilité ajoutée avec succès');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      // L'erreur sera gérée par le useEffect qui surveille error
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteAvailability(id)).unwrap();
      toast.success('Disponibilité supprimée avec succès');
    } catch (error) {
      // L'erreur sera gérée par le useEffect qui surveille error
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      return format(parseISO(dateStr), 'EEEE d MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', dateStr, error);
      return 'Date invalide';
    }
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      return format(parseISO(dateStr), 'HH:mm');
    } catch (error) {
      console.error('Erreur lors du formatage de l\'heure:', dateStr, error);
      return 'Heure invalide';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gérer mes disponibilités</h1>

        {/* Formulaire d'ajout */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter une disponibilité</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de début
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de fin
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Ajout en cours...' : 'Ajouter la disponibilité'}
              </button>
            </div>
          </form>
        </div>

        {/* Liste des disponibilités */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {isLoading && availabilities.length === 0 ? (
              <p className="p-6 text-center text-gray-500">
                Chargement des disponibilités...
              </p>
            ) : availabilities.length === 0 ? (
              <p className="p-6 text-center text-gray-500">
                Aucune disponibilité pour le moment
              </p>
            ) : (
              availabilities.map((availability) => (
                <div key={availability.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(availability.startTime)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatTime(availability.startTime)} - {formatTime(availability.endTime)}
                    </p>
                  </div>
                  <div className="ml-4">
                    {availability.isBooked ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Réservé
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDelete(availability.id)}
                        disabled={isLoading}
                        className="text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;
