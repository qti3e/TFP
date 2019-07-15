import { Task, DueTask, RoutineTask, isAllowed, DayFilter } from "./tasks";
import { History } from "./history";
import {
  Minutes,
  TimeRecord,
  jsDate2TimeRecord,
  isSameDay,
  loopUntil,
  isGT,
  weekdays
} from "./date";

const DEFAULT_DURATION = 30;

export function createDailyPlan(
  history: History,
  tasks: Task[],
  date: Date
): Task[] {
  if (tasks.length === 0) return [];

  // Never change function parameter!
  tasks = [...tasks];

  const today = jsDate2TimeRecord(date);
  const avg = getAvgTasksPerDay(tasks);
  const maxDuration = avg + 10;

  let duration: Minutes = 0;
  const selectedTasks: Task[] = [];
  const add = (task: Task): void => {
    selectedTasks.push(task);
    duration += task.duration || DEFAULT_DURATION;
  };

  // First select tasks that must be done today.
  // - Fixed
  // - Daily
  // - Due tasks that today is their last day.
  for (const task of tasks) {
    if (task.type === "fixed" && isSameDay(today, task.date)) {
      // Our user might be an idiot, he might have already done this task!
      // Check the history.
      const alreadyDone = history.some(record => record.taskUUID === task.uuid);
      // Now we just insert this task!
      if (!alreadyDone) add(task);
      continue;
    }

    if (task.type === "routine" && task.period === "daily") {
      if (isAllowed(task.allowedOn, today.day))
        for (let i = 0; i < task.perPeriod; ++i) add(task);
      continue;
    }

    if (task.type === "due" && !canDueTaskBePostponed(today, task)) {
      if (!history.some(record => record.taskUUID === task.uuid)) add(task);
      continue;
    }
  }

  // If the fixed tasks on this day are going to take a long time from the
  // user just return the fuckin' shit.
  if (duration >= maxDuration) return selectedTasks;

  // prettier-ignore
  tasks = tasks.filter(task => !(
    // Remove those tasks that are already selected.
    selectedTasks.indexOf(task) > -1 ||
    // Fixed tasks are already inserted if they had to.
    task.type === "fixed" ||
    // Already done.
    (task.type === "due" && history.some(hr => hr.taskUUID === task.uuid)) ||
    // Expired due tasks.
    (task.type === "due" && isGT(today, task.dueTo)) ||
    // If the due task is not important.
    (task.type === "due" && isDueTaskNotImportant(task, today)) ||
    // Routine tasks that are accomplished.
    (task.type === "routine" && isRoutineTaskAccomplished(history, task, today))
  ));

  if (tasks.length === 0) return selectedTasks;

  // Let's go for the prioritization :)
  const priorityMap: Map<Task, number> = new Map();

  for (const task of tasks) {
    if (task.type === "due") {
      const daysLeft = getDaysLeft(task, today);
      const priority = ((7 - daysLeft) / 7) * 10;
      priorityMap.set(task, priority);
    } else if (task.type === "routine") {
      // Things we consider to calculate the priority.
      // - Number of possible days left to do the task in the period.
      // - Number of reps left to be done.
      const daysLeft = getDaysLeftRoutine(task, today);
      const repsLeft = getRepsLeft(task, history, today);
      if (repsLeft > daysLeft) {
        // It must never happen!
        priorityMap.set(task, 11);
        continue;
      }
      const priority = (repsLeft / daysLeft) * 10;
      priorityMap.set(task, priority);
    }
  }

  tasks.sort((a, b) => priorityMap.get(b)! - priorityMap.get(a)!);

  // Now we have our tasks sorted in an array, pick from then until we can.
  for (const task of tasks) {
    // TODO(qti3e) Check if the timeline is free for the task.
    add(task);
    if (duration >= maxDuration) break;
  }

  return selectedTasks;
}

function getAllowedDaysNum(allowedOn: DayFilter | undefined): number {
  if (!allowedOn) return 7;
  let r = 0;
  for (const day of weekdays) if (allowedOn[day]) r += 1;
  return r;
}

function getAvgTasksPerDay(tasks: Task[]): Minutes {
  let sum: Minutes = 0;
  for (const task of tasks) {
    let duration = task.duration || DEFAULT_DURATION; // Default to 30Min.

    if (task.type === "routine") {
      duration *=
        task.period === "daily"
          ? (210 * getAllowedDaysNum(task.allowedOn)) / 7
          : task.period === "weekly"
          ? 210 / 7
          : // Monthly
            210 / 30;
      duration *= task.perPeriod;
    }

    sum += duration;
  }
  return sum / 210;
}

function canDueTaskBePostponed(today: TimeRecord, task: DueTask): boolean {
  // If today is the last chance to do this task, there is no way for it to be
  // postponed.
  if (isSameDay(today, task.dueTo)) return false;

  // Now check everyday to find a day so that we can put this task on it.
  for (const tr of loopUntil(today, task.dueTo)) {
    if (isAllowed(task.allowedOn, tr.day)) return true;
  }

  return false;
}

function isRoutineTaskAccomplished(
  history: History,
  task: RoutineTask,
  time: TimeRecord
): boolean {
  return getRepsLeft(task, history, time) <= 0;
}

function getDaysLeft(task: DueTask, today: TimeRecord): number {
  if (isSameDay(today, task.dueTo)) return 0;

  let score = 0;
  for (const tr of loopUntil(today, task.dueTo))
    if (isAllowed(task.allowedOn, tr.day)) score += 1;

  return score;
}

function isDueTaskNotImportant(task: DueTask, today: TimeRecord): boolean {
  // If there is +7 days to do this task... it's not that important now.
  return getDaysLeft(task, today) > 7;
}

function getDaysLeftRoutine(task: RoutineTask, today: TimeRecord): number {
  if (task.period === "daily") return -1;

  if (task.period === "weekly") {
    let days = 0;
    for (let i = weekdays.indexOf(today.day); i < weekdays.length; ++i)
      if (isAllowed(task.allowedOn, weekdays[i])) days += 1;

    return days;
  }

  // task.period === Monthly
  let days = 0;
  let weekdayIndex = weekdays.indexOf(today.day);
  for (let i = today.date; i < 31; ++i) {
    if (isAllowed(task.allowedOn, weekdays[weekdayIndex])) days += 1;
    weekdayIndex = (weekdayIndex + 1) % 7;
  }

  return days;
}

function getRepsLeft(
  task: RoutineTask,
  history: History,
  time: TimeRecord
): number {
  if (task.period === "daily") return -1;

  history = history.filter(
    hr => hr.taskUUID === task.uuid && time.year === hr.time.year
  );

  if (task.period === "weekly")
    history = history.filter(hr => hr.time.week === time.week);

  if (task.period === "monthly")
    history = history.filter(hr => hr.time.month === time.month);

  return task.perPeriod - history.length;
}
