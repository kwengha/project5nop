import { apiEndpoint } from '../config'
import { Complete } from '../types/Complete';
import { CreateCompleteRequest } from '../types/CreateCompleteRequest';
import Axios from 'axios'
import { UpdateCompleteRequest } from '../types/UpdateCompleteRequest';

export async function getCompletes(idToken: string): Promise<Complete[]> {
  console.log('Fetching completes')

  const response = await Axios.get(`${apiEndpoint}/completes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Completes:', response.data)
  return response.data.items
}

export async function getCompleteById(idToken: string, completeId: string): Promise<Complete> {
  console.log('Fetching completes by id')

  const response = await Axios.get(`${apiEndpoint}/completes/${completeId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Completes:', response.data)
  return response.data.items
}

export async function createComplete(
  idToken: string,
  newComplete: CreateCompleteRequest
): Promise<Complete> {
  const response = await Axios.post(`${apiEndpoint}/completes`,  JSON.stringify(newComplete), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchComplete(
  idToken: string,
  completeId: string,
  updatedComplete: UpdateCompleteRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/completes/${completeId}`, JSON.stringify(updatedComplete), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteComplete(
  idToken: string,
  completeId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/completes/${completeId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  completeId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/completes/${completeId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
