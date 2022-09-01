/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateCompleteRequest {
  name: string
  dueDate: string
  done: boolean
}