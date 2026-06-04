import { NextRequest, NextResponse } from 'next/server'
import { TaskRepository } from '@/infrastructure/repositories/TaskRepository'
import { taskDomainToOutput } from '@/schemas/dto/mapper'
import { updateTaskUseCase } from '@/application/useCases'

type RouteID = {params: Promise<{id:string}>}
export async function PATCH (req: NextRequest, context: RouteID): Promise<NextResponse> {
    try{ 
        const {id} = await context.params
        const {title, description} = await req.json();
        const tasks = await TaskRepository.findAll();
        const task = tasks.find(t => t.id === id);

        if(!task)return NextResponse.json({error: 'task not found'}, {status: 404})

        const result = updateTaskUseCase(task, title, description);

        if(!result.success) return NextResponse.json({ error: result.error }, { status: 422})

        const updated = await TaskRepository.update(result.task!);
        return NextResponse.json(taskDomainToOutput(updated!))
        }catch{
            return NextResponse.json({error: 'internal server error'}, {status: 500})
        }
}
// aunque la funcion no use directamente el reques lo ncesita para que next  pueda manejar la ruta dinami bien 
export async function DELETE (_req: NextRequest, context: RouteID): Promise<NextResponse> {
    try{
        const { id } = await context.params
        const deleted = await TaskRepository.delete(id)
        if(!deleted){
            return NextResponse.json({error: 'task not found'}, {status: 404})
        }
        return NextResponse.json({success: true})
    }catch{
        return NextResponse.json({error: 'internal server error'}, { status: 500 })
    }
    
}

/* StATUS
500=server interl error= error generico que indica que el servidor o bien no puedo ejecutar la peticion o esta no cumplia los requisitos
422= Unproccessable Entity, nos dice oye entendi tu solicitud entendi lo que habia en ella pero falle en ejecutarla mala ahi 
404= Not Found, es no encontre lo qu eme pediste qu enecontrara 
 */