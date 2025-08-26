import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Practitioner from './Practitioner'

export default class Availability extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public practitionerId: number

  @column.dateTime()
  public startTime: DateTime

  @column.dateTime()
  public endTime: DateTime

  @column()
  public isBooked: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Practitioner)
  public practitioner: BelongsTo<typeof Practitioner>

  public serializeExtras() {
    return {
      startTime: this.startTime.toISO(),
      endTime: this.endTime.toISO(),
    }
  }
}
