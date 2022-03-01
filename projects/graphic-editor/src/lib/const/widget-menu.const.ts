import { MenuOperation } from '../enum';

export const WIDGET_MENU = [
  {
    name: '置顶',
    value: MenuOperation.SetTop,
  },
  {
    name: '置底',
    value: MenuOperation.SetBottom,
  },
  {
    name: '上移一层',
    value: MenuOperation.MoveUp,
  },
  {
    name: '下移一层',
    value: MenuOperation.MoveDown,
  },
];
