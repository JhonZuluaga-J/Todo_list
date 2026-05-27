
import { Task } from "../../domain/entities/Task";

export function deleteTaskUseCase(
    tasks: Task[],
    taskId: string
): Task[] {
   return tasks.filter(task => task.id !== taskId )
}