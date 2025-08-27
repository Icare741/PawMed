import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class PractitionersController {
  // Récupérer tous les praticiens
  public async index({ response }: HttpContextContract) {
    try {
      const practitioners = await User.query()
        .where('roleId', 2) // Role praticien
        .preload('profile')
        .orderBy('name', 'asc')

      const formattedPractitioners = practitioners.map(practitioner => ({
        id: practitioner.id,
        name: practitioner.name,
        speciality: 'Vétérinaire Généraliste', // Champ fixe pour l'instant
        city: practitioner.profile?.city || 'Non spécifiée',
        avatar: practitioner.profile?.avatar || null,
        userId: practitioner.id,
        createdAt: practitioner.createdAt,
        updatedAt: practitioner.updatedAt,
      }))

      return response.ok(formattedPractitioners)
    } catch (error) {
      console.error('Erreur dans index:', error)
      return response.internalServerError({ message: 'Une erreur est survenue' })
    }
  }

  // Récupérer un praticien spécifique
  public async show({ params, response }: HttpContextContract) {
    try {
      const practitioner = await User.query()
        .where('id', params.id)
        .where('roleId', 2)
        .preload('profile')
        .first()

      if (!practitioner) {
        return response.notFound({ message: 'Praticien non trouvé' })
      }

      const formattedPractitioner = {
        id: practitioner.id,
        name: practitioner.name,
        speciality: 'Vétérinaire Généraliste', // Champ fixe pour l'instant
        city: practitioner.profile?.city || 'Non spécifiée',
        avatar: practitioner.profile?.avatar || null,
        userId: practitioner.id,
        createdAt: practitioner.createdAt,
        updatedAt: practitioner.updatedAt,
      }

      return response.ok(formattedPractitioner)
    } catch (error) {
      console.error('Erreur dans show:', error)
      return response.internalServerError({ message: 'Une erreur est survenue' })
    }
  }

  // Mettre à jour un praticien
  public async update({ params, request, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      // Seuls les praticiens peuvent modifier leur profil
      if (user.roleId !== 2 || user.id !== parseInt(params.id)) {
        return response.forbidden({ message: 'Accès non autorisé' })
      }

      // Mettre à jour le profil
      if (user.profile) {
        const city = request.input('city')
        const avatar = request.input('avatar')
        
        if (city) user.profile.city = city
        if (avatar) user.profile.avatar = avatar
        
        await user.profile.save()
      }

      await user.load('profile')

      const formattedPractitioner = {
        id: user.id,
        name: user.name,
        speciality: 'Vétérinaire Généraliste', // Champ fixe pour l'instant
        city: user.profile?.city || 'Non spécifiée',
        avatar: user.profile?.avatar || null,
        userId: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }

      return response.ok(formattedPractitioner)
    } catch (error) {
      console.error('Erreur dans update:', error)
      return response.internalServerError({ message: 'Une erreur est survenue' })
    }
  }

  // Supprimer un praticien
  public async destroy({ params, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      // Seuls les administrateurs peuvent supprimer des praticiens
      if (user.roleId !== 3) {
        return response.forbidden({ message: 'Accès non autorisé' })
      }

      const practitioner = await User.query()
        .where('id', params.id)
        .where('roleId', 2)
        .first()

      if (!practitioner) {
        return response.notFound({ message: 'Praticien non trouvé' })
      }

      await practitioner.delete()

      return response.ok({ message: 'Praticien supprimé avec succès' })
    } catch (error) {
      console.error('Erreur dans destroy:', error)
      return response.internalServerError({ message: 'Une erreur est survenue' })
    }
  }
}
