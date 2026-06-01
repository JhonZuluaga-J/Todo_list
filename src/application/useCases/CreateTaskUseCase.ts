import { Task } from "@/domain/entities/Task";
import { taskInputToDomain } from "@/schemas/dto/mapper";
import type { TaskInput } from "@/schemas/dto/TaskDTO";


// Definimos una interfaz limpia para lo que devuelve nuestra función
interface CreateTaskResult {
  success: boolean;
  task?: Task;
  error?: string;
}

export function createTaskUseCase(
 input: TaskInput
): CreateTaskResult {
  try {
    const task = taskInputToDomain(input);

    if(!task.isValid()){
      return {
        success: false,
        error: '"The task data does not meet the domain rules (Title >= 2 and Description >= 10 chars)."'
      }
    }

    return {
      success: true,
      task,
    };
  } catch(err: unknown){
    return{
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    }
  }

}
