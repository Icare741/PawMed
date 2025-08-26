import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Consultation from 'App/Models/Consultation'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import Practitioner from 'App/Models/Practitioner'
import Availability from 'App/Models/Availability'
import Patient from 'App/Models/Patient'

export default class ConsultationsController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      // Si c'est un praticien
      if (user.roleId === 2) {
        const practitioner = await Practitioner.findBy('user_id', user.id)
        if (!practitioner) {
          return response.notFound({ message: 'Praticien non trouvé' })
        }

        const consultations = await Consultation.query()
          .where('practitioner_id', practitioner.id)
          .orderBy('date', 'asc')
          .orderBy('time', 'asc')
          .preload('patient')

        return response.ok(consultations)
      }

      // Si c'est un patient
      const consultations = await Consultation.query()
        .whereHas('patient', (query) => {
          query.where('owner_email', user.email)
        })
        .orderBy('date', 'asc')
        .orderBy('time', 'asc')
        .preload('practitioner', (query) => {
          query.preload('user')
        })

      return response.ok(consultations)
    } catch (error) {
      console.error('Erreur dans index:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la récupération des consultations' })
    }
  }

  public async stats({ auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user || user.roleId !== 2) {
        return response.forbidden({ message: 'Accès non autorisé' })
      }

      const practitioner = await Practitioner.findBy('user_id', user.id)
      if (!practitioner) {
        return response.notFound({ message: 'Praticien non trouvé' })
      }

      const today = DateTime.now().startOf('day')

      // Consultations du jour
      const dailyConsultations = await Consultation.query()
        .where('practitioner_id', practitioner.id)
        .where('date', today.toSQL())
        .count('* as total')

      // Nouveaux patients des 30 derniers jours
      const thirtyDaysAgo = today.minus({ days: 30 })
      const newPatients = await Patient.query()
        .where('created_at', '>=', thirtyDaysAgo.toSQL())
        .count('* as total')

      // Heures de consultation aujourd'hui
      const consultationsToday = await Consultation.query()
        .where('practitioner_id', practitioner.id)
        .where('date', today.toSQL())

      const consultationHours = consultationsToday.length

      // Prochaine disponibilité
      const nextAvailability = await Availability.query()
        .where('practitioner_id', practitioner.id)
        .where('start_time', '>=', DateTime.now().toSQL())
        .where('is_booked', false)
        .orderBy('start_time', 'asc')
        .first()

      const nextAvailabilityStr = nextAvailability
        ? DateTime.fromISO(nextAvailability.startTime.toString()).toFormat('dd/MM/yyyy HH:mm')
        : 'Aucune disponibilité'

      return response.ok({
        dailyConsultations: Number(dailyConsultations[0].$extras.total) || 0,
        newPatients: Number(newPatients[0].$extras.total) || 0,
        consultationHours,
        nextAvailability: nextAvailabilityStr,
      })
    } catch (error) {
      console.error('Erreur dans stats:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la récupération des statistiques' })
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      const validationSchema = schema.create({
        type: schema.string({ trim: true }, [rules.required()]),
        date: schema.date({}, [rules.required()]),
        time: schema.string({}, [rules.required()]),
        notes: schema.string.optional({ trim: true }),
        availabilityId: schema.number([
          rules.exists({ table: 'availabilities', column: 'id' })
        ])
      })

      const validated = await request.validate({ schema: validationSchema })

      // Récupérer la disponibilité
      const availability = await Availability.findOrFail(validated.availabilityId)

      // Vérifier que la disponibilité n'est pas déjà réservée
      if (availability.isBooked) {
        return response.badRequest({ message: 'Cette disponibilité est déjà réservée' })
      }

      // Récupérer ou créer le patient associé à l'utilisateur connecté
      let patient = await Patient.findBy('owner_email', user.email)
      if (!patient) {
        // Créer un nouveau patient avec les informations de l'utilisateur
        patient = await Patient.create({
          name: 'À renseigner',
          species: 'À renseigner',
          ownerName: user.name,
          ownerEmail: user.email
        })
      }

      // Format the date properly for MySQL by setting it to start of day
      const formattedDate = validated.date.startOf('day')

      // Créer la consultation
      const consultation = await Consultation.create({
        practitionerId: availability.practitionerId,
        patientId: patient.id,
        availabilityId: validated.availabilityId,
        patientName: patient.name,
        ownerName: patient.ownerName,
        type: validated.type,
        date: formattedDate,
        time: validated.time,
        notes: validated.notes || null,
        status: 'pending' as const
      })

      // Marquer la disponibilité comme réservée
      availability.isBooked = true
      await availability.save()

      return response.created(consultation)
    } catch (error) {
      console.error('Erreur complète dans store:', error)
      if (error.code === 'E_VALIDATION_FAILURE') {
        return response.badRequest(error.messages)
      }
      return response.internalServerError({
        message: 'Une erreur est survenue lors de la création de la consultation',
        error: error.message,
        details: error
      })
    }
  }

  public async update({ params, request, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user || user.roleId !== 2) {
        return response.forbidden({ message: 'Accès non autorisé' })
      }

      const practitioner = await Practitioner.findBy('user_id', user.id)
      if (!practitioner) {
        return response.notFound({ message: 'Praticien non trouvé' })
      }

      const consultation = await Consultation.query()
        .where('id', params.id)
        .where('practitioner_id', practitioner.id)
        .first()

      if (!consultation) {
        return response.notFound({ message: 'Consultation non trouvée' })
      }

      const validationSchema = schema.create({
        status: schema.enum(['pending', 'completed', 'cancelled'] as const),
        notes: schema.string.optional({ trim: true })
      })

      const validated = await request.validate({ schema: validationSchema })

      consultation.merge(validated)
      await consultation.save()

      return response.ok(consultation)
    } catch (error) {
      console.error('Erreur dans update:', error)
      if (error.code === 'E_VALIDATION_FAILURE') {
        return response.badRequest(error.messages)
      }
      return response.internalServerError({ message: 'Une erreur est survenue lors de la mise à jour de la consultation' })
    }
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user || user.roleId !== 2) {
        return response.forbidden({ message: 'Accès non autorisé' })
      }

      const practitioner = await Practitioner.findBy('user_id', user.id)
      if (!practitioner) {
        return response.notFound({ message: 'Praticien non trouvé' })
      }

      const consultation = await Consultation.query()
        .where('id', params.id)
        .where('practitioner_id', practitioner.id)
        .first()

      if (!consultation) {
        return response.notFound({ message: 'Consultation non trouvée' })
      }

      await consultation.delete()

      return response.noContent()
    } catch (error) {
      console.error('Erreur dans destroy:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la suppression de la consultation' })
    }
  }
}
