
import type { TaskState } from "../types/TaskState";

export class Task {
    public readonly id: string
    public title: string
    public description: string
    public readonly date: Date
    private _state: TaskState
    private _completedTimer: number
    constructor(
        title: string,
        description: string,
        date: Date,
    ) {
        this.id = crypto.randomUUID()
        this.title = title
        this.description = description
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
        return this.title.trim().length >= 2 && this.description.trim().length >= 10;
    }

    updateDetails(title: string, description: string): void {
        this.title = title
        this.description = description
    }

    public get state(): TaskState {
        return this._state
    }

    public get completedTimer(): number {
        return this._completedTimer
    }

}