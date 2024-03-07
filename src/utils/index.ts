import { BoxProps, Position } from '@/types';

export const equalPosition = (positionA: Position, positionB: Position): boolean => {
  return positionA.x === positionB.x && positionA.y === positionB.y;
};

export const overlapBox = (boxA: BoxProps, boxB: BoxProps): boolean => {
  const positionA = {
    x: boxA.position.x + boxA.localPosition.x,
    y: boxA.position.y + boxA.localPosition.y,
  };

  const positionB = {
    x: boxB.position.x + boxB.localPosition.x,
    y: boxB.position.y + boxB.localPosition.y,
  };

  const resMinX1 = positionA.x >= positionB.x;
  const resMinX2 = positionA.x < positionB.x + boxB.size.width;
  const resMaxX1 = positionA.x + boxA.size.width > positionB.x;
  const resMaxX2 = positionA.x + boxA.size.width <= positionB.x + boxB.size.width;

  const resMinY1 = positionA.y >= positionB.y;
  const resMinY2 = positionA.y < positionB.y + boxB.size.height;
  const resMaxY1 = positionA.y + boxA.size.height > positionB.y;
  const resMaxY2 = positionA.y + boxA.size.height <= positionB.y + boxB.size.height;

  return ((resMinX1 && resMinX2) || (resMaxX1 && resMaxX2)) && ((resMinY1 && resMinY2) || (resMaxY1 && resMaxY2));
};
