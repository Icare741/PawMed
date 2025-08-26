import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchPatients, deletePatient, createPatient, updatePatient } from '@/app/reducers/PatientReducer';
import { Patient, CreatePatientDto } from '@/components/services/types/patient';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: patients, isLoading, error } = useAppSelector(state => state.patients);
  const { user } = useAppSelector(state => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<CreatePatientDto>({
    name: '',
    species: '',
    breed: '',
    birth_date: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    medical_history: ''
  });

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas un praticien
    if (user && user.role_id !== 2) {
      navigate('/dashboard');
      return;
    }
    dispatch(fetchPatients());
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Valider les champs requis
      if (!formData.name || !formData.species || !formData.owner_name || !formData.owner_email) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Créer une copie des données pour la modification
      const dataToSend = {
        ...formData,
        // Convertir la date en format ISO si elle existe
        birth_date: formData.birth_date ? new Date(formData.birth_date).toISOString().split('T')[0] : undefined
      };

      console.log('Données du formulaire à envoyer:', dataToSend);

      if (editingPatient) {
        const result = await dispatch(updatePatient({ id: editingPatient.id, data: dataToSend })).unwrap();
        console.log('Réponse de mise à jour:', result);
        toast.success('Patient mis à jour avec succès');
      } else {
        const result = await dispatch(createPatient(dataToSend)).unwrap();
        console.log('Réponse de création:', result);
        toast.success('Patient créé avec succès');
      }

      // Rafraîchir la liste des patients
      await dispatch(fetchPatients());

      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      toast.error(error.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      try {
        await dispatch(deletePatient(id)).unwrap();
        toast.success('Patient supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      species: patient.species,
      breed: patient.breed || '',
      birth_date: patient.birth_date || '',
      owner_name: patient.owner_name,
      owner_email: patient.owner_email,
      owner_phone: patient.owner_phone || '',
      medical_history: patient.medical_history || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      breed: '',
      birth_date: '',
      owner_name: '',
      owner_email: '',
      owner_phone: '',
      medical_history: ''
    });
    setEditingPatient(null);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    try {
      return format(parseISO(date), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return date;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Patients</h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Nouveau Patient
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <li key={patient.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {patient.name}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {patient.species}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Propriétaire: {patient.owner_name}
                            </p>
                            {patient.breed && (
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Race: {patient.breed}
                              </p>
                            )}
                            {patient.owner_phone && (
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Tél: {patient.owner_phone}
                              </p>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            {patient.birth_date && (
                              <p>
                                Né le: {formatDate(patient.birth_date)}
                              </p>
                            )}
                          </div>
                        </div>
                        {patient.medical_history && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Historique médical: {patient.medical_history}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-4">
                        <button
                          onClick={() => handleEdit(patient)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <form onSubmit={handleSubmit}>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingPatient ? 'Modifier le patient' : 'Nouveau patient'}
                    </h3>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nom
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="species" className="block text-sm font-medium text-gray-700">
                          Espèce
                        </label>
                        <input
                          type="text"
                          name="species"
                          id="species"
                          value={formData.species}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
                          Race
                        </label>
                        <input
                          type="text"
                          name="breed"
                          id="breed"
                          value={formData.breed}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                          Date de naissance
                        </label>
                        <input
                          type="date"
                          name="birth_date"
                          id="birth_date"
                          value={formData.birth_date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="owner_name" className="block text-sm font-medium text-gray-700">
                          Nom du propriétaire
                        </label>
                        <input
                          type="text"
                          name="owner_name"
                          id="owner_name"
                          value={formData.owner_name}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="owner_email" className="block text-sm font-medium text-gray-700">
                          Email du propriétaire
                        </label>
                        <input
                          type="email"
                          name="owner_email"
                          id="owner_email"
                          value={formData.owner_email}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="owner_phone" className="block text-sm font-medium text-gray-700">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="owner_phone"
                          id="owner_phone"
                          value={formData.owner_phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="medical_history" className="block text-sm font-medium text-gray-700">
                          Historique médical
                        </label>
                        <textarea
                          name="medical_history"
                          id="medical_history"
                          rows={3}
                          value={formData.medical_history}
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
                      {editingPatient ? 'Mettre à jour' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
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
    </div>
  );
};

export default PatientsPage;

