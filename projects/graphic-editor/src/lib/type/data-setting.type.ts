import { DataType } from '../enum';

export type DataSetting = {
  id: number;
  name: string;
  interval?: number;
  polling?: boolean;
  apiUrl?: string;
  type?: DataType;
  parent?: number;
  const?: string;
};
