// importamos z el objeto principal de zod y para trabajar con el
// regla de oro: simpre preguntar los datos vinen de furea? aplicar zod porque no se puedee confiar:depende de lo que hagamos
//preguntas clave para usarlo correctamente:
//1. que datos voy a recibir?
//2. que formato tienen?
//3. que reglas de validacion necesito?

import { z } from "zod";

export const TaskCardSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, "the title must have at least 2 characters"),
    description: z.string().min(10, "the description must have at least 10 characters"),
    date: z.date(),
    state: z.enum(['pending', 'in_progress', 'completed']),
    completedTimer: z.number()
})

export type TaskCardZod = z.infer<typeof TaskCardSchema>