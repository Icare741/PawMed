import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'prescription_items'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('prescription_id').unsigned().references('id').inTable('prescriptions').onDelete('CASCADE')
      table.string('medication_name').notNullable()
      table.string('dosage').notNullable()
      table.string('frequency').notNullable()
      table.string('duration').notNullable()
      table.text('instructions').nullable()
      table.integer('quantity').defaultTo(1)
      table.string('unit').defaultTo('comprimé')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
