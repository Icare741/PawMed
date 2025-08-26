import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { DateTime } from 'luxon'
import Availability from './Availability'

export default class Practitioner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public siret: string

  @column()
  public address: string

  @column()
  public phone: string

  @column()
  public speciality: string

  @column()
  public clinicName: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Availability)
  public availabilities: HasMany<typeof Availability>
}
