import { getCompleteById } from '../../businesslogic/complete'
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const completeId = event.pathParameters.completeId
    console.log(completeId);
    const userId = await getUserId(event);
    const completeItem = await getCompleteById(userId, completeId); 
    console.log(completeItem); 
    return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
          items: completeItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
  