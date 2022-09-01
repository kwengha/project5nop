export interface CompleteItem {
  userId: string
  completeId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
