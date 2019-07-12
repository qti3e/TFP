import { Task, Weekday, Minute } from "./types";

export const weekdays: ReadonlyArray<Weekday> = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

export class Day {
  tasks: Task[] = [];
  day: Weekday = "sunday";
  dayNumber: number = 0;

  getTasksTime = (): Minute => {
    let sum: Minute = 0;
    for (const task of this.tasks) sum += task.duration;
    return sum;
  };

  private isFree(time: Minute, duration: Minute): boolean {
    const endTime = time + duration;

    for (const task of this.tasks) {
      const { startAt, duration } = task;
      if (!startAt) continue;

      const startPoint = startAt;
      const endPoint = startAt + duration;
      if (
        (time >= startPoint && endPoint >= time) ||
        (endTime >= startPoint && endPoint >= endTime)
      )
        return false;
    }

    return true;
  }

  addTask(task: Task): boolean {
    // If it has a fixed start time, check if that time is available.
    if (task.startAt)
      if (!this.isFree(task.startAt, task.duration)) return false;

    // If this task is not allowed on this day of the week, return.
    if (task.type === "due" || task.type === "routine")
      if (!task.allowedOn[this.day]) return false;

    // Check if this day is still valid for a due task.
    if (task.type === "due" && task.dueTo >= this.dayNumber) return false;

    this.tasks.push(task);

    return true;
  }
}

export function createDays(
  numDays: number,
  startDayNumber: number,
  start: Weekday = "sunday"
): Day[] {
  const days: Day[] = new Array(numDays).fill(null).map(_ => new Day());
  const dayId = weekdays.indexOf(start);

  for (let i = 0; i < numDays; ++i) {
    days[i].day = weekdays[(i + dayId) % 7];
    days[i].dayNumber = i + startDayNumber;
  }

  return days;
}
