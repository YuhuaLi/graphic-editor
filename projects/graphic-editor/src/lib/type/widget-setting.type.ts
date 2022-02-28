export type WidgetSetting =
  | {
      type: string;
      name?: string;
      component: any;
    }
  | string;
