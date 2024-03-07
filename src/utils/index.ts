import { BoxProps, Position } from '@/types';

export const equalPosition = (positionA: Position, positionB: Position): boolean => {
  return positionA.x === positionB.x && positionA.y === positionB.y;
};

export const overlapBox = (boxA: BoxProps, boxB: BoxProps): boolean => {
  const resMinX1 = boxA.position.x >= boxB.position.x;
  const resMinX2 = boxA.position.x < boxB.position.x + boxB.size.width;
  const resMaxX1 = boxA.position.x + boxA.size.width > boxB.position.x;
  const resMaxX2 = boxA.position.x + boxA.size.width <= boxB.position.x + boxB.size.width;

  const resMinY1 = boxA.position.y >= boxB.position.y;
  const resMinY2 = boxA.position.y < boxB.position.y + boxB.size.height;
  const resMaxY1 = boxA.position.y + boxA.size.height > boxB.position.y;
  const resMaxY2 = boxA.position.y + boxA.size.height <= boxB.position.y + boxB.size.height;

  return ((resMinX1 && resMinX2) || (resMaxX1 && resMaxX2)) && ((resMinY1 && resMinY2) || (resMaxY1 && resMaxY2));
};
