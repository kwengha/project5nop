import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateCompleteRequest } from '../../requests/CreateCompleteRequest'
import { getUserId } from '../utils';
import { createCompleteForUser } from '../../businesslogic/complete'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newComplete: CreateCompleteRequest = JSON.parse(event.body)
    const userId = await getUserId(event);
    const completeId = await createCompleteForUser(userId, newComplete);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item:
            {
              completeId: completeId,
              ...newComplete
            }
      })
    };
  }
)

handler.use(
  cors({
    credentials: true
  })
)
