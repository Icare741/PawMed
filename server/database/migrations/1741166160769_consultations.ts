import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'consultations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('practitioner_id')
        .unsigned()
        .references('id')
        .inTable('practitioners')
        .onDelete('CASCADE')
        .notNullable()

      table.integer('patient_id')
        .unsigned()
        .references('id')
        .inTable('patients')
        .onDelete('SET NULL')
        .nullable()

      table.integer('availability_id')
        .unsigned()
        .references('id')
        .inTable('availabilities')
        .onDelete('SET NULL')
        .nullable()

      table.string('patient_name').notNullable()
      table.string('owner_name').notNullable()
      table.string('type').notNullable()
      table.date('date').notNullable()
      table.string('time').notNullable()
      table.enum('status', ['pending', 'completed', 'cancelled']).defaultTo('pending').notNullable()
      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
