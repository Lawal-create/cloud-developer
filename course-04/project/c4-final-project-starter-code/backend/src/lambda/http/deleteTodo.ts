import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import  deleteTodo from '../../functions/dataLayer/deleteTodo'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'


const logger = createLogger('delete-todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    // TODO: Remove a TODO item by id
    

    try {
      
      await deleteTodo(todoId, userId)
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'item deleted successfully'
        })
      }
    } catch (error) {
      logger.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'deletion of todo item unsuccessful'
        })
      }
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
