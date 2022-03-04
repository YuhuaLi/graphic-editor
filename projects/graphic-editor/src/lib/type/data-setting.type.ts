import { DataType } from '../enum';

export type DataSetting = {
  name: string;
  interval?: number;
  polling?: boolean;
  apiUrl?: string;
  type?: DataType;
};
