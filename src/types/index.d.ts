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
};

export type ColumnProps = {
  id: string;
  label: string;
  colDiv: number;
  rowDiv: number;
};
