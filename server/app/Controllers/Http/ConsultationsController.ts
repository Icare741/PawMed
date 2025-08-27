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
          .preload('practitioner', (query) => {
            query.preload('user')
          })

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
        .preload('patient')

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

      // Seuls les patients peuvent créer des consultations
      if (user.roleId !== 1) {
        return response.forbidden({ message: 'Seuls les patients peuvent créer des consultations' })
      }

      const validationSchema = schema.create({
        practitionerId: schema.number([rules.exists({ table: 'users', column: 'id' })]),
        patientId: schema.number([rules.exists({ table: 'patients', column: 'id' })]),
        type: schema.string({ trim: true }, [rules.required()]),
        date: schema.string(),
        time: schema.string({}, [rules.required()]),
        notes: schema.string.optional({ trim: true }),
      })

      const validated = await request.validate({ schema: validationSchema })

      // Convertir la date en format DateTime
      const consultationDate = DateTime.fromFormat(validated.date, 'dd/MM')
      if (!consultationDate.isValid) {
        return response.badRequest({ message: 'Format de date invalide. Utilisez DD/MM' })
      }

      // Vérifier que le patient appartient à l'utilisateur connecté
      const patient = await Patient.query()
        .where('id', validated.patientId)
        .where('owner_email', user.email)
        .first()

      if (!patient) {
        return response.forbidden({ message: 'Patient non trouvé ou non autorisé' })
      }

      // Vérifier que le praticien existe et est bien un praticien
      const practitioner = await Practitioner.query()
        .where('user_id', validated.practitionerId)
        .first()

      if (!practitioner) {
        return response.badRequest({ message: 'Praticien non trouvé' })
      }

      // Vérifier que le créneau est disponible
      const existingConsultation = await Consultation.query()
        .where('practitioner_id', practitioner.id)
        .where('date', consultationDate.toFormat('yyyy-MM-dd'))
        .where('time', validated.time)
        .whereNot('status', 'cancelled')
        .first()

      if (existingConsultation) {
        return response.badRequest({ message: 'Ce créneau n\'est plus disponible' })
      }

      // Créer la consultation
      const consultation = await Consultation.create({
        practitionerId: practitioner.id,
        patientId: patient.id,
        patientName: patient.name,
        ownerName: patient.ownerName,
        type: validated.type,
        date: consultationDate,
        time: validated.time,
        notes: validated.notes || null,
        status: 'pending' as const
      })

      await consultation.load('patient')
      await consultation.load('practitioner', (query) => {
        query.preload('user')
      })

      return response.created(consultation)
    } catch (error) {
      console.error('Erreur dans store:', error)
      if (error.code === 'E_VALIDATION_FAILURE') {
        return response.badRequest(error.messages)
      }
      return response.internalServerError({
        message: 'Une erreur est survenue lors de la création de la consultation',
        error: error.message
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

  // Méthode pour récupérer les créneaux disponibles d'un praticien
  public async getAvailableSlots({ params, response }: HttpContextContract) {
    try {
      const practitionerId = Number(params.practitionerId)
      const date = params.date as string
      
      // Convertir la date en format DateTime
      const consultationDate = DateTime.fromFormat(date, 'yyyy-MM-dd')
      if (!consultationDate.isValid) {
        return response.badRequest({ message: 'Format de date invalide. Utilisez YYYY-MM-DD' })
      }

      // Récupérer les consultations existantes pour cette date et ce praticien
      const existingConsultations = await Consultation.query()
        .where('practitioner_id', practitionerId)
        .where('date', consultationDate.toFormat('yyyy-MM-dd'))
        .whereNot('status', 'cancelled')

      // Créneaux disponibles (8h à 18h, toutes les 30 minutes)
      const availableSlots: string[] = []
      const startHour = 8
      const endHour = 18
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          
          // Vérifier si le créneau est libre
          const isBooked = existingConsultations.some(consultation => 
            consultation.time === time
          )
          
          if (!isBooked) {
            availableSlots.push(time)
          }
        }
      }

      return response.ok({ availableSlots })
    } catch (error) {
      console.error('Erreur dans getAvailableSlots:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la récupération des créneaux disponibles' })
    }
  }
}
