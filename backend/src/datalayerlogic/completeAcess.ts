import { UpdateCompleteRequest } from '../requests/UpdateCompleteRequest';
import { CreateCompleteRequest } from '../requests/CreateCompleteRequest';
import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { CompleteItem } from '../models/CompleteItem'
import * as uuid from 'uuid'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('CompletesAccess')

// TODO: Implement the dataLayer logic
export class CompletesAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly completeTable = process.env.COMPLETE_TABLE,
       
        ) {
    }

    async getCompletesForUser(userId: string): Promise<CompleteItem[]> {
        logger.info(`getCompletesForUser by ${userId}`);
        const result = await this.docClient.query({
            TableName: this.completeTable,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            },
            ScanIndexForward: false
        }).promise();

        const items = result.Items
        console.log("db: ", result);
        return items as CompleteItem[]
    }

    async getCompleteById(userId: string, completeId: string): Promise<CompleteItem> {
        logger.info(`getCompleteById by ${userId}`);
        const result = await this.docClient.get({
            TableName: this.completeTable,
            Key: {
                userId,
                completeId
            }
          }).promise()
    
        const item = result.Item
        return item as CompleteItem
    }

    async createCompleteForUser(userId: string, newComplete: CreateCompleteRequest): Promise<string> {
        const completeId = uuid.v4();
        logger.info(`createCompleteForUser with completeId: ${completeId}`);
        const newCompleteWithAdditionalInfo = {
            userId: userId,
            completeId: completeId,
            createAt: new Date().toISOString(),
            done: false,
            ...newComplete
        }

        await this.docClient.put({
            TableName: this.completeTable,
            Item: newCompleteWithAdditionalInfo
        }).promise();

        return completeId;

    }

    async deleteComplete(completeId: string, userId: string) {
        logger.info(`deleteComplete with completeId: ${completeId} and userId: ${userId}`);
        await this.docClient.delete({
            TableName: this.completeTable,
            Key: {
                userId: userId,
                completeId: completeId
            }
        }).promise();
    
    }

    async updateComplete(userId: String, completeId: string, updatedComplete: UpdateCompleteRequest){
        logger.info(`updateComplete with completeId: ${userId} and with completeId: ${completeId}`)
        await this.docClient.update({
            TableName: this.completeTable,
            Key: {
                "completeId": completeId,
                "userId": userId
            },
            UpdateExpression: "set #completeName = :name, done = :done, dueDate = :dueDate",
            ExpressionAttributeNames: {
                "#completeName": "name"
            },
            ExpressionAttributeValues: {
                ":name": updatedComplete.name,
                ":done": updatedComplete.done,
                ":dueDate": updatedComplete.dueDate
            }
        }).promise()

    }
}