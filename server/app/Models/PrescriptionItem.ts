import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Prescription from './Prescription'

export default class PrescriptionItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public prescriptionId: number

  @column()
  public medicationName: string

  @column()
  public dosage: string

  @column()
  public frequency: string

  @column()
  public duration: string

  @column()
  public instructions: string | null

  @column()
  public quantity: number

  @column()
  public unit: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relations
  @belongsTo(() => Prescription, {
    foreignKey: 'prescriptionId'
  })
  public prescription: BelongsTo<typeof Prescription>
}
