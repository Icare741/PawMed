import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Order from 'App/Models/Order'

export default class OrdersSeeder extends BaseSeeder {
  public async run() {
    const today = new Date()
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twoMonthsAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)

    await Order.createMany([
      // Commandes récentes
      {
        customerName: 'Jean Dupont',
        customerEmail: 'jean@example.com',
        type: 'Standard',
        status: 'Livré',
        date: oneWeekAgo.toISOString().split('T')[0],
        amount: 150.50,
      },
      {
        customerName: 'Marie Martin',
        customerEmail: 'marie@example.com',
        type: 'Express',
        status: 'En cours',
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: 225.75,
      },
      {
        customerName: 'Pierre Dubois',
        customerEmail: 'pierre@example.com',
        type: 'Standard',
        status: 'En cours',
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: 89.99,
      },
      {
        customerName: 'Sophie Leroy',
        customerEmail: 'sophie@example.com',
        type: 'Premium',
        status: 'Livré',
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: 399.00,
      },
      {
        customerName: 'Luc Moreau',
        customerEmail: 'luc@example.com',
        type: 'Standard',
        status: 'Annulé',
        date: today.toISOString().split('T')[0],
        amount: 75.50,
      },
      // Commandes plus anciennes
      {
        customerName: 'Émilie Rousseau',
        customerEmail: 'emilie@example.com',
        type: 'Premium',
        status: 'Livré',
        date: oneMonthAgo.toISOString().split('T')[0],
        amount: 299.99,
      },
      {
        customerName: 'Thomas Bernard',
        customerEmail: 'thomas@example.com',
        type: 'Standard',
        status: 'Livré',
        date: new Date(oneMonthAgo.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: 120.75,
      },
      {
        customerName: 'Claire Dupuis',
        customerEmail: 'claire@example.com',
        type: 'Express',
        status: 'Livré',
        date: twoMonthsAgo.toISOString().split('T')[0],
        amount: 189.50,
      },
    ])
  }
}
