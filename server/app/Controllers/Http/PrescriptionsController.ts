import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Prescription from 'App/Models/Prescription'
import PrescriptionItem from 'App/Models/PrescriptionItem'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class PrescriptionsController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      let prescriptions
      if (user.roleId === 2) {
        // Vétérinaire : voir toutes ses ordonnances
        prescriptions = await Prescription.query()
          .where('practitionerId', user.id)
          .preload('patient')
          .preload('items')
          .orderBy('prescriptionDate', 'desc')
      } else {
        // Patient : voir ses ordonnances
        prescriptions = await Prescription.query()
          .whereHas('patient', (query) => {
            query.where('ownerEmail', user.email)
          })
          .preload('patient')
          .preload('practitioner')
          .preload('items')
          .orderBy('prescriptionDate', 'desc')
      }

      return response.ok(prescriptions)
    } catch (error) {
      console.error('Erreur dans index:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la récupération des ordonnances' })
    }
  }

  public async show({ params, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      const prescription = await Prescription.query()
        .where('id', params.id)
        .preload('patient')
        .preload('practitioner')
        .preload('items')
        .first()

      if (!prescription) {
        return response.notFound({ message: 'Ordonnance non trouvée' })
      }

      // Vérifier l'accès
      if (user.roleId === 2) {
        // Vétérinaire : peut voir ses propres ordonnances
        if (prescription.practitionerId !== user.id) {
          return response.forbidden({ message: 'Accès non autorisé' })
        }
      } else {
        // Patient : peut voir ses propres ordonnances
        if (prescription.patient.ownerEmail !== user.email) {
          return response.forbidden({ message: 'Accès non autorisé' })
        }
      }

      return response.ok(prescription)
    } catch (error) {
      console.error('Erreur dans show:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la récupération de l\'ordonnance' })
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      if (user.roleId !== 2) {
        return response.forbidden({ message: 'Seuls les vétérinaires peuvent créer des ordonnances' })
      }

      // Validation des données
      const prescriptionSchema = schema.create({
        patientId: schema.number([rules.exists({ table: 'patients', column: 'id' })]),
        consultationId: schema.number.optional([rules.exists({ table: 'consultations', column: 'id' })]),
        prescriptionDate: schema.date(),
        status: schema.enum(['active', 'completed', 'expired']),
        notes: schema.string.optional(),
        items: schema.array().members(
          schema.object().members({
            medicationName: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(100)]),
            dosage: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(100)]),
            frequency: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(100)]),
            duration: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(100)]),
            instructions: schema.string.optional({ trim: true }),
            quantity: schema.number.optional(),
            unit: schema.string.optional({ trim: true })
          })
        )
      })

      const payload = await request.validate({ schema: prescriptionSchema })

      // Créer l'ordonnance
      const prescription = await Prescription.create({
        patientId: payload.patientId,
        practitionerId: user.id,
        consultationId: payload.consultationId,
        prescriptionDate: payload.prescriptionDate,
        status: payload.status as 'completed' | 'active' | 'expired',
        notes: payload.notes
      })

      // Créer les items de prescription
      if (payload.items && payload.items.length > 0) {
        for (const item of payload.items) {
          await PrescriptionItem.create({
            prescriptionId: prescription.id,
            ...item
          })
        }
      }

      // Recharger avec les relations
      await prescription.load('patient')
      await prescription.load('practitioner')
      await prescription.load('items')

      return response.created(prescription)
    } catch (error) {
      console.error('Erreur dans store:', error)
      if (error.messages) {
        return response.badRequest({ message: 'Données invalides', errors: error.messages })
      }
      return response.internalServerError({ message: 'Une erreur est survenue lors de la création de l\'ordonnance' })
    }
  }

  public async update({ params, request, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      if (user.roleId !== 2) {
        return response.forbidden({ message: 'Seuls les vétérinaires peuvent modifier des ordonnances' })
      }

      // Vérifier que l'ordonnance appartient au vétérinaire
      const prescription = await Prescription.query()
        .where('id', params.id)
        .where('practitionerId', user.id)
        .first()

      if (!prescription) {
        return response.notFound({ message: 'Ordonnance non trouvée' })
      }

      // Validation des données
      const prescriptionSchema = schema.create({
        status: schema.enum.optional(['active', 'completed', 'expired']),
        notes: schema.string.optional({ trim: true }),
        items: schema.array.optional().members(
          schema.object().members({
            id: schema.number.optional(),
            medication_name: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(100)]),
            dosage: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(100)]),
            frequency: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(100)]),
            duration: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(100)]),
            instructions: schema.string.optional({ trim: true }),
            quantity: schema.number.optional(),
            unit: schema.string.optional({ trim: true })
          })
        )
      })

      const payload = await request.validate({ schema: prescriptionSchema })

      // Mettre à jour l'ordonnance de base
      if (payload.status || payload.notes !== undefined) {
        prescription.merge({
          status: payload.status || prescription.status,
          notes: payload.notes !== undefined ? payload.notes : prescription.notes
        } as any)
        await prescription.save()
      }

      // Mettre à jour les items si fournis
      if (payload.items) {
        // Supprimer tous les items existants
        await PrescriptionItem.query().where('prescriptionId', prescription.id).delete()

        // Créer les nouveaux items
        for (const item of payload.items) {
          await PrescriptionItem.create({
            prescriptionId: prescription.id,
            medicationName: item.medication_name,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions,
            quantity: item.quantity || 1,
            unit: item.unit || 'comprimé'
          })
        }
      }

      // Recharger avec les relations
      await prescription.load('patient')
      await prescription.load('practitioner')
      await prescription.load('items')

      return response.ok(prescription)
    } catch (error) {
      console.error('Erreur dans update:', error)
      if (error.messages) {
        return response.badRequest({ message: 'Données invalides', errors: error.messages })
      }
      return response.internalServerError({ message: 'Une erreur est survenue lors de la mise à jour de l\'ordonnance' })
    }
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      if (user.roleId !== 2) {
        return response.forbidden({ message: 'Seuls les vétérinaires peuvent supprimer des ordonnances' })
      }

      // Vérifier que l'ordonnance appartient au vétérinaire
      const prescription = await Prescription.query()
        .where('id', params.id)
        .where('practitionerId', user.id)
        .first()

      if (!prescription) {
        return response.notFound({ message: 'Ordonnance non trouvée' })
      }

      // Supprimer l'ordonnance (les items seront supprimés automatiquement grâce à CASCADE)
      await prescription.delete()

      return response.ok({ message: 'Ordonnance supprimée avec succès' })
    } catch (error) {
      console.error('Erreur dans destroy:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la suppression de l\'ordonnance' })
    }
  }

  // Méthode pour générer le PDF
  public async generatePDF({ params, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Non autorisé' })
      }

      // Vérifier que l'ordonnance appartient au vétérinaire ou au patient
      const prescription = await Prescription.query()
        .where('id', params.id)
        .where((query) => {
          query.where('practitionerId', user.id)
            .orWhere('patientId', user.id)
        })
        .preload('patient')
        .preload('practitioner')
        .preload('items')
        .first()

      if (!prescription) {
        return response.notFound({ message: 'Ordonnance non trouvée' })
      }

      // Pour l'instant, retourner le HTML formaté (on pourra ajouter Puppeteer plus tard)
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Ordonnance #${prescription.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .prescription-info { margin-bottom: 30px; }
              .medications { margin-bottom: 30px; }
              .medication-item { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
              .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Ordonnance #${prescription.id}</h1>
              <p>Date: ${new Date(prescription.prescriptionDate + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p>Statut: ${prescription.status}</p>
            </div>
            
            <div class="prescription-info">
              <h3>Informations</h3>
              <p><strong>Patient:</strong> ${prescription.patient?.name || 'N/A'}</p>
              <p><strong>Espèce:</strong> ${prescription.patient?.species || 'N/A'}</p>
              <p><strong>Vétérinaire:</strong> ${prescription.practitioner?.name || 'N/A'}</p>
              ${prescription.notes ? `<p><strong>Notes:</strong> ${prescription.notes}</p>` : ''}
            </div>
            
            <div class="medications">
              <h3>Médicaments prescrits</h3>
              ${prescription.items.map(item => `
                <div class="medication-item">
                  <h4>${item.medicationName || 'Médicament non défini'}</h4>
                  <p><strong>Posologie:</strong> ${item.dosage || 'Non définie'}</p>
                  <p><strong>Fréquence:</strong> ${item.frequency || 'Non définie'}</p>
                  <p><strong>Durée:</strong> ${item.duration || 'Non définie'}</p>
                  ${item.instructions ? `<p><strong>Instructions:</strong> ${item.instructions}</p>` : ''}
                  <p><strong>Quantité:</strong> ${item.quantity || 'Non définie'} ${item.unit || ''}</p>
                </div>
              `).join('')}
            </div>
            
            <div class="footer">
              <p>Ordonnance générée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            </div>
          </body>
        </html>
      `

      // Retourner le HTML avec le bon content-type et headers pour téléchargement
      response.header('Content-Type', 'text/html; charset=utf-8')
      response.header('Content-Disposition', `attachment; filename="ordonnance-${prescription.id}.html"`)
      return response.send(html)
    } catch (error) {
      console.error('Erreur dans generatePDF:', error)
      return response.internalServerError({ message: 'Une erreur est survenue lors de la génération du PDF' })
    }
  }
}
