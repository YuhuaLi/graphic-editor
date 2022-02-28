import { ActionType, EventType } from '../enum';


export type EventListener = {
  type?: EventType;
  action?: ActionType;
  actionData?: any;
};
