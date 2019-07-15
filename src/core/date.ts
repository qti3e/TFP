export type Minutes = number;
export type Time = Minutes; // Minutes after 00:00 - UTC
export type Year = number;
export type Month = number;
export type TFPDate = number;
export type WeekNumber = number;
export type Day = [Year, Month, TFPDate]; // A day in the timeline.
export type Week = [Year, WeekNumber];
export type Weekday =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";
export type TimeRecord = {
  year: Year;
  month: Month;
  date: TFPDate;
  week: WeekNumber;
  day: Weekday;
};

export const weekdays: ReadonlyArray<Weekday> = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export function jsDate2Time(date: Date): Time {
  const hour = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  return hour * 60 + minutes;
}

export function jsDate2Day(jsDate: Date): Day {
  const year = jsDate.getUTCFullYear();
  const month = jsDate.getMonth();
  const date = jsDate.getUTCDate();

  return [year, month, date];
}

export function day2jsDate(day: Day): Date {
  const [year, month, date] = day;
  const UTC = Date.UTC(year, month, date);
  const d = new Date(UTC);

  return d;
}

export function parseTime(time: Time): { hours: number; minutes: number } {
  return {
    hours: Math.floor(time / 60),
    minutes: time % 60
  };
}

export function dayAndTime2jsDate(day: Day, time: Time): Date {
  const date = day2jsDate(day);
  const { hours, minutes } = parseTime(time);
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);

  return date;
}

export function getWeekNumber(day: Day): Week {
  const date = day2jsDate(day);
  return jsGetWeekNumber(date);
}

export function jsGetWeekNumber(d: Date): Week {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(
    (((d as any) - (yearStart as any)) / 86400000 + 1) / 7
  );
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

export function jsDate2TimeRecord(d: Date): TimeRecord {
  return {
    year: d.getFullYear(),
    date: d.getDate(),
    month: d.getMonth(),
    week: jsGetWeekNumber(d)[1],
    day: weekdays[d.getDay()]
  };
}

export function timeRecord2jsDate(t: TimeRecord): Date {
  return day2jsDate([t.year, t.month, t.date]);
}

export function day2TimeRecord(day: Day): TimeRecord {
  const date = day2jsDate(day);
  return jsDate2TimeRecord(date);
}

type Dayable = Day | Date | TimeRecord;

export function toTimeRecord(day: Dayable): TimeRecord {
  if (day instanceof Date) return jsDate2TimeRecord(day);
  if (Array.isArray(day)) return jsDate2TimeRecord(day2jsDate(day));
  return day;
}

export function isSameDay(day1: Dayable, day2: Dayable): boolean {
  const time1 = toTimeRecord(day1);
  const time2 = toTimeRecord(day2);

  return (
    time1.year === time2.year &&
    time1.month === time2.month &&
    time1.date === time2.date
  );
}

// day1 > day2
export function isGT(day1: Dayable, day2: Dayable): boolean {
  const time1 = toTimeRecord(day1);
  const time2 = toTimeRecord(day2);

  if (isSameDay(time1, time2)) return false;

  return (
    time1.year >= time2.year &&
    time1.month >= time2.month &&
    time1.date >= time2.date
  );
}

export function nextDay(day: Dayable): TimeRecord {
  const date = timeRecord2jsDate(toTimeRecord(day));
  date.setDate(date.getDate() + 1);
  return jsDate2TimeRecord(date);
}

export function* loopUntil(start: Dayable, end: Dayable): Iterable<TimeRecord> {
  const startDate = toTimeRecord(start);
  const endDate = toTimeRecord(end);

  // if startDate > endDate; there is nothing to iterate.
  if (isGT(startDate, endDate)) return;

  for (
    let current = startDate;
    !isSameDay(current, endDate);
    current = nextDay(current)
  )
    yield current;
}
