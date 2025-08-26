import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchConsultations, createConsultation, updateConsultation } from '@/app/reducers/ConsultationReducer';
import { Plus, Video } from 'lucide-react';
import { fetchPatients } from '@/app/reducers/PatientReducer';
import { useNavigate } from 'react-router-dom';

interface ConsultationFormData {
  patientId?: number;
  patientName: string;
  ownerName: string;
  type: string;
  date: string;
  time: string;
  notes?: string;
}

const ConsultationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { consultations, isLoading, error } = useAppSelector((state) => state.consultations);
  const { items: patients } = useAppSelector((state) => state.patients);
  const { user } = useAppSelector(state => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ConsultationFormData>({
    patientName: '',
    ownerName: '',
    type: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    dispatch(fetchConsultations());
    dispatch(fetchPatients());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si un patient est sélectionné, remplir automatiquement les champs
    if (name === 'patientId') {
      const selectedPatient = patients.find(p => p.id === Number(value));
      if (selectedPatient) {
        setFormData(prev => ({
          ...prev,
          patientId: selectedPatient.id,
          patientName: selectedPatient.name,
          ownerName: selectedPatient.owner_name
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.patientName || !formData.ownerName || !formData.type || !formData.date || !formData.time) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      await dispatch(createConsultation(formData)).unwrap();
      toast.success('Consultation créée avec succès');
      setIsModalOpen(false);
      setFormData({
        patientName: '',
        ownerName: '',
        type: '',
        date: '',
        time: '',
        notes: ''
      });
      dispatch(fetchConsultations());
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center">
        Une erreur est survenue: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {user?.role_id === 2 ? 'Mes consultations' : 'Mes rendez-vous'}
            </h2>
            {user?.role_id === 2 && (
              <button
                onClick={() => navigate('/availabilities')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Gérer mes disponibilités
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {consultations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {user?.role_id === 2
                ? "Vous n'avez aucune consultation programmée"
                : "Vous n'avez aucun rendez-vous programmé"}
            </div>
          ) : (
            consultations.map((consultation) => (
              <div key={consultation.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    {user?.role_id === 2 ? (
                      <>
                        <p className="font-medium text-gray-900">{consultation.patientName}</p>
                        <p className="text-sm text-gray-500">Propriétaire: {consultation.ownerName}</p>
                      </>
                    ) : (
                      <p className="font-medium text-gray-900">
                        Dr. {consultation.practitioner?.user?.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">{consultation.type}</p>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(consultation.date), 'dd MMMM yyyy', { locale: fr })} à {consultation.time}
                    </p>
                    {consultation.notes && (
                      <p className="text-sm text-gray-500 mt-2">
                        Notes: {consultation.notes}
                      </p>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium
                    ${consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${consultation.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${consultation.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {consultation.status === 'pending' ? 'À venir' : ''}
                    {consultation.status === 'completed' ? 'Terminé' : ''}
                    {consultation.status === 'cancelled' ? 'Annulé' : ''}
                  </div>
                </div>
                {user?.role_id === 2 && consultation.status === 'pending' && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => navigate(`/video-chat/${consultation.id}`)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Démarrer la consultation
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal pour créer/éditer une consultation */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleSubmit}>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Nouvelle consultation
                  </h3>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                        Patient existant
                      </label>
                      <select
                        id="patientId"
                        name="patientId"
                        onChange={handleInputChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">Sélectionner un patient</option>
                        {patients.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.name} ({patient.owner_name})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                        Nom du patient
                      </label>
                      <input
                        type="text"
                        name="patientName"
                        id="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                        Nom du propriétaire
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Type de consultation
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">Sélectionner un type</option>
                        <option value="Consultation générale">Consultation générale</option>
                        <option value="Vaccination">Vaccination</option>
                        <option value="Contrôle">Contrôle</option>
                        <option value="Urgence">Urgence</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Heure
                      </label>
                      <input
                        type="time"
                        name="time"
                        id="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData({
                        patientName: '',
                        ownerName: '',
                        type: '',
                        date: '',
                        time: '',
                        notes: ''
                      });
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPage;
