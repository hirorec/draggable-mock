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
  text: string;
  borderColor: string;
  backgroundColor: string;
  position: Position;
  size: Size;
};
