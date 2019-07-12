export type Minute = number;
export type Day = number;

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type DayMap = Record<Weekday, boolean>;

export type RoutineTask = {
  type: "routine";
  period: "daily" | "weekly" | "monthly";
  numberPerPeriod: number;

  startAt?: Minute;
  duration: Minute;

  allowedOn: DayMap;
};

export type DueTask = {
  type: "due";

  startAt?: Minute;
  duration: Minute;

  dueTo: Day;
  allowedOn: DayMap;
};

export type FixedTask = {
  type: "fixed";

  startAt: Minute;
  duration: Minute;

  day: Day;
};

export type Task = FixedTask | DueTask | RoutineTask;
