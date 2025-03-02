import { TodoistApi } from "@doist/todoist-api-typescript"

export function generarTodoistAPI(){
    global.todoApi = new TodoistApi(process.env.TD_TOKEN)
}