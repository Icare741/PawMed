import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Consultation from 'App/Models/Consultation'
import Patient from 'App/Models/Patient'
import Practitioner from 'App/Models/Practitioner'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class ConsultationsSeeder extends BaseSeeder {
  public async run() {
    // Récupérer l'utilisateur admin
    const adminUser = await User.findBy('email', 'admin@admin.com')
    if (!adminUser) {
      console.log('❌ Utilisateur admin non trouvé. Lancez d\'abord UserSeeder.')
      return
    }

    // Récupérer ou créer le praticien pour l'admin
    let practitioner = await Practitioner.findBy('userId', adminUser.id)
    if (!practitioner) {
      practitioner = await Practitioner.create({
        userId: adminUser.id,
        clinicName: 'Clinique Vétérinaire du Centre',
        speciality: 'Vétérinaire généraliste',
        siret: '12345678901234',
        address: '123 Rue de la Santé, 75001 Paris'
      })
    }

    // Créer des patients de test associés à l'admin
    const patient1 = await Patient.create({
      name: 'Médor',
      species: 'Chien',
      breed: 'Golden Retriever',
      birthDate: DateTime.fromISO('2020-03-15'),
      ownerName: adminUser.name,
      ownerEmail: adminUser.email,
      ownerPhone: '+33 6 34 53 46 46',
      medicalHistory: 'Vaccinations à jour, pas d\'antécédents particuliers'
    })

    const patient2 = await Patient.create({
      name: 'Félix',
      species: 'Chat',
      breed: 'Chat Européen',
      birthDate: DateTime.fromISO('2019-07-22'),
      ownerName: adminUser.name,
      ownerEmail: adminUser.email,
      ownerPhone: '+33 6 34 53 46 46',
      medicalHistory: 'Castré, vaccins à jour'
    })

    const patient3 = await Patient.create({
      name: 'Luna',
      species: 'Chat',
      breed: 'Siamois',
      birthDate: DateTime.fromISO('2021-01-10'),
      ownerName: adminUser.name,
      ownerEmail: adminUser.email,
      ownerPhone: '+33 6 34 53 46 46',
      medicalHistory: 'Vaccinations à jour, pas d\'antécédents'
    })

    // Créer des consultations de test
    const consultations = [
      {
        practitionerId: practitioner.id,
        patientId: patient1.id,
        patientName: patient1.name,
        ownerName: patient1.ownerName,
        type: 'Téléconsultation',
        date: DateTime.now().plus({ days: 2 }).startOf('day'),
        time: '16:30',
        notes: 'Suivi post-opératoire - vérification de la cicatrisation',
        status: 'pending' as const
      },
      {
        practitionerId: practitioner.id,
        patientId: patient2.id,
        patientName: patient2.name,
        ownerName: patient2.ownerName,
        type: 'Consultation physique',
        date: DateTime.now().plus({ days: 5 }).startOf('day'),
        time: '10:00',
        notes: 'Problème de peau - démangeaisons et perte de poils',
        status: 'pending' as const
      },
      {
        practitionerId: practitioner.id,
        patientId: patient3.id,
        patientName: patient3.name,
        ownerName: patient3.ownerName,
        type: 'Téléconsultation',
        date: DateTime.now().plus({ days: 7 }).startOf('day'),
        time: '14:15',
        notes: 'Vaccination annuelle - rappel des vaccins',
        status: 'pending' as const
      },
      {
        practitionerId: practitioner.id,
        patientId: patient1.id,
        patientName: patient1.name,
        ownerName: patient1.ownerName,
        type: 'Consultation physique',
        date: DateTime.now().minus({ days: 3 }).startOf('day'),
        time: '11:00',
        notes: 'Vérification post-opératoire - tout va bien',
        status: 'completed' as const
      },
      {
        practitionerId: practitioner.id,
        patientId: patient2.id,
        patientName: patient2.name,
        ownerName: patient2.ownerName,
        type: 'Téléconsultation',
        date: DateTime.now().minus({ days: 1 }).startOf('day'),
        time: '15:30',
        notes: 'Suivi traitement anti-puces - amélioration constatée',
        status: 'completed' as const
      }
    ]

    for (const consultationData of consultations) {
      await Consultation.create(consultationData as Consultation)
    }

    console.log('✅ Consultations créées avec succès')
    console.log(`📅 ${consultations.length} consultations créées pour l'utilisateur admin`)
    console.log(`👨‍⚕️ Praticien: ${practitioner.clinicName}`)
    console.log(`🐕 Patients: ${patient1.name}, ${patient2.name}, ${patient3.name}`)
  }
}
