import * as tasks from "./tasks";
import { createDailyPlan } from "./planner";
import { createHistoryRecord } from "./history";

const myTasks = [
  tasks.createFixedTask("Meeting", new Date("July 17, 2019 03:24:00"), 60),
  tasks.createRoutineTask(
    "Gym",
    "weekly",
    4,
    10 * 60 + 30,
    150,
    tasks.createDayFilterReverse(["friday", "thursday"])
  ),
  tasks.createDueTask("XXX", new Date("July 19, 2019 03:24:00"))
];

const plan = createDailyPlan([], myTasks, new Date("July 14, 2019"));
console.log(plan);
console.log("---");

const history = plan.map(task =>
  createHistoryRecord(task, new Date("July 14, 2019"))
);

console.log(history);
console.log("---");

const plan2 = createDailyPlan(history, myTasks, new Date("July 17, 2019"));
console.log(plan2);
