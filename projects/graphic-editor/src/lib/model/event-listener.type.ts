import { ActionType, EventType } from '.';

export type EventListener = {
  type?: EventType;
  action?: ActionType;
  actionData?: any;
};
