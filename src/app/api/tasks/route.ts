import { NextRequest, NextResponse } from 'next/server'
import { TaskRepository } from '@/infrastructure/repositories/TaskRepository'
import { createTaskUseCase } from '@/application/useCases'
import { TaskInputDTO } from '@/schemas/dto/TaskDTO'

export async function GET(): Promise<NextResponse> {
    try {
        const tasks = await TaskRepository.findAll()
        return NextResponse.json(tasks)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: unknown = await req.json()

        // 1. Zod valida la forma del body antes de tocar el dominio
        const parsed = TaskInputDTO.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
        }

        // 2. El caso de uso aplica las reglas del dominio
        const result = createTaskUseCase(parsed.data)
        if (!result.success || !result.task) {
            return NextResponse.json({ error: result.error }, { status: 422 })
        }

        // 3. El repositorio persiste la Task del dominio y devuelve TaskOutput
        const created = await TaskRepository.create(result.task)
        return NextResponse.json(created, { status: 201 })
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}