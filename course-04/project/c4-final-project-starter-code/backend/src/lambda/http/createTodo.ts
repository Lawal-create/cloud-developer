import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import createTodo from '../../functions/createTodo'
import { createLogger } from '../../utils/logger'


const logger = createLogger('create-todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event);
    // TODO: Implement creating a new TODO item
    
    try {
      
      const newItem = await createTodo(newTodo,userId)
      return {
        statusCode: 201,
        body: JSON.stringify({item:newItem})
      }
    } catch (error) {

      logger.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'creation of todo unsuccessful'
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
