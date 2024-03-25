import { BoxProps, ColumnProps, Position, Size } from '@/features/BoxApplication/types';

import { STEP } from '../const';

export const equalPosition = (positionA: Position, positionB: Position): boolean => {
  return positionA.x === positionB.x && positionA.y === positionB.y;
};

export const equalSize = (sizeA: Size, sizeB: Size): boolean => {
  return sizeA.width === sizeB.width && sizeA.height === sizeB.height;
};

export const equalBoxPositionAndSize = (boxA: BoxProps, boxB: BoxProps): boolean => {
  return equalPosition(boxA.position, boxB.position) && equalSize(boxA.size, boxB.size);
};

export const overlapBox = (boxA: BoxProps, boxB: BoxProps): boolean => {
  if (equalPosition(boxA.position, boxB.position)) {
    return true;
  }

  const boxPositionsA: Position[] = [
    {
      x: boxA.position.x,
      y: boxA.position.y,
    },
    {
      x: boxA.position.x + boxA.size.width,
      y: boxA.position.y,
    },
    {
      x: boxA.position.x + boxA.size.width,
      y: boxA.position.y + boxA.size.height,
    },
    {
      x: boxA.position.x,
      y: boxA.position.y + boxA.size.height,
    },
  ];

  const boxPositionsB: Position[] = [
    {
      x: boxB.position.x,
      y: boxB.position.y,
    },
    {
      x: boxB.position.x + boxB.size.width,
      y: boxB.position.y,
    },
    {
      x: boxB.position.x + boxB.size.width,
      y: boxB.position.y + boxB.size.height,
    },
    {
      x: boxB.position.x,
      y: boxB.position.y + boxB.size.height,
    },
  ];

  const result1 = boxPositionsA.some((position) => {
    return positionInBox(position, boxB);
  });

  const result2 = boxPositionsB.some((position) => {
    return positionInBox(position, boxA);
  });

  return result1 || result2;
};

const positionInBox = (position: Position, box: BoxProps): boolean => {
  const resX = position.x >= box.position.x && position.x <= box.position.x + box.size.width;
  const resY = position.y > box.position.y && position.y < box.position.y + box.size.height;
  return resX && resY;
};

export const positionInBoxWithBoxLocalX = (position: Position, box: BoxProps): boolean => {
  const boxX = box.position.x + box.localPosition.x;
  const boxY = box.position.y;
  const resX = position.x === boxX;
  const resY = position.y >= boxY && position.y < boxY + box.size.height;
  return resX && resY;
};

export const yInBox = (y: number, box: BoxProps): boolean => {
  return y >= box.position.y && y < box.position.y + box.size.height;
};

export const colsWidthTotal = (columnList: ColumnProps[]) => {
  const width = columnList.reduce((prev, next) => {
    return prev + next.colDiv * STEP.X;
  }, 0);
  return width;
};
