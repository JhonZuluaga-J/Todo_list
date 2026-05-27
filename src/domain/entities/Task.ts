
import type { TaskState } from "../types/TaskState";

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
    ) {
        this.id = (id)? id: crypto.randomUUID()
        this._title = title
        this._description = description
        this.date = date
        this._state = "pending"
        this._completedTimer = 0
    }

    startTimer(): void {
        if (this._state === "completed") return
        this._state = "in_progress"
    }

    stopTimer(seconds: number): void {
        this._state ="completed"
        this._completedTimer = seconds
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