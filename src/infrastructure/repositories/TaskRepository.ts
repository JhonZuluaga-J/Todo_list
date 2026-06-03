import { Schema, model, models } from 'mongoose'
import { connectDB } from '@/infrastructure/db/mongodb'
import { Task } from '@/domain/entities/Task'
import { taskDomainToOutput } from '@/schemas/dto/mapper'
import type { TaskOutput } from '@/schemas/dto/TaskDTO'
import type { TaskState } from '@/domain/types/TaskState'

// ─── Mongoose Schema ──────────────────────────────────────────────────────────
// No extendemos Document — definimos solo la forma de los datos en la BD.
// _id es string porque lo generamos nosotros con crypto.randomUUID en el dominio.

interface TaskDocumentFields {
    _id: string
    title: string
    description: string
    date: Date
    state: TaskState
    completedTimer: number
}

const TaskSchema = new Schema<TaskDocumentFields>({
    _id:            { type: String, required: true },
    title:          { type: String, required: true },
    description:    { type: String, required: true },
    date:           { type: Date,   required: true },
    state:          { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    completedTimer: { type: Number, default: 0 },
})

// models.Task evita re-compilar el modelo en cada hot-reload de Next.js
const TaskModel = models.Task ?? model<TaskDocumentFields>('Task', TaskSchema)

// ─── Document → TaskOutput ────────────────────────────────────────────────────

function documentToOutput(doc: TaskDocumentFields): TaskOutput {
    return {
        id:             String(doc._id),
        title:          doc.title,
        description:    doc.description,
        date:           doc.date,
        state:          doc.state,
        completedTimer: doc.completedTimer,
    }
}

// ─── Repository ───────────────────────────────────────────────────────────────

export const TaskRepository = {

    async findAll(): Promise<TaskOutput[]> {
        await connectDB()
        const docs = await TaskModel.find().lean<TaskDocumentFields[]>()
        return docs.map(documentToOutput)
    },

    async create(task: Task): Promise<TaskOutput> {
        await connectDB()
        const data = taskDomainToOutput(task)
        const created = await TaskModel.create({ _id: data.id, ...data })
        return documentToOutput(created as unknown as TaskDocumentFields)
    },

    async update(task: Task): Promise<TaskOutput | null> {
        await connectDB()
        const data = taskDomainToOutput(task)
        const updated = await TaskModel.findByIdAndUpdate(
            data.id,
            {
                title:          data.title,
                description:    data.description,
                state:          data.state,
                completedTimer: data.completedTimer,
            },
            { new: true }
        ).lean<TaskDocumentFields>()

        return updated ? documentToOutput(updated) : null
    },

    async delete(id: string): Promise<boolean> {
        await connectDB()
        const result = await TaskModel.findByIdAndDelete(id)
        return result !== null
    },
}