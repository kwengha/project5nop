import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateCompleteRequest } from '../../requests/UpdateCompleteRequest'
import { getUserId } from '../utils'
import { updateComplete } from '../../businesslogic/complete'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const completeId = event.pathParameters.completeId
    const updatedComplete: UpdateCompleteRequest = JSON.parse(event.body)
    const userId = await getUserId(event);
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    await updateComplete(userId, completeId, updatedComplete)
    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )