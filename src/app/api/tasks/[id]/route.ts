import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TaskRepository } from '@/infrastructure/repositories/TaskRepository'
import { updateTaskUseCase, toggleTimerUseCase } from '@/application/useCases'
import { Task } from '@/domain/entities/Task'
import type { TaskState } from '@/domain/types/TaskState'

// ─── Body schemas ─────────────────────────────────────────────────────────────
// discriminatedUnion garantiza que cada action tenga exactamente sus campos.

const UpdateBodySchema = z.object({
    action:      z.literal('update'),
    title:       z.string(),
    description: z.string(),
})

const ToggleBodySchema = z.object({
    action:         z.literal('toggle'),
    isRunning:      z.boolean(),
    currentSeconds: z.number(),
    // El cliente manda el estado actual para reconstruir la Task en el servidor
    currentState:   z.enum(['pending', 'in_progress', 'completed']),
    title:          z.string(),
    description:    z.string(),
    date:           z.coerce.date(),
    completedTimer: z.number(),
})

const PatchBodySchema = z.discriminatedUnion('action', [UpdateBodySchema, ToggleBodySchema])

type RouteContext = { params: Promise<{ id: string }> }

// ─── PATCH ────────────────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest, context: RouteContext): Promise<NextResponse> {
    try {
        const { id } = await context.params
        const body: unknown = await req.json()

        const parsed = PatchBodySchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
        }

        if (parsed.data.action === 'update') {
            // Necesitamos el estado actual de la BD para que updateDetails
            // aplique su regla: solo tareas 'pending' se pueden editar.
            const all = await TaskRepository.findAll()
            const found = all.find(t => t.id === id)
            if (!found) {
                return NextResponse.json({ error: 'Task not found' }, { status: 404 })
            }

            // Reconstruimos la instancia de dominio con los datos de la BD
            const domainTask = new Task(
                found.title,
                found.description,
                new Date(found.date),
                found.id,
                found.state as TaskState,
                found.completedTimer
            )

            const result = updateTaskUseCase(domainTask, parsed.data.title, parsed.data.description)
            if (!result.success || !result.task) {
                return NextResponse.json({ error: result.error }, { status: 422 })
            }

            const updated = await TaskRepository.update(result.task)
            if (!updated) {
                return NextResponse.json({ error: 'Task not found' }, { status: 404 })
            }
            return NextResponse.json(updated)
        }

        // action === 'toggle'
        // El cliente manda el estado completo para evitar un fetch extra a la BD
        const { isRunning, currentSeconds, currentState, title, description, date, completedTimer } = parsed.data

        const domainTask = new Task(title, description, date, id, currentState, completedTimer)

        // toggleTimerUseCase trabaja con arrays — lo envolvemos y extraemos el resultado
        const [toggled] = toggleTimerUseCase([domainTask], id, isRunning, currentSeconds)

        const updated = await TaskRepository.update(toggled)
        if (!updated) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 })
        }
        return NextResponse.json(updated)

    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function DELETE(_req: NextRequest, context: RouteContext): Promise<NextResponse> {
    try {
        const { id } = await context.params
        const deleted = await TaskRepository.delete(id)

        if (!deleted) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}