import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { STEP } from '@/const';

import styles from './index.module.scss';

import type { Position, Step } from '@/types';

type Props = {
  width: number;
  height: number;
  step: Step;
  resizeMode: boolean;
  children: React.ReactNode;
  stepBasePosition: Position;
  localPosition: Position;
  onUpdateDragging: (isDragging: boolean) => void;
  onUpdatePosition: (position: Position) => void;
  onDragEnd: (position: Position) => void;
  onDragLeave: (position: Position) => void;
};

type Transform = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

export const DraggableBox: React.FC<Props> = ({
  width,
  height,
  step,
  resizeMode,
  children,
  stepBasePosition,
  localPosition,
  onUpdateDragging,
  onUpdatePosition,
  onDragEnd,
  onDragLeave,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({
    x: step.x * (stepBasePosition.x + localPosition.x),
    y: step.y * (stepBasePosition.y + localPosition.y),
    scaleX: 1,
    scaleY: 1,
  });
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  // const [mouseMoveAmount, setMouseMoveAmount] = useState<Position>({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cursor, setCursor] = useState<'unset' | 'grab' | 'all-scroll'>('unset');

  const style = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: CSS.Translate.toString(transform),
      cursor,
    };
  }, [transform, cursor, isDragging]);

  // const resetMouseMoveAmount = () => {
  //   setMouseMoveAmount({ x: 0, y: 0 });
  // };

  const modifiedPosition = useMemo((): Position => {
    const position = { ...stepBasePosition };
    position.x = Math.round(position.x);
    position.y = Math.round(position.y);
    return position;
  }, [stepBasePosition]);

  useEffect(() => {
    setTransform({
      x: step.x * (modifiedPosition.x + localPosition.x),
      y: step.y * (modifiedPosition.y + localPosition.y),
      scaleX: 1,
      scaleY: 1,
    });
  }, [stepBasePosition, localPosition, modifiedPosition]);

  useEffect(() => {
    if (resizeMode) {
      setCursor('unset');
      return;
    }

    if (isMouseDown) {
      setCursor('all-scroll');
      setIsDragging(true);
    } else if (isMouseOver) {
      setCursor('grab');
      setIsDragging(false);
    } else {
      setCursor('unset');
      setIsDragging(false);
    }
  }, [isMouseDown, isMouseOver, resizeMode]);

  useEffect(() => {
    onUpdateDragging(isDragging);
  }, [isDragging]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!boxRef.current || resizeMode) {
        return;
      }

      const box: HTMLDivElement = boxRef.current;
      const rect = box.getBoundingClientRect();
      const rectMousePosition = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      };

      const newMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };

      const isMouseOver =
        rectMousePosition.x > 0 && rectMousePosition.x <= rect.width && rectMousePosition.y <= rect.height && rectMousePosition.y > 0;

      if (isDragging) {
        const dx = newMousePosition.x - mousePosition.x;
        const dy = newMousePosition.y - mousePosition.y;
        const newStepBasePosition = { ...stepBasePosition };

        const x = newStepBasePosition.x + dx / STEP.X;
        const y = newStepBasePosition.y + dy / STEP.Y;
        // newStepBasePosition.x = Math.round(x);
        // newStepBasePosition.y = Math.round(y);
        newStepBasePosition.x = x;
        newStepBasePosition.y = y;

        // const newMouseMoveAmount = { ...mouseMoveAmount };

        // newMouseMoveAmount.x = newMouseMoveAmount.x + dx;
        // newMouseMoveAmount.y = newMouseMoveAmount.y + dy;

        // if (Math.abs(newMouseMoveAmount.y) >= step.y) {
        //   if (newMouseMoveAmount.y > 0) {
        //     newStepBasePosition.y = newStepBasePosition.y + 1;
        //   } else {
        //     newStepBasePosition.y = newStepBasePosition.y - 1;
        //   }
        //   resetMouseMoveAmount();
        // } else if (rectMousePosition.x >= rect.width) {
        //   newStepBasePosition.x = newStepBasePosition.x + 1;
        //   resetMouseMoveAmount();
        // } else if (rectMousePosition.x < 0) {
        //   newStepBasePosition.x = newStepBasePosition.x - 1;
        //   resetMouseMoveAmount();
        // } else {
        //   setMouseMoveAmount(newMouseMoveAmount);
        // }

        onUpdatePosition(newStepBasePosition);
      }

      setIsMouseOver(isMouseOver);
      setMousePosition(newMousePosition);
    },
    // [boxRef.current, isDragging, transform, mousePosition, mouseMoveAmount, resizeMode]
    [boxRef.current, isDragging, transform, mousePosition, resizeMode]
  );

  const handleMouseDown = useCallback(() => {
    if (isMouseOver) {
      setIsMouseDown(true);
    }
  }, [isMouseOver]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    // resetMouseMoveAmount();
    onDragEnd(modifiedPosition);
  }, [modifiedPosition]);

  const handleMouseLeave = useCallback(() => {
    // setIsMouseDown(false);
    // // resetMouseMoveAmount();
    // onDragLeave(modifiedPosition);
  }, [modifiedPosition]);

  return (
    <div
      ref={boxRef}
      style={style}
      className={clsx(styles.box)}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};
