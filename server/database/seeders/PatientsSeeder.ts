import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Patient from 'App/Models/Patient'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class PatientsSeeder extends BaseSeeder {
  public async run() {
    // Récupérer l'utilisateur admin
    const adminUser = await User.findBy('email', 'admin@admin.com')
    if (!adminUser) {
      console.log('❌ Utilisateur admin non trouvé. Lancez d\'abord UserSeeder.')
      return
    }

    // Créer des patients de test pour l'admin
    const patients = [
      {
        name: 'Médor',
        species: 'Chien',
        breed: 'Golden Retriever',
        birthDate: DateTime.fromISO('2020-03-15'),
        ownerName: adminUser.name,
        ownerEmail: adminUser.email,
        ownerPhone: '+33 6 34 53 46 46',
        medicalHistory: 'Vaccinations à jour, pas d\'antécédents particuliers. Castré en 2021.',
        userId: adminUser.id
      },
      {
        name: 'Félix',
        species: 'Chat',
        breed: 'Chat Européen',
        birthDate: DateTime.fromISO('2019-07-22'),
        ownerName: adminUser.name,
        ownerEmail: adminUser.email,
        ownerPhone: '+33 6 34 53 46 46',
        medicalHistory: 'Castré, vaccins à jour. Allergie aux produits laitiers.',
        userId: adminUser.id
      },
      {
        name: 'Luna',
        species: 'Chat',
        breed: 'Siamois',
        birthDate: DateTime.fromISO('2021-01-10'),
        ownerName: adminUser.name,
        ownerEmail: adminUser.email,
        ownerPhone: '+33 6 34 53 46 46',
        medicalHistory: 'Vaccinations à jour, pas d\'antécédents. Très sociable.',
        userId: adminUser.id
      },
      {
        name: 'Rex',
        species: 'Chien',
        breed: 'Berger Allemand',
        birthDate: DateTime.fromISO('2018-11-05'),
        ownerName: adminUser.name,
        ownerEmail: adminUser.email,
        ownerPhone: '+33 6 34 53 46 46',
        medicalHistory: 'Vaccins à jour, opéré de la hanche en 2022. Très actif.',
        userId: adminUser.id
      },
      {
        name: 'Misty',
        species: 'Chat',
        breed: 'Persan',
        birthDate: DateTime.fromISO('2020-09-18'),
        ownerName: adminUser.name,
        ownerEmail: adminUser.email,
        ownerPhone: '+33 6 34 53 46 46',
        medicalHistory: 'Vaccinations à jour, nécessite un brossage régulier.',
        userId: adminUser.id
      }
    ]

    for (const patientData of patients) {
      await Patient.create(patientData)
    }

    console.log('✅ Patients créés avec succès')
    console.log(`🐕 ${patients.length} patients créés pour l'utilisateur admin`)
    console.log(`👤 Propriétaire: ${adminUser.name} (${adminUser.email})`)
    console.log(`🐾 Animaux: ${patients.map(p => p.name).join(', ')}`)
  }
}
