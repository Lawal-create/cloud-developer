import { CreateTodoRequest } from "../../requests/CreateTodoRequest"
import * as uuid from 'uuid'
import todoAccess from '../../helpers/todosAcess'

const createTodo = async (todo: CreateTodoRequest, userId: string)=>{

    const newTodo = {
        todoId: uuid.v4(),
        userId,
        createdAt: new Date().toISOString(),
        done:false,
        ...todo
    }

    await todoAccess.createTodoItem(newTodo)
    return newTodo
}

export default createTodo