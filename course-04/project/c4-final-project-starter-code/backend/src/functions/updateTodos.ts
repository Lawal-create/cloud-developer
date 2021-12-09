import todosAccess from "../helpers/todosAcess"

const updateTodos = async(todoId:string, userId:string, name: string, dueDate: string, done: boolean)=> {
      
      await todosAccess.updateTodoItem(todoId,userId,name,dueDate,done)
      return {
          name,
          dueDate,
          done
      }
  
}

export default updateTodos