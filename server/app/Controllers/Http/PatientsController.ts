import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Patient from 'App/Models/Patient'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

export default class PatientsController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      // Si c'est un praticien, récupérer ses patients (ceux avec qui il a eu des consultations)
      if (user.roleId === 2) {
        const patients = await Patient.query()
          .whereHas('consultations', (query) => {
            query.whereHas('practitioner', (practitionerQuery) => {
              practitionerQuery.where('user_id', user.id)
            })
          })
          .orderBy('name', 'asc')
          .preload('consultations', (query) => {
            query.whereHas('practitioner', (practitionerQuery) => {
              practitionerQuery.where('user_id', user.id)
            }).orderBy('date', 'desc').limit(5)
          })
          .distinct()

        return response.ok(patients)
      }

      // Sinon, récupérer tous les patients de l'utilisateur connecté (propriétaire)
      const patients = await Patient.query()
        .where('ownerEmail', user.email)
        .orderBy('name', 'asc')
        .preload('consultations', (query) => {
          query.orderBy('date', 'desc').limit(5)
        })

      return response.ok(patients)
    } catch (error) {
      console.error('Erreur dans index:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la récupération des patients' })
    }
  }

  // Nouvelle méthode pour que les praticiens puissent voir tous les patients disponibles
  public async allForPractitioner({ auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      if (user.roleId !== 2) {
        return response.forbidden({ message: 'Accès réservé aux praticiens' })
      }

      // Récupérer tous les patients disponibles pour le praticien
      const patients = await Patient.query()
        .orderBy('name', 'asc')
        .preload('consultations', (query) => {
          query.whereHas('practitioner', (practitionerQuery) => {
            practitionerQuery.where('user_id', user.id)
          }).orderBy('date', 'desc')
        })

      return response.ok(patients)
    } catch (error) {
      console.error('Erreur dans allForPractitioner:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la récupération des patients' })
    }
  }

  public async show({ params, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      const patient = await Patient.query()
        .where('id', params.id)
        .where('ownerEmail', user.email)
        .preload('consultations', (query) => {
          query.orderBy('date', 'desc')
        })
        .first()

      if (!patient) {
        return response.notFound({ message: 'Patient non trouvé' })
      }

      return response.ok(patient)
    } catch (error) {
      console.error('Erreur dans show:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la récupération du patient' })
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      // Validation des données
      const patientSchema = schema.create({
        name: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(50)]),
        species: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(30)]),
        breed: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
        birthDate: schema.string.optional(), // Changé de schema.date.optional() à schema.string.optional()
        ownerName: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(100)]),
        ownerPhone: schema.string.optional({ trim: true }, [rules.maxLength(20)]),
        medicalHistory: schema.string.optional({ trim: true })
      })

      const payload = await request.validate({ schema: patientSchema })

      // Créer le patient
      const patient = await Patient.create({
        ...payload,
        birthDate: payload.birthDate ? DateTime.fromISO(payload.birthDate) : null,
        ownerEmail: user.email, // Forcer l'email de l'utilisateur connecté
        userId: user.id
      })

      return response.created(patient)
    } catch (error) {
      console.error('Erreur dans store:', error)
      if (error.messages) {
        return response.badRequest({ message: 'Données invalides', errors: error.messages })
      }
      return response.internalServerError({ message: 'Une erreur est survenue lors de la création du patient' })
    }
  }

  public async update({ params, request, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      // Vérifier que le patient appartient à l'utilisateur
      const patient = await Patient.query()
        .where('id', params.id)
        .where('ownerEmail', user.email)
        .first()

      if (!patient) {
        return response.notFound({ message: 'Patient non trouvé' })
      }

      // Validation des données
      const patientSchema = schema.create({
        name: schema.string.optional({ trim: true }, [rules.minLength(2), rules.maxLength(50)]),
        species: schema.string.optional({ trim: true }, [rules.minLength(2), rules.maxLength(30)]),
        breed: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
        birthDate: schema.date.optional(),
        ownerName: schema.string.optional({ trim: true }, [rules.minLength(2), rules.maxLength(100)]),
        ownerPhone: schema.string.optional({ trim: true }, [rules.maxLength(20)]),
        medicalHistory: schema.string.optional({ trim: true })
      })

      const payload = await request.validate({ schema: patientSchema })

      // Mettre à jour le patient
      patient.merge(payload)
      await patient.save()

      return response.ok(patient)
    } catch (error) {
      console.error('Erreur dans update:', error)
      if (error.messages) {
        return response.badRequest({ message: 'Données invalides', errors: error.messages })
      }
      return response.internalServerError({ message: 'Une erreur est survenue lors de la mise à jour du patient' })
    }
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      // Vérifier que le patient appartient à l'utilisateur
      const patient = await Patient.query()
        .where('id', params.id)
        .where('ownerEmail', user.email)
        .first()

      if (!patient) {
        return response.notFound({ message: 'Patient non trouvé' })
      }

      // Supprimer le patient
      await patient.delete()

      return response.ok({ message: 'Patient supprimé avec succès' })
    } catch (error) {
      console.error('Erreur dans destroy:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la suppression du patient' })
    }
  }
}
