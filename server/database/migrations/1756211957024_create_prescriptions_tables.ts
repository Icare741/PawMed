import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'prescriptions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('patient_id').unsigned().references('id').inTable('patients').onDelete('CASCADE')
      table.integer('practitioner_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('consultation_id').unsigned().references('id').inTable('consultations').onDelete('SET NULL').nullable()
      table.date('prescription_date').notNullable()
      table.enum('status', ['active', 'completed', 'expired']).defaultTo('active')
      table.text('notes').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
