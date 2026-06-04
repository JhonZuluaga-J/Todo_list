import {connectDB} from '@/infrastructure/db/mongodb'
import mongoose, {Schema, Document} from 'mongoose' 
// Importamos Schema, que permite definir la estructura de los datos en los documentos de MongoDB usando Mongoose.
// Importamos Document para tipar objetos individuales que representan documentos en MongoDB, 
// incluyendo los métodos que Mongoose añade a esos documentos, facilitando el tipado en TypeScript.
import { Task } from '@/domain/entities/Task'
import type { TaskState } from '@/domain/types/TaskState'


// en si  definimo la estructura de los datos en el  documento de mongoose
interface ITaskDocument extends Document<string> { //<string> solo para que nos permita trabajar con nuestro id de crypo porque este es estring 
    _id: string
    title: string
    description: string
    date: Date
    state: TaskState
    completedTimer: number
  }

  // este es el schema de mongoose que no spermite validar que cada task  se guarde con el timo de dato que queremos 
const TaskSchemaMongoose = new Schema<ITaskDocument>({
    _id:{ type: String, required: true},
    title:{type:String, required: true},
    description:{type:String, required: true},
    date:{type:Date, required: true},
    state:{type: String, enum:['pending', 'in_progress', 'completed']},
    completedTimer:{type:Number, default: 0},

  });


// aca cetralizamso de donde sacamos el modelo y ya existe se toma el existente si no se genera uno nuevo 
const TaskModel = mongoose.models.Task ||  mongoose.model<ITaskDocument>('Task', TaskSchemaMongoose)

function docToTask(doc: ITaskDocument):Task {
    return new Task(doc.title, doc.description, doc.date, doc._id, doc.state, doc.completedTimer)
}

export const TaskRepository = {
    async findAll(): Promise<Task[]> {
        await connectDB()
        const docs = await TaskModel.find().sort({date: -1})// aca organizamos de la mas reciente a la mas antigua
        return docs.map(docToTask)
    },


    async create(task:Task): Promise<Task> {
        await connectDB()
        const doc = await TaskModel.create({
           _id: task.id,
           title: task.title,
           description: task.description,
           date: task.date,
           state: task.state,
           completedTimer: task.completedTimer,
        });
        return docToTask(doc)
        // aca retornamos el el doc o la task de debe apesar que la dimos todo los datos que necesita porque generalmete se ace esto poreu mongo genera un id ya si 
        // guardamos este peor como nosotro ya le damos este, lo usamos es por se ocurre alguna altercion en la creacion el dato este total mete actalizado con la db 
    },


    async update(task: Task): Promise< Task | null> {
        await connectDB()
        const doc = await TaskModel.findByIdAndUpdate(
            task.id,
            {
                title: task.title,
                description: task.description,
                state: task.state,
                completedTimer: task.completedTimer
            },
            {new: true}// estpo es de vital inportancia para que no s devuelva el objeto actualizado 
        )

        return doc ? docToTask(doc) : null
    },


    async delete(id: string): Promise<boolean> {
        await connectDB()
        const result = await TaskModel.findByIdAndDelete(id)
        return !!result
    },

}