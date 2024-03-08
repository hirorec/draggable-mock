import { BoxProps, Position } from '@/types';

export const equalPosition = (positionA: Position, positionB: Position): boolean => {
  return positionA.x === positionB.x && positionA.y === positionB.y;
};

export const overlapBox = (boxA: BoxProps, boxB: BoxProps): boolean => {
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

  const result = boxPositionsA.some((position) => {
    return positionInBox(position, boxB);
  });

  return result;
};

const positionInBox = (position: Position, box: BoxProps): boolean => {
  const resX = position.x >= box.position.x && position.x <= box.position.x + box.size.width;
  const resY = position.y >= box.position.y && position.y <= box.position.y + box.size.height;
  return resX && resY;
};
