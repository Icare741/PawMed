import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'availabilities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('practitioner_id').unsigned().references('id').inTable('practitioners').onDelete('CASCADE')
      table.timestamp('start_time', { useTz: true }).notNullable()
      table.timestamp('end_time', { useTz: true }).notNullable()
      table.boolean('is_booked').defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
