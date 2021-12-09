import todosAccess from "../../helpers/todosAcess"


const deleteTodo = async (todoId: string, userId)=>{
  await todosAccess.deleteTodoItem(todoId, userId)
}

export default deleteTodo
