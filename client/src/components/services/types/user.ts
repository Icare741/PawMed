import moment from 'moment'

export interface Profile {
  id: number
  userId: number
  avatar: string | null
  firstName: string | null
  lastName: string | null
  phone: string | null
  address: string | null
  createdAt: moment.Moment
  updatedAt: moment.Moment
  city: string | null
  state: string | null
  zip: string | null
}

export interface User {
  id: number
  name: string
  email: string
  role_id: number
  status: string
  createdAt: moment.Moment
  updatedAt: moment.Moment
  role?: {
    id: number
    name: string
  }
  profile?: Profile
}
