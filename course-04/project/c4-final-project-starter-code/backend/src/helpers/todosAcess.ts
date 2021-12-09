import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'

const XAWS = AWSXRay.captureAWS(AWS);

const docClient = new XAWS.DynamoDB.DocumentClient()
const userIdIndex = process.env.USER_ID_INDEX
const todoTable = process.env.TODOS_TABLE

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
const createTodoItem = async(newTodo: any)=>{
    logger.info('creating a new todo item')
    await docClient.put({
        TableName: todoTable,
        Item: newTodo
    }).promise()

    return newTodo
}

const getTodoItems = async(userId: string):Promise<TodoItem[]>=>{

    const result = await docClient.query({ // IAM permission - dynamodb:Query
        TableName: todoTable,
        IndexName: userIdIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues:{
          ":userId":userId
        }
      }).promise()
  
      const items = result.Items ? result.Items : []
      return items as TodoItem[]
}

const deleteTodoItem = async(todoId:string, userId:string)=>
{
    await docClient.delete({ // IAM permission - dynamodb:DeleteItem
        TableName:todoTable,
        Key:{
          todoId: todoId,
          userId: userId
        },
      }).promise()
}

const updateTodoItem = async(todoId:string, userId:string, name: string, dueDate: string, done: boolean)=>{
    await docClient.update({ // IAM permission - dynamodb:UpdateItem
        TableName: todoTable,
        Key:{
          todoId: todoId,
          userId:userId
        },
        UpdateExpression: "SET #n = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeValues: { 
          ":name": name,
          ":dueDate": dueDate,
          ":done": done,
        },
        ExpressionAttributeNames: {
          "#n": "name",
        },
        ReturnValues:"ALL_NEW"
      }).promise()
}

export default {
    createTodoItem,
    getTodoItems,
    deleteTodoItem,
    updateTodoItem
}


