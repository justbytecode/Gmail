export interface Label {
  id: string
  name: string
  color: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UserLabel {
  id: string
  userId: string
  labelId: string
  label: Label
}