import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Availability from 'App/Models/Availability'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Practitioner from 'App/Models/Practitioner'
import { startOfDay } from 'date-fns'

export default class AvailabilitiesController {
  public async index({ auth, response, request }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      // Si c'est un praticien, on retourne ses disponibilités
      if (user.roleId === 2) {
        let practitioner = await Practitioner.findBy('user_id', user.id)
        if (!practitioner) {
          practitioner = await Practitioner.create({
            userId: user.id,
            clinicName: 'À configurer',
            speciality: 'À configurer'
          })
        }

        const availabilities = await Availability.query()
          .where('practitioner_id', practitioner.id)
          .orderBy('start_time', 'asc')

        return response.ok(availabilities)
      }

      // Si c'est un patient, on retourne toutes les disponibilités non réservées
      const availabilities = await Availability.query()
        .where('is_booked', false)
        .where('start_time', '>=', startOfDay(new Date()))
        .orderBy('start_time', 'asc')
        .preload('practitioner', (query) => {
          query.preload('user')
        })


      return response.ok(availabilities)
    } catch (error) {
      console.error('Erreur dans index:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la récupération des disponibilités' })
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user || user.roleId !== 2) {
        return response.forbidden({ message: 'Seuls les praticiens peuvent gérer leurs disponibilités' })
      }

      // Chercher ou créer le praticien s'il n'existe pas
      let practitioner = await Practitioner.findBy('user_id', user.id)
      if (!practitioner) {
        practitioner = await Practitioner.create({
          userId: user.id,
          clinicName: 'À configurer',
          speciality: 'À configurer'
        })
      }

      const validationSchema = schema.create({
        startTime: schema.date({}, [
          rules.required()
        ]),
        endTime: schema.date({}, [
          rules.required(),
          rules.afterField('startTime')
        ])
      })

      const validated = await request.validate({ schema: validationSchema })

      const availability = await Availability.create({
        practitionerId: practitioner.id,
        startTime: validated.startTime,
        endTime: validated.endTime,
        isBooked: false
      })

      return response.created(availability)
    } catch (error) {
      console.error('Erreur dans store:', error)
      if (error.code === 'E_VALIDATION_FAILURE') {
        return response.badRequest(error.messages)
      }
      return response.internalServerError({ message: 'Une erreur est survenue lors de la création de la disponibilité' })
    }
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user || user.roleId !== 2) {
        return response.forbidden({ message: 'Seuls les praticiens peuvent gérer leurs disponibilités' })
      }

      const practitioner = await Practitioner.findBy('user_id', user.id)
      if (!practitioner) {
        return response.forbidden({ message: 'Praticien non trouvé' })
      }

      const availability = await Availability.query()
        .where('id', params.id)
        .where('practitioner_id', practitioner.id)
        .first()

      if (!availability) {
        return response.notFound({ message: 'Disponibilité non trouvée' })
      }

      if (availability.isBooked) {
        return response.forbidden({ message: 'Impossible de supprimer une disponibilité déjà réservée' })
      }

      await availability.delete()

      return response.noContent()
    } catch (error) {
      console.error('Erreur dans destroy:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la suppression de la disponibilité' })
    }
  }
}
