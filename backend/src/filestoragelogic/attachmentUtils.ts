import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger';

const logger = createLogger('AttachmentUtils')

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const bucketName = process.env.COMPLETE_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3 = new XAWS.S3({signatureVersion: 'v4'});

export class AttachmentUtils{

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly completeTable = process.env.COMPLETE_TABLE) {
    }

    async createAttachmentPresignedUrl (completeId: string): Promise<string> {
        return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: completeId,
        Expires: parseInt(urlExpiration)
      });
   }

    async updateCompleteAttachmentUrl(completeId: string, attachmentUrl: string, userId: string){
        logger.info(`updateCompleteAttachmentUrl completeId ${completeId} with attachmentUrl ${attachmentUrl}`)

        await this.docClient.update({
            TableName: this.completeTable,
            Key: {
                completeId: completeId,
                userId: userId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${completeId}`
            }
        }).promise();
    }

}