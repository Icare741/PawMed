import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'patients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('species').notNullable()
      table.string('breed')
      table.date('birth_date')
      table.string('owner_name').notNullable()
      table.string('owner_email').notNullable()
      table.string('owner_phone')
      table.text('medical_history')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
