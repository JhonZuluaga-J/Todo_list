import { useState, useCallback } from 'react'
// importamos react useCallback para que cuando cmabia una cosa del componente react no carge un anueva insatncia de las funciones amenos que las dependencias de estas no cmabien}
//comoa si es tipo use efect pero no ejecuta una funcion sino qu ela carga y le podemos dar una dependecia para decir esta funcio solo la vuelves a cargar cuando esta de pendecia cargue 
// podria mos hacerlo con state que solo velva a cargara en ese momneto o que solo cargue una vez cuando el componente se creo 

import { Task } from '../domain/entities/Task'
// es la clase de nuestar tarea para que esto es una entindad la principal, porque asi task no es un objeto lineal (que te limita a seguri un camino establecido kajkajk)
// esto es un entinda que tiene reglas entonces aplicamos un metodo de encapsulamiento y le damo metodos para que este objeto sea el uncio resposable de susu reglas y no dependa de nadie 


import { createTaskUseCase, updateTaskUseCase, toggleTimerUseCase, deleteTaskUseCase } from '../application/useCases'
// esto useCases son casos de uso d ela app para no tener tod en un archivo regado separamos todos sus casos de uso 

import type { TaskInput } from '../schemas/dto/TaskDTO'
// DTO  es algo llamado Data Transfer Object lo importan es trasportador de datos y ya paara que no entren direntamente a domain 

//ahora aca vamos a desarrollar un hook necesitamos hacer una interfas que diga que devuelve 
// primeor entendamo que este hook que creamos este e sdonde centra toda la funcionalidad de task y sus usecases entonces quermeo que sea una lista de objetos task 
// que tenga los casos de uso y sus validaciones 
//entonces dve devolver sus usus lo que es una funcion los parametros y lo que devuelve cada una 
interface UseTaskStoreReturn {
    tasks: Task[],
    createTask: (input: TaskInput) => {success: boolean, error?: string},
    deleteTask: (id: string) => void,
    updateTask: (id: string, title: string, description: string) =>  {success: boolean, error?: string},
    toggleTime: (id: string, isRunning: boolean, currentSeconds: number) => void
    }
//como este hook es donde centramos las tareas y todo en si  no neceasita parametro 
export function UseTaskStore():UseTaskStoreReturn {
    // creamos el array donde vamos a guardar las tasks
    const [tasks, setTasks] = useState<Task[]>([])
    
    const createTask = useCallback((Input: TaskInput) => {
        const result = createTaskUseCase(Input);

        // esto ! le dice no es undefaul entonces si no hay tarea, pues no ejecuta nada
        if( result.success && result.task!){
            setTasks(prev => [...prev, result.task!])
        }

        return {success: false, error: result.error}
        },
    []);

    
    const deleteTask = useCallback((id: string)=>{
        setTasks(prev => deleteTaskUseCase(prev,id))// aca no ponemos [] despues de la flecha por que nuestar funcion deleteusecases ya hace este trabajo de inmutabilidad devolver un array nuevo sin el elemento borrado
    }, []);

    const updateTask = useCallback((id: string, title: string, description: string)=>{
        setTasks(prev =>{
            const findTask = prev.find(task => task.id === id)
            if(!findTask) return prev
            const result = updateTaskUseCase(findTask, title, description)
            if(result.success && result.task!){
                return [...prev] // como nuestar clase si muta el objeto original nos toca forzar el render de ract devolviendo un nuevo array con los mismo datos del anterior 
                // it is deuda tecnica de hace rinmutable
            }
            return prev
        })
        return { success: true }
    },[])

    return{
        tasks,
        createTask,
        deleteTask,
        updateTask,
    }
}
    











