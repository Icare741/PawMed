import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Prescription from 'App/Models/Prescription'
import PrescriptionItem from 'App/Models/PrescriptionItem'
import User from 'App/Models/User'
import Patient from 'App/Models/Patient'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run () {
    // Récupérer l'utilisateur admin et un patient
    const adminUser = await User.findBy('email', 'admin@admin.com')
    const patient = await Patient.query().first()

    if (!adminUser || !patient) {
      console.log('Utilisateur admin ou patient non trouvé, impossible de créer des ordonnances de test')
      return
    }

    // Créer des ordonnances de test
    const prescription1 = await Prescription.create({
      patientId: patient.id,
      practitionerId: adminUser.id,
      prescriptionDate: DateTime.fromISO('2024-06-12'),
      status: 'active',
      notes: 'Traitement antibiotique pour infection urinaire'
    })

    // Créer les items de prescription pour l'ordonnance 1
    await PrescriptionItem.create({
      prescriptionId: prescription1.id,
      medicationName: 'Antibiotique',
      dosage: '1 comprimé',
      frequency: 'matin et soir',
      duration: '7 jours',
      instructions: 'Prendre avec de la nourriture',
      quantity: 14,
      unit: 'comprimé'
    })

    await PrescriptionItem.create({
      prescriptionId: prescription1.id,
      medicationName: 'Anti-inflammatoire',
      dosage: '1 comprimé',
      frequency: 'par jour',
      duration: '5 jours',
      instructions: 'Prendre le matin',
      quantity: 5,
      unit: 'comprimé'
    })

    // Créer une deuxième ordonnance
    const prescription2 = await Prescription.create({
      patientId: patient.id,
      practitionerId: adminUser.id,
      prescriptionDate: DateTime.fromISO('2024-06-10'),
      status: 'completed',
      notes: 'Vermifuge de routine'
    })

    await PrescriptionItem.create({
      prescriptionId: prescription2.id,
      medicationName: 'Vermifuge',
      dosage: '1 comprimé',
      frequency: 'une fois',
      duration: '1 jour',
      instructions: 'Administrer directement dans la bouche',
      quantity: 1,
      unit: 'comprimé'
    })

    console.log('Ordonnances de test créées avec succès')
  }
}
