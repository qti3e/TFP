import { Task } from "./tasks";
import { TimeRecord, jsDate2TimeRecord } from "./date";

interface HistoryRecord {
  time: TimeRecord;
  taskUUID: string;
}

export type History = HistoryRecord[];

export function createHistoryRecord(task: Task, date: Date): HistoryRecord {
  return {
    time: jsDate2TimeRecord(date),
    taskUUID: task.uuid
  };
}
