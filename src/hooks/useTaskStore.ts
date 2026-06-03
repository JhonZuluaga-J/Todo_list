"use client"

import { useState, useCallback, useEffect } from 'react'
import { Task } from '@/domain/entities/Task'
import type { TaskInput, TaskOutput } from '@/schemas/dto/TaskDTO'
import type { TaskState } from '@/domain/types/TaskState'

// ─── Helper ───────────────────────────────────────────────────────────────────
// Convierte el TaskOutput plano que devuelve la API en una instancia de Task
// para que el dominio siga teniendo sus métodos (startTimer, updateDetails, etc.)

function outputToDomain(output: TaskOutput): Task {
    return new Task(
        output.title,
        output.description,
        new Date(output.date),
        output.id,             // id: string — nunca undefined gracias al schema corregido
        output.state as TaskState,
        output.completedTimer
    )
}

// ─── Interface ────────────────────────────────────────────────────────────────

interface UseTaskStoreReturn {
    tasks: Task[]
    isLoading: boolean
    createTask: (input: TaskInput) => Promise<{ success: boolean; error?: string }>
    deleteTask: (id: string) => Promise<void>
    updateTask: (id: string, title: string, description: string) => Promise<{ success: boolean; error?: string }>
    toggleTime: (id: string, isRunning: boolean, currentSeconds: number) => Promise<void>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTaskStore(): UseTaskStoreReturn {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Carga inicial — trae todas las tareas de MongoDB al montar
    useEffect(() => {
        async function loadTasks() {
            try {
                const res = await fetch('/api/tasks')
                if (!res.ok) throw new Error('Failed to fetch tasks')
                const data: TaskOutput[] = await res.json()
                setTasks(data.map(outputToDomain))
            } finally {
                setIsLoading(false)
            }
        }
        loadTasks()
    }, [])

    const createTask = useCallback(async (
        input: TaskInput
    ): Promise<{ success: boolean; error?: string }> => {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        })

        if (!res.ok) {
            const { error } = await res.json()
            return { success: false, error: String(error) }
        }

        const created: TaskOutput = await res.json()
        setTasks(prev => [...prev, outputToDomain(created)])
        return { success: true }
    }, [])

    const deleteTask = useCallback(async (id: string): Promise<void> => {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
        // Actualización optimista — quitamos la tarea de la UI sin esperar confirmación
        setTasks(prev => prev.filter(t => t.id !== id))
    }, [])

    const updateTask = useCallback(async (
        id: string,
        title: string,
        description: string
    ): Promise<{ success: boolean; error?: string }> => {
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update', title, description }),
        })

        if (!res.ok) {
            const { error } = await res.json()
            return { success: false, error: String(error) }
        }

        const updated: TaskOutput = await res.json()
        setTasks(prev => prev.map(t => (t.id === id ? outputToDomain(updated) : t)))
        return { success: true }
    }, [])

    const toggleTime = useCallback(async (
        id: string,
        isRunning: boolean,
        currentSeconds: number
    ): Promise<void> => {
        // Mandamos el estado completo de la tarea para que el servidor
        // pueda reconstruir la instancia de dominio sin fetch extra
        const task = tasks.find(t => t.id === id)
        if (!task) return

        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action:         'toggle',
                isRunning,
                currentSeconds,
                currentState:   task.state,
                title:          task.title,
                description:    task.description,
                date:           task.date,
                completedTimer: task.completedTimer,
            }),
        })

        if (!res.ok) return

        const updated: TaskOutput = await res.json()
        setTasks(prev => prev.map(t => (t.id === id ? outputToDomain(updated) : t)))
    }, [tasks])

    return { tasks, isLoading, createTask, deleteTask, updateTask, toggleTime }
}