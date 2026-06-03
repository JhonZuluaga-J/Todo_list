import { TaskEdit } from '@/components/TaskEdit'
import { Task } from '@/domain/entities/Task'

interface TaskItemProps {
    task: Task,
    isEditing: boolean,
    onEdit:()=>void,
    onCancelEdit:()=>void, // este eta en bollen por que es solo el resultado de si exite o no el qu evamo sa resivir
    onDelete:()=>void, 
    onToggle:()=>void,
    onUpdate:(id: string, title: string, description: string)=>{ success: boolean; error?: string | undefined; },
    formattedTime:String,
}

export function TaskItem({task, isEditing, onEdit, onCancelEdit, onDelete, onToggle, onUpdate, formattedTime}: TaskItemProps){
   if(isEditing){
      return(
        <li>
            <TaskEdit
                task={task}
                onUpdate={onUpdate}
                onCancel={onCancelEdit}
                />
        </li>
      )
   }

   return(
        <li>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>{task.state}</p>
            <p>{task.state !== "pending" && formattedTime}</p>
            <div>
                {task.state !== "completed" && (
                    <button type="button" onClick={onToggle}>{
                        task.state === "in_progress" ? 'End' : 'Start'
                    }</button>
                ) }
                {task.state === "pending" && (
                    <button type="button" onClick={onEdit}>
                        Edit
                    </button>
                )}
                <button type="submit"  onClick={onDelete}>
                    Delete
                </button>
            </div>

        </li>
   )
}