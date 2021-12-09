import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'


const XAWS = AWSXRay.captureAWS(AWS);
const docClient = new XAWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE
const s3Client = new S3Client({ region: 'us-east-2'})
const logger = createLogger('s3upload');
const todoBucket = process.env.ATTACHMENT_S3_BUCKET
const urlExpires = process.env.SIGNED_URL_EXPIRATION


const getUploadUrl = async (todoId: string, userId: string)=>{
    logger.info('Generating Url')


    const params: PutObjectCommandInput = {
        Bucket: todoBucket,
        Key: todoId
    }

    const command = new PutObjectCommand(params);
    const url: string = await getSignedUrl(s3Client, command, {expiresIn: parseInt(urlExpires)})

    const imageUrl = `https://${todoBucket}.s3.us-east-2.amazonaws.com/${todoId}` 

    const updateUrlOnTodo = {
        TableName: todoTable,
        Key: { 
          todoId: todoId,
          userId: userId, 
           },
        UpdateExpression: "set attachmentUrl = :a",
        ExpressionAttributeValues: {
          ":a": imageUrl,
        },
        ReturnValues: "UPDATED_NEW",
      };
    
      await docClient.update(updateUrlOnTodo).promise();
    return url
}

export default getUploadUrl