import {
  Weekday,
  weekdays,
  Day,
  Minutes,
  Time,
  jsDate2Day,
  jsDate2Time
} from "./date";
import { generateUUID } from "./uuid";

type DayFilter = Partial<Record<Weekday, boolean>>;

interface TaskBase {
  uuid: string;
  title: string;
  startAt?: Time;
  duration?: Minutes;
}

export interface FixedTask extends TaskBase {
  type: "fixed";
  date: Day;
}

export interface RoutineTask extends TaskBase {
  type: "routine";
  period: "daily" | "weekly" | "monthly";
  perPeriod: number;
  allowedOn?: DayFilter;
}

export interface DueTask extends TaskBase {
  type: "due";
  dueTo: Day;
  allowedOn?: DayFilter;
}

export type Task = FixedTask | RoutineTask | DueTask;

// Implementation

export function createDayFilter(allowedDays: Weekday[]): DayFilter {
  const dayFilter: DayFilter = {};
  if (allowedDays.length === 0) allowedDays = [...weekdays];
  for (const day of allowedDays) dayFilter[day] = true;
  return dayFilter;
}

export function createDayFilterReverse(notAllowed: Weekday[]): DayFilter {
  const dayFilter: DayFilter = {};
  for (const day of weekdays)
    if (notAllowed.indexOf(day) < 0) dayFilter[day] = true;
  return dayFilter;
}

export function createFixedTask(
  title: string,
  date: Date,
  duration?: Minutes
): FixedTask {
  const day = jsDate2Day(date);
  const time = jsDate2Time(date);

  return {
    type: "fixed",
    uuid: generateUUID(),
    date: day,
    startAt: time,
    title,
    duration
  };
}

export function createRoutineTask(
  title: string,
  period: "daily" | "weekly" | "monthly",
  perPeriod: number,
  startAt?: Time,
  duration?: Minutes,
  dayFilter?: DayFilter
): RoutineTask {
  return {
    type: "routine",
    uuid: generateUUID(),
    allowedOn: dayFilter,
    title,
    startAt,
    duration,
    period,
    perPeriod
  };
}

export function createDueTask(
  title: string,
  dueTo: Date,
  dayFilter?: DayFilter
): DueTask {
  return {
    type: "due",
    uuid: generateUUID(),
    allowedOn: dayFilter,
    dueTo: jsDate2Day(dueTo),
    title
  };
}

export function isAllowed(
  dayFilter: DayFilter | undefined,
  day: Weekday
): boolean {
  if (!dayFilter) return true;
  return !!dayFilter[day];
}
