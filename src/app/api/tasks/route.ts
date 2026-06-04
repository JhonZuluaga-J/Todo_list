import { NextRequest, NextResponse} from 'next/server' // importamos los que forman el manejo de apis en next 
//NextRequest,  este e spara funciones http entrantes que funcional del lado del servidor para manejar lo request 
//NeXtResponse, este son la respuesta son las funciones http que le devuelven algo al cliente te permite controlar las cookes 
import { TaskRepository } from '@/infrastructure/repositories/TaskRepository'
import { taskDomainToOutput } from '@/schemas/dto/mapper'
import { createTaskUseCase } from '@/application/useCases'
import { TaskInputDTO } from '@/schemas/dto/TaskDTO'




export async function GET (): Promise<NextResponse> {
    try{
        const tasks = await TaskRepository.findAll()
        return NextResponse.json(tasks.map(taskDomainToOutput)) //  aca beroficamos que todos los datos se envien en el formato adecuado al front 
    }catch(err: unknown){
        return NextResponse.json({error: 'Error fetching tasks' }, { status: 500 })
    }
}

export async function POST (req: NextRequest): Promise<NextResponse> {
    try{
        const body = await req.json();// lo primeor que hay que hacer ante una peticion con cuerpo es formatear el body a json
        //  aca pasan dos cosa sbien interzantes usamos el eschema de zod y una de sus funciones para parecer y body y revisar que si tenga la estructura deceada casi untipo de midleware 
        const parsed = TaskInputDTO.safeParse({...body, date: new Date(body.date)});
        if(!parsed.success){
            return NextResponse.json({error: parsed.error.flatten() }, {status: 400}) // zod al parcear los datos de entra devuelve el tipo de error y un monton de etsos datos con este flatten los organiza
        }

        const result = createTaskUseCase(parsed.data);
        if(!result.success){
            return NextResponse.json({error: result.error}, {status: 422})
        }

        const saved = await TaskRepository.create(result.task!);
        return NextResponse.json(taskDomainToOutput(saved), {status: 201})
        
    }catch(err: unknown){
        return NextResponse.json({error: 'Error creating task'}, {status: 500})
    }
}

/*  ERROS
500 = internal server error, error generico que indica que el servidor o bien no puedo ejecutar la peticion o esta no cumplia los requisitos 
422 = Unproccessable Entity, esto lo que nos dice es entedi la solicitud y su contenido pero por alguna razon no puedo hacer nada con ello 
400 = Bad requed,  indica que la solicitud envaida por el cliente no esta bine hecha o bien formulada 
201 = created,  sunobre lo dice creado logrado conseguido 

 */