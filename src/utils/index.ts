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

export const overlapBoxWithLocalPosition = (boxA: BoxProps, boxB: BoxProps): boolean => {
  const boxPositionsA: Position[] = [
    {
      x: boxA.position.x + boxA.localPosition.x,
      y: boxA.position.y + boxA.localPosition.y,
    },
    {
      x: boxA.position.x + boxA.localPosition.x + boxA.size.width,
      y: boxA.position.y + boxA.localPosition.y,
    },
    {
      x: boxA.position.x + boxA.localPosition.x + boxA.size.width,
      y: boxA.position.y + boxA.localPosition.y + boxA.size.height,
    },
    {
      x: boxA.position.x + boxA.localPosition.x,
      y: boxA.position.y + boxA.localPosition.y + boxA.size.height,
    },
  ];

  const boxPositionsB: Position[] = [
    {
      x: boxB.position.x + boxB.localPosition.x,
      y: boxB.position.y + boxB.localPosition.y,
    },
    {
      x: boxB.position.x + boxB.localPosition.x + boxB.size.width,
      y: boxB.position.y + boxB.localPosition.y,
    },
    {
      x: boxB.position.x + boxB.localPosition.x + boxB.size.width,
      y: boxB.position.y + boxB.localPosition.y + boxB.size.height,
    },
    {
      x: boxB.position.x + boxB.localPosition.x,
      y: boxB.position.y + boxB.localPosition.y + boxB.size.height,
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

export const sleep = (duration: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, duration);
  });
