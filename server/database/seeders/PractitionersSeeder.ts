import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import UserProfile from 'App/Models/Profile'

export default class extends BaseSeeder {
  public async run() {
    // Récupérer le rôle praticien
    const practitionerRole = await Role.query().where('name', 'practitioner').first()
    if (!practitionerRole) {
      console.log('Rôle praticien non trouvé, impossible de créer des praticiens de test')
      return
    }

    // Créer des praticiens de test
    const practitioners = [
      {
        name: 'Dr Ilhem REJEB',
        email: 'ilhem.rejeb@pawmed.com',
        password: 'password123',
        profile: {
          firstName: 'Ilhem',
          lastName: 'REJEB',
          city: 'Saint-Maur-des-Fossés',
          country: 'France',
          phone: '+33 1 23 45 67 89'
        }
      },
      {
        name: 'Dr Jean MARTIN',
        email: 'jean.martin@pawmed.com',
        password: 'password123',
        profile: {
          firstName: 'Jean',
          lastName: 'MARTIN',
          city: 'Paris',
          country: 'France',
          phone: '+33 1 98 76 54 32'
        }
      },
      {
        name: 'Dr Paul BERNARD',
        email: 'paul.bernard@pawmed.com',
        password: 'password123',
        profile: {
          firstName: 'Paul',
          lastName: 'BERNARD',
          city: 'Créteil',
          country: 'France',
          phone: '+33 1 45 67 89 01'
        }
      }
    ]

    for (const practitionerData of practitioners) {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.query().where('email', practitionerData.email).first()
      if (existingUser) {
        console.log(`Utilisateur ${practitionerData.email} existe déjà, ignoré`)
        continue
      }

      // Créer l'utilisateur
      const user = await User.create({
        name: practitionerData.name,
        email: practitionerData.email,
        password: practitionerData.password,
        roleId: practitionerRole.id,
      })

      // Créer le profil
      await UserProfile.create({
        userId: user.id,
        firstName: practitionerData.profile.firstName,
        lastName: practitionerData.profile.lastName,
        city: practitionerData.profile.city,
        country: practitionerData.profile.country,
        phone: practitionerData.profile.phone,
      })

      console.log(`Praticien ${practitionerData.name} créé avec succès`)
    }

    console.log('Praticiens de test créés avec succès')
  }
}
