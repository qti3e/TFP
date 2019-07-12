import { DueTask, RoutineTask, FixedTask, Task, Weekday } from "./types";
import { Day, createDays } from "./day";
import { split } from "./split";

function createTimeline(
  tasks: Task[],
  startDayNumber: number,
  startWeekDay: Weekday,
  numDays = 30
) {
  const days = createDays(numDays, startDayNumber, startWeekDay);
  const weeks = split(days, 7);
  let weekTaskStart = 0;
  let monthTaskStart = 0;

  const addFixedTask = (task: FixedTask): void => {
    const dayIndex = task.day - startDayNumber;
    const day = days[dayIndex];
    if (!day.addTask(task))
      throw new Error("Can not allocate time for the fixed-time task.");
  };

  const addRoutineTask = (task: RoutineTask): void => {
    const { startAt, numberPerPeriod, period, allowedOn } = task;

    if (period === "daily" && numberPerPeriod > 1 && startAt)
      throw new Error(
        "Fixed-time daily task is not allowed more than once a day."
      );

    if (period === "daily") {
      for (const day of days) {
        if (!allowedOn[day.day]) continue;

        for (let i = 0; i < numberPerPeriod; ++i)
          if (!day.addTask(task))
            throw new Error("Can not find a place for the daily-task.");
      }
    }

    if (period === "weekly") {
      const step = Math.floor(7 / numberPerPeriod);

      for (const week of weeks) {
        const usedDays = new Set<Day>();
        let currentDay = weekTaskStart;
        let insertedTasks = 0;
        for (let i = 0; i < numberPerPeriod; ++i) {
          const day = week[currentDay];
          currentDay = (currentDay + step) % 7;
          if (day.addTask(task)) {
            usedDays.add(day);
            insertedTasks += 1;
          }
        }

        while (insertedTasks < numberPerPeriod && usedDays.size < week.length) {
          for (const day of week) {
            if (insertedTasks === numberPerPeriod) break;
            if (usedDays.has(day)) continue;

            if (day.addTask(task)) {
              insertedTasks += 1;
              usedDays.add(day);
            }
          }
        }

        // If it's still not filled completely, we don't care about having more
        // than one of this task in one day, we try to insert it anywhere we
        // can.

        if (insertedTasks < numberPerPeriod) {
          // Try everyday, if at the end everyday failed, it means we're
          // damned so just skip :(
          let everyDayFailed = true;
          do {
            everyDayFailed = true;
            for (const day of week) {
              if (insertedTasks === numberPerPeriod) break;
              if (day.addTask(task)) {
                insertedTasks += 1;
                everyDayFailed = false;
              }
            }
          } while (insertedTasks < numberPerPeriod && !everyDayFailed);
        }

        if (insertedTasks < numberPerPeriod)
          throw new Error("Can not insert weekly-task to the timeline.");
      }

      // We added one weekly task to the timeline, start trying to add the
      // next weekly task from the next day.
      weekTaskStart = (weekTaskStart + 1) % 7;
    }

    if (period === "monthly") {
      const step = Math.floor(numDays / numberPerPeriod);
      let addedTasks = 0;

      for (
        let i = 0;
        addedTasks < numberPerPeriod && i < numberPerPeriod;
        ++i
      ) {
        const day = days[(monthTaskStart + step * i) % numDays];
        if (day.addTask(task)) {
          addedTasks += 1;
        }
      }

      // TODO(qti3e) Try harder...

      if (addedTasks < numberPerPeriod)
        throw new Error("Can not add monthly task");

      monthTaskStart = (monthTaskStart + 2) % numDays;
    }
  };

  const addDueTask = (task: DueTask): void => {
    const daysCopy = [...days];
    daysCopy.sort((a, b) => a.getTasksTime() - b.getTasksTime());

    let inserted = false;
    for (const day of daysCopy) {
      if (day.addTask(task)) {
        inserted = true;
        break;
      }
    }

    if (!inserted) throw new Error("Can not insert due task.");
  };

  // First of all insert fixed tasks.
  for (const task of tasks) {
    if (task.type === "fixed") addFixedTask(task);
  }

  // Now routines.
  for (const task of tasks) {
    if (task.type === "routine") addRoutineTask(task);
  }

  // Due tasks.
  for (const task of tasks) {
    if (task.type === "due") addDueTask(task);
  }

  return days;
}
