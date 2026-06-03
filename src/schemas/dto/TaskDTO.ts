import { z } from 'zod'
import { TaskCardSchema, TaskInputSchema } from '@/types/Zod'

// Lo que el usuario manda al crear una tarea
export const TaskInputDTO = TaskInputSchema
export type TaskInput = z.infer<typeof TaskInputDTO>

// Lo que la API devuelve — id siempre presente
export const TaskOutputDTO = TaskCardSchema
export type TaskOutput = z.infer<typeof TaskOutputDTO>