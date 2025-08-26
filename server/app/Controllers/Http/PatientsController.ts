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

      const patients = await Patient.query()
        .orderBy('created_at', 'desc')
        .preload('consultations')

      return response.ok(patients)
    } catch (error) {
      console.error('Erreur dans index:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la récupération des patients' })
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      console.log('Données reçues:', request.all())

      const validationSchema = schema.create({
        name: schema.string({ trim: true }, [rules.required()]),
        species: schema.string({ trim: true }, [rules.required()]),
        breed: schema.string.optional({ trim: true }),
        birth_date: schema.date.optional({
          format: 'yyyy-MM-dd',
        }),
        owner_name: schema.string({ trim: true }, [rules.required()]),
        owner_email: schema.string({ trim: true }, [rules.required(), rules.email()]),
        owner_phone: schema.string.optional({ trim: true }),
        medical_history: schema.string.optional({ trim: true })
      })

      const validated = await request.validate({ schema: validationSchema })
      console.log('Données validées:', validated)

      const patient = await Patient.create({
        name: validated.name,
        species: validated.species,
        breed: validated.breed,
        birthDate: validated.birth_date,
        ownerName: validated.owner_name,
        ownerEmail: validated.owner_email,
        ownerPhone: validated.owner_phone,
        medicalHistory: validated.medical_history
      })
      console.log('Patient créé:', patient.toJSON())

      return response.created(patient)
    } catch (error) {
      console.error('Erreur détaillée dans store:', error)
      if (error.code === 'E_VALIDATION_FAILURE') {
        return response.badRequest({
          message: 'Erreur de validation',
          errors: error.messages
        })
      }
      return response.internalServerError({ message: 'Une erreur est survenue lors de la création du patient' })
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
        .preload('consultations')
        .firstOrFail()

      return response.ok(patient)
    } catch (error) {
      console.error('Erreur dans show:', error)
      return response.notFound({ message: 'Patient non trouvé' })
    }
  }

  public async update({ params, request, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      const validationSchema = schema.create({
        name: schema.string.optional({ trim: true }),
        species: schema.string.optional({ trim: true }),
        breed: schema.string.optional({ trim: true }),
        birth_date: schema.date.optional(),
        owner_name: schema.string.optional({ trim: true }),
        owner_email: schema.string.optional({ trim: true }, [rules.email()]),
        owner_phone: schema.string.optional({ trim: true }),
        medical_history: schema.string.optional({ trim: true })
      })

      const validated = await request.validate({ schema: validationSchema })
      const patient = await Patient.findOrFail(params.id)

      patient.merge({
        name: validated.name,
        species: validated.species,
        breed: validated.breed,
        birthDate: validated.birth_date,
        ownerName: validated.owner_name,
        ownerEmail: validated.owner_email,
        ownerPhone: validated.owner_phone,
        medicalHistory: validated.medical_history
      })
      await patient.save()

      return response.ok(patient)
    } catch (error) {
      console.error('Erreur dans update:', error)
      if (error.code === 'E_VALIDATION_FAILURE') {
        return response.badRequest(error.messages)
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

      const patient = await Patient.findOrFail(params.id)
      await patient.delete()

      return response.noContent()
    } catch (error) {
      console.error('Erreur dans destroy:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la suppression du patient' })
    }
  }
}
