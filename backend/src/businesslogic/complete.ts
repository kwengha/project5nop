import { CompleteItem } from '../models/CompleteItem';
import { CompletesAccess } from '../datalayerlogic/completeAcess'
import { AttachmentUtils } from '../filestoragelogic/attachmentUtils';
import { CreateCompleteRequest} from '../requests/CreateCompleteRequest'
import { UpdateCompleteRequest } from '../requests/UpdateCompleteRequest'

// TODO: Implement businessLogic
const completeAccess = new CompletesAccess();
const attachmentUtils = new AttachmentUtils();

export async function getCompletesForUser(userId:string): Promise<CompleteItem[]>{
    return await completeAccess.getCompletesForUser(userId);
}

export async function getCompleteById(userId:string, completeId:string): Promise<CompleteItem>{
    return await completeAccess.getCompleteById(userId, completeId);
}

export async function createCompleteForUser(userId: string, newComplete: CreateCompleteRequest): Promise<string>{
    return await completeAccess.createCompleteForUser(userId, newComplete);
}

export async function deleteComplete(completeId: string, userId: string){
    return await completeAccess.deleteComplete(completeId, userId);
}

export async function updateComplete(userId: String, completeId: string, updatedComplete: UpdateCompleteRequest){
    return await completeAccess.updateComplete(userId, completeId, updatedComplete);
}

export async function createAttachmentPresignedUrl (completeId: string): Promise<string> {
    return await attachmentUtils.createAttachmentPresignedUrl(completeId);
}

export async function updateCompleteAttachmentUrl(completeId: string, attachmentUrl: string, userId: string){
    return await attachmentUtils.updateCompleteAttachmentUrl(completeId, attachmentUrl, userId);
}