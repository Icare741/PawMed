import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('description')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    // Insérer les rôles par défaut
    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([
        {
          id: 1,
          name: 'user',
          description: 'Utilisateur standard'
        },
        {
          id: 2,
          name: 'practitioner',
          description: 'Praticien vétérinaire'
        }
      ])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}