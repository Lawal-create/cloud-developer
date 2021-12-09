import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';
import getTodos from '../../functions/dataLayer/getTodos'
import { createLogger } from '../../utils/logger'


const logger = createLogger('get-todos')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    try {
      const userId = getUserId(event)
      const todos = await getTodos(userId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          items:todos
        })
      }
    } catch (error) {
      logger.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'unable to get all todo items for user'
        })
      }
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
