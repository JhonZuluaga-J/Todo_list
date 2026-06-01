// now join to components in creat the page primar 
//what I need?
import {TaskForm} from './components/TaskForm'// the formt
import {useTaskStore} from './hooks/useTaskStore'// crud the task 
import {useTimers} from './hooks/useTimer'// the timer controls


export default function App() {
    const { tasks, createTask, deleteTask, toggleTime } = useTaskStore()


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
            
            <ul className="mt-6 space-y-4 font-light">
                {tasks.map((task) => (
                    <li key={task.id} className="border p-4 rounded">
                        <h2>{task.title}</h2>
                        <p className="">{task.description}</p>
                        <p className="">{task.state}</p>
                        <p className="">{task.state !== 'pending' && getFormattedTime(task.id)}</p>
                        <div className="flex items-center gap-2">
                          {task.state !== "completed" && (
                            <button type="button"  className="px-3 py-2 border rounded" onClick={()=>toggle(task.id)}>
                                {task.state === "in_progress"? 'End' : 'Start' }
                            </button>
                          )} 
                          <button type="button"  className="px-3 py-2 border rounded"  onClick={() => deleteTask(task.id)}>
                            Delete
                            </button> 
                        </div>
                        
                    </li>
                ))}
            </ul>


        </main> 
    )

}