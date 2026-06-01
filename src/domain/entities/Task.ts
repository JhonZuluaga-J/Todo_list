
import type { TaskState } from "@/domain/types/TaskState";

export class Task {
    public readonly id: string
    private _title: string
    private _description: string
    public readonly date: Date
    private _state: TaskState
    private _completedTimer: number
    constructor(
        title: string,
        description: string,
        date: Date,
        id?: string,
        state?: TaskState,
        completedTimer?: number
    ) {
        this.id = id ?? crypto.randomUUID()// ?? esto dice si exite el valor adelnate de mi lo uso si es undefine el de atras 
        this._title = title
        this._description = description
        this.date = date
        this._state = state ?? "pending"
        this._completedTimer = completedTimer ?? 0
    }

    startTimer(): Task {
        if (this._state === "completed") return this // sin no decimos que elemento del this llamamos este llama es el objeto completo 
        return new Task ( this._title, this._description, this.date, this.id, 'in_progress', this._completedTimer  )
    }

    stopTimer(seconds: number): Task {
        return new Task ( this._title, this._description, this.date, this.id, 'completed', seconds  )
    }


    canStartTimer(): boolean {
        return this._state === "pending"
    }

    isValid(): boolean {
        return this._title.trim().length >= 2 && this._description.trim().length >= 10;
    }

    updateDetails(title: string, description: string): Task {
        if(this._state !== 'pending') throw new Error ("Only pending tasks can be edited")
       return new Task ( title, description, this.date, this.id)
    }

    public get state(): TaskState {
        return this._state
    }

    public get completedTimer(): number {
        return this._completedTimer
    }
    
    public get title(): string {
        return this._title
    }

    public get description(): string {
        return this._description
    }

}