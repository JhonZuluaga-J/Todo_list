import { z } from "zod"

// Schema base para INPUT — el id es opcional porque el usuario no lo manda
const TaskBaseSchema = z.object({
    title: z.string().min(2, "the title must have at least 2 characters"),
    description: z.string().min(10, "the description must have at least 10 characters"),
    date: z.coerce.date(), // coerce acepta string ISO que viene de fetch/JSON
    state: z.enum(['pending', 'in_progress', 'completed']),
    completedTimer: z.number(),
})

// Schema completo para OUTPUT — id siempre presente (viene de la BD)
export const TaskCardSchema = TaskBaseSchema.extend({
    id: z.string(),
})

// Schema para INPUT — sin id, sin state, sin completedTimer (los genera el dominio)
export const TaskInputSchema = TaskBaseSchema.omit({
    state: true,
    completedTimer: true,
})

export type TaskCardZod = z.infer<typeof TaskCardSchema>