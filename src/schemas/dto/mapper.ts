import { Task } from "../../domain/entities/Task";
import type { TaskInput, TaskOutput } from "./TaskDTO";


//Para los Casos de Uso (Use Cases)
//Esta función es la que usamso en nuestro Caso de Uso de Creación como CreateTaskUseCase).
export function taskInputToDomain(input: TaskInput): Task {
    // decimos deque tiene que genrar una nueva instancia de la clase 
    return new Task(
        input.title,
        input.description,
        input.date
    )
}

//Esta función es la que se ejecuta al final del camino, cuando vamos a devolverle los datos al usuario. 
export function taskDomainToOutput(task: Task): TaskOutput {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    date: task.date,
    state: task.state,
    completedTimer: task.completedTimer
  }
}


