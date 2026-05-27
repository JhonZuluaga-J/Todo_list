import { z } from 'zod'
import { TaskCardSchema, } from '../../types/Zod'

// nececitamos establecer el schema de zod para los inpuds de afuera un shema compuesto unicamente de los datos que manda el usuario 
export const TaskInputDTO = TaskCardSchema.omit({id:true, state: true, completedTimer: true});

export type TaskOutput = z.infer<typeof TaskCardSchema>
export type TaskInput = z.infer<typeof TaskInputDTO>
