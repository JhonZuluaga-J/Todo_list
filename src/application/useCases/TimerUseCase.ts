import { Task } from "../../domain/entities/Task";


export function toggleTimerUseCase( // toggle interruptor
    tasks: Task[],
    taskId: string,
    isRunning: boolean,
    currentSeconds: number // segundos actuales 

    // esta funcion devuelve una lista de tasks por que react
    //no detecta ese cambion en una y no la puede renderisar devido a esto 
    // sele manda la lista con la  tarea que se modifico y hay si react puede modificar  compara los camvios y 
    // actualizar la visat debgfl cliente 

): Task[] {
    return tasks.map(task => {
       if (task.id !== taskId) return task


       if(isRunning && task.canStartTimer()){ 
        return task.startTimer()}
           
       if (!isRunning && task.state === 'in_progress'){
         return task.stopTimer(currentSeconds)}


       return task 
    })
}