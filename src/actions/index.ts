import { ActionsBase } from "./base";

export type Unsubscribe = () => void;

export interface Data {
  createNewOpen: boolean;
}

class Actions extends ActionsBase<Data> {
  protected data = {
    createNewOpen: false
  };

  createNew = () => {
    this.update({
      createNewOpen: true
    });
  };

  closeCreateNew = () => {
    this.update({
      createNewOpen: false
    });
  };
}

export const actions = new Actions();
