'use client'


import { useState, type SubmitEvent} from 'react'
import type { TaskInput } from '../schemas/dto/TaskDTO'
import { getValidationErros } from '../domain/utils/validation'


// como este es  el fomulario de tareas solo es preguntar unas cositas y ya ya nosotro tipos como deven deser esto datos que ingrezan

interface TaskFormProps {
    onSubmit: (input:TaskInput) => {success:boolean, error?: string}
}
// tipamos ese parametro y de entrada asi porque todo  nuestro custom hook y useCases reponden asi si funciono o no y que error trae si no 
export function TaskForm ({ onSubmit }: TaskFormProps){ 
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState(()=> new Date().toISOString().slice(0,10));
    const [error, setError] = useState<string |null>(null);


    function handleSubmit(e: SubmitEvent){
        e.preventDefault()// we use preventDefault to prevent the browser from reloading the page 
        const titleError = getValidationErros('title', title )
        const descriptionError = getValidationErros('description', description)

        if( titleError || descriptionError){
            setError(titleError ?? descriptionError)// utilizamos un operador cais tipo ternario llamdo nullish que dice si el priemer valso es null o udefaual uso el siguinete 
            return
        }

        setError(null)// if it gets this far, it's because the error doesn't exist, and we shoul mark it as null just in case 
        const result = onSubmit({title, description, date: new Date(date) }) // aca ponemos llaves por que el tipo del input es un objeto en si de zod 

        if(!result.success){
            setError(result.error ?? "Problems in create task")
            return
        }
        // now we left the inputs empty for next task since the task is created good 
        setTitle("");
        setDescription("");
        setDate(new Date().toISOString().slice(0, 10))
        setError(null);
    }
    return (
        // what information does the user need to see? (title, description, date  and erros)
        // how do I do it in react? is solution need to
        //value={name the element},
        // onChange={(e)=>{e.target.value}}// when writing, updtaed the state the component  in react 
        <form  className=" bg-cyan-950  rounded px-1 gap-2 p-2" onSubmit={handleSubmit}> 
            <input
             value={title}
             onChange={(e)=>setTitle(e.target.value)}
             className="bg-mauve-800 border-2 border-cyan-600 rounded"
            ></input>
            <input
             value={description}
             onChange={(e)=>setDescription(e.target.value)}
             className="bg-mauve-800 border-2 border-cyan-600 rounded"
            ></input>
            <input
             value={date}
             onChange={(e)=>setDate(e.target.value)}
             className="bg-mauve-800 border-2 border-cyan-600 rounded"
            ></input>
            {error && <p className="text-cyan-500">{error}</p>}
            <button type='submit'  className="px-3 py-2 border rounded" >SEND</button>
        </form>
    )

}