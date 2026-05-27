import { Task } from "../../domain/entities/Task"
import { getValidationErros } from "../../domain/utils/validation"

export function updateTaskUseCase(
    task: Task,
    title: string,
    description: string,
): { success: boolean, task?: Task, error?: string } {

    const titleError = getValidationErros('title', title);
    if(titleError) {return{success:false, error: titleError};}

    const descriptionError = getValidationErros('description', description);
    if(descriptionError){ return { success: false, error: descriptionError };}
    
    task.updateDetails(title, description)
    
    return {
        success: true,
        task
    }
}

