import { Task } from "@/domain/entities/Task"
import type { TaskInput, TaskOutput } from "./TaskDTO"

// Input del usuario → instancia de dominio
// Se usa en CreateTaskUseCase antes de persistir
export function taskInputToDomain(input: TaskInput): Task {
    return new Task(
        input.title,
        input.description,
        input.date
    )
}

// Instancia de dominio → objeto plano para la API/BD
// id siempre existe en Task (se genera en el constructor), así TaskOutput.id es string
export function taskDomainToOutput(task: Task): TaskOutput {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        date: task.date,
        state: task.state,
        completedTimer: task.completedTimer,
    }
}