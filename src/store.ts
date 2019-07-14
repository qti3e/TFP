import { Task } from "./core";

interface DB {
  load(): Promise<void>;
  getTasks(): Promise<Task[]>;
  newTask(task: Task): Promise<void>;
}

class LocalStorageDB implements DB {
  private tasks: Task[] = [];

  private save() {
    localStorage.setItem("__tfp__", JSON.stringify(this.tasks));
  }

  async load(): Promise<void> {
    this.tasks = JSON.parse(localStorage.getItem("__tfp__") || "[]");
  }

  async getTasks(): Promise<Task[]> {
    return [...this.tasks];
  }

  async newTask(task: Task): Promise<void> {
    this.tasks.push(task);
    this.save();
  }
}

const DBInstance = new LocalStorageDB();

export default DBInstance;
