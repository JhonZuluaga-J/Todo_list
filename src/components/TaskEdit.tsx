"use client"

import React, {useState } from 'react' // we have import the react completed for parameters teh function that receives html 
import  { Task } from '@/domain/entities/Task'


interface taskEditPros {
    task: Task,
    onUpdate: (id: string, title: string, description: string)=>{success: boolean, error?: string},
    onCancel: ()=>void
}

export function  TaskEdit({task, onUpdate, onCancel}: taskEditPros ){
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<string | null >(null)

    const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const result = onUpdate(task.id, title, description);
        if(!result.success){
            setError(result.error ?? "erro in updated ")
            return
        }
        onCancel()
    }
    return(
        <form className=""  onSubmit={handleSubmit} > 
            <input
                value={title}
                className=""
                onChange={(e)=>setTitle(e.target.value)}
            ></input>
            <input
                value={description}
                className=""
                onChange={(e)=>setDescription(e.target.value)}
            ></input>
            {error && <p className="text-cyan-500">{error}</p>}
            <button type="submit" className="" >Save</button>
            <button type="button" onClick={onCancel} className="" >Cancel</button>
        </form>
    )
}