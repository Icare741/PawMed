import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Consultation from './Consultation'
import User from './User'

export default class Patient extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public species: string

  @column()
  public breed: string | null

  @column.date()
  public birthDate: DateTime | null

  @column()
  public ownerName: string

  @column()
  public ownerEmail: string

  @column()
  public ownerPhone: string | null

  @column()
  public medicalHistory: string | null

  @column()
  public userId: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Consultation)
  public consultations: HasMany<typeof Consultation>

  public serializeExtras() {
    return {
      birthDate: this.birthDate?.toFormat('yyyy-MM-dd'),
    }
  }
}
