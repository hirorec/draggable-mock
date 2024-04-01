import { CURSOR, BOX_ACTION_MODE } from '../const';

export type Position = {
  x: number;
  y: number;
};

export type Step = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type BoxProps = {
  id: string;
  colIndex: number;
  label: string;
  borderColor: string;
  backgroundColor: string;
  position: Position;
  localPosition: Position;
  size: Size;
  zIndex: number;
};

export type ColumnProps = {
  id: string;
  label: string;
  colDiv: number;
  rowDiv: number;
};

export type BoxActionMode = (typeof BOX_ACTION_MODE)[keyof typeof BOX_ACTION_MODE];
export type Cursor = (typeof CURSOR)[keyof typeof CURSOR];
