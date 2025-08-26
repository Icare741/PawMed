import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'

export default class OrdersController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const orders = await Order.query().paginate(page, limit)
      return response.ok(orders)
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la récupération des commandes', error: error.message })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const orderData = request.only(['customer_name', 'customer_email', 'type', 'status', 'date', 'amount'])
      const order = await Order.create(orderData)
      return response.created(order)
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la création de la commande', error: error.message })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const order = await Order.findOrFail(params.id)
      return response.ok(order)
    } catch (error) {
      return response.notFound({ message: 'Commande non trouvée', error: error.message })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const order = await Order.findOrFail(params.id)
      const orderData = request.only(['customer_name', 'customer_email', 'type', 'status', 'date', 'amount'])
      order.merge(orderData)
      await order.save()
      return response.ok(order)
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la mise à jour de la commande', error: error.message })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const order = await Order.findOrFail(params.id)
      await order.delete()
      return response.ok({ message: 'Commande supprimée avec succès' })
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la suppression de la commande', error: error.message })
    }
  }
}
