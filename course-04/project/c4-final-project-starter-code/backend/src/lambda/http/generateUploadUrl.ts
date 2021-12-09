import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import getUploadUrl from '../../functions/businessLayer/generateUploadUrl'

// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'


const logger = createLogger('upload-url')


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    

    try {
        const userId = getUserId(event)
        const url = await getUploadUrl(todoId,userId);
        return {
          statusCode: 200,
          body: JSON.stringify({
            uploadUrl: url
          })
        }
      } catch (error) {
        logger.error(error)
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Unable to create upload url'
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
