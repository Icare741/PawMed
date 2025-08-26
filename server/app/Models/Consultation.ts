import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Practitioner from './Practitioner'
import Patient from './Patient'
import Availability from './Availability'

export default class Consultation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public practitionerId: number

  @column()
  public patientId: number | null

  @column()
  public availabilityId: number | null

  @column()
  public patientName: string

  @column()
  public ownerName: string

  @column()
  public type: string

  @column.date()
  public date: DateTime

  @column()
  public time: string

  @column()
  public status: 'pending' | 'completed' | 'cancelled'

  @column()
  public notes: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Practitioner)
  public practitioner: BelongsTo<typeof Practitioner>

  @belongsTo(() => Patient)
  public patient: BelongsTo<typeof Patient>

  @belongsTo(() => Availability)
  public availability: BelongsTo<typeof Availability>

  public serializeExtras() {
    return {
      date: this.date.toFormat('yyyy-MM-dd'),
    }
  }
}
