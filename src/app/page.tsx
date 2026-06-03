"use client"

// now join to components in creat the page primar 
//what I need?
import {useState} from 'react'
import {TaskForm} from '@/components/TaskForm'// the formt
import {useTaskStore} from '@/hooks/useTaskStore'// crud the task 
import {useTimers} from '@/hooks/useTimer'// the timer controls
import { TaskItem } from '@/components/TaskItem'


export default function HomePage () {
    const { tasks, createTask,  deleteTask, updateTask, toggleTime } = useTaskStore()
    const [editingId, setEditingId] =useState<string | null>(null)

    const { toggle, getFormattedTime} = useTimers({
        onToggle: (id, isRunning, seconds) => {
            toggleTime(id, isRunning, seconds)
        }
    });

    return (
        <main
        className="p-6 max-w-2xl mx-auto"
        >
            <h1 className="text-2xl font-extrabold mb-4" > Tareas </h1>
            <TaskForm onSubmit={createTask}/>
            
            <ul className="mt-6 space-y-4 font-light flex-3 ">
                {tasks.map((task) => (
                   <TaskItem 
                    key={task.id}// clave para react rederizar 
                    task={task} // tarea completa con todos sus camopos
                    isEditing={editingId === task.id  && task.state === "pending"} // dice  true si el id de la tarea esat en editing
                    onEdit={()=> setEditingId(task.id)}// agrega la tarea a editing
                    onCancelEdit={()=> setEditingId(null)}// deja el editing vacio 
                    onDelete={()=> deleteTask(task.id)}// elimina la tarea 
                    onToggle={()=>toggle(task.id)}// aca mandamo el boton de time 
                    onUpdate={updateTask}// manda el callback de update
                    formattedTime={getFormattedTime(task.id)}// time formateado 
                   />
                ))}
            </ul>


        </main> 
    )

}