import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useBoxApp } from '@/features/BoxApplication/hooks/useBoxApp';

import styles from './index.module.scss';

import type { Position, Step } from '@/features/BoxApplication/types';

type Props = {
  id: string;
  width: number;
  height: number;
  step: Step;
  resizeMode: boolean;
  children: React.ReactNode;
  stepBasePosition: Position;
  localPosition: Position;
  isMouseDown: boolean;
  setIsMouseDown: (value: boolean) => void;
  onUpdatePosition: (position: Position) => void;
  onDragStart: (position: Position) => void;
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
  id,
  width,
  height,
  step,
  resizeMode,
  children,
  stepBasePosition,
  localPosition,
  isMouseDown,
  setIsMouseDown,
  onUpdatePosition,
  onDragStart,
  onDragEnd,
  onDragLeave,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const { setSelectedBoxId, selectedBoxId, isBoxDragging, setIsBoxDragging, rowScale } = useBoxApp();
  const [transform, setTransform] = useState<Transform>({
    x: step.x * (stepBasePosition.x + localPosition.x),
    y: step.y * rowScale * (stepBasePosition.y + localPosition.y),
    scaleX: 1,
    scaleY: 1,
  });
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [mouseMoveAmount, setMouseMoveAmount] = useState<Position>({ x: 0, y: 0 });
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [cursor, setCursor] = useState<'unset' | 'grab' | 'all-scroll'>('unset');

  const style = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: CSS.Translate.toString(transform),
      cursor,
    };
  }, [transform, cursor, isBoxDragging]);

  const resetMouseMoveAmount = () => {
    setMouseMoveAmount({ x: 0, y: 0 });
  };

  const modifiedPosition = useMemo((): Position => {
    const position = { ...stepBasePosition };
    position.x = Math.round(position.x);
    position.y = Math.round(position.y);
    return position;
  }, [stepBasePosition]);

  useEffect(() => {
    const onWindowMouseUp = () => {
      if (selectedBoxId === id) {
        onDragEnd(modifiedPosition);
        onDragLeave(modifiedPosition);
        setIsMouseDown(false);
        setIsBoxDragging(false);
        setSelectedBoxId(undefined);
      }
    };

    window.addEventListener('mouseup', onWindowMouseUp);

    return () => {
      window.removeEventListener('mouseup', onWindowMouseUp);
    };
  }, [modifiedPosition, isMouseOver, selectedBoxId, isBoxDragging]);

  useEffect(() => {
    setTransform({
      x: step.x * (modifiedPosition.x + localPosition.x),
      y: step.y * (modifiedPosition.y + localPosition.y),
      scaleX: 1,
      scaleY: 1,
    });
  }, [localPosition, modifiedPosition]);

  useEffect(() => {
    if (resizeMode) {
      setCursor('unset');
      return;
    }

    if (isMouseDown) {
      setCursor('all-scroll');
      setIsBoxDragging(true);
    } else if (isMouseOver) {
      setCursor('grab');
      setIsBoxDragging(false);
    } else {
      setCursor('unset');
      setIsBoxDragging(false);
    }
  }, [isMouseDown, isMouseOver, resizeMode]);

  useEffect(() => {
    if (!resizeMode && isMouseDown && !isBoxDragging) {
      onDragStart(modifiedPosition);
    }
  }, [isMouseDown, resizeMode, modifiedPosition, isBoxDragging]);

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

      if (isBoxDragging) {
        const dx = newMousePosition.x - mousePosition.x;
        const dy = newMousePosition.y - mousePosition.y;
        const newMouseMoveAmount = { ...mouseMoveAmount };
        const newStepBasePosition = { ...stepBasePosition };
        const y = newStepBasePosition.y + dy / step.y;
        newStepBasePosition.y = y;

        newMouseMoveAmount.x = newMouseMoveAmount.x + dx;
        newMouseMoveAmount.y = newMouseMoveAmount.y + dy;

        if (rectMousePosition.x >= rect.width && isBoxDragging) {
          newStepBasePosition.x = newStepBasePosition.x + 1;
          resetMouseMoveAmount();
        } else if (rectMousePosition.x <= 0 && isBoxDragging) {
          newStepBasePosition.x = newStepBasePosition.x - 1;
          resetMouseMoveAmount();
        } else {
          setMouseMoveAmount(newMouseMoveAmount);
        }

        onUpdatePosition(newStepBasePosition);
      }

      setIsMouseOver(isMouseOver);
      setMousePosition(newMousePosition);
    },
    [boxRef.current, isBoxDragging, transform, mousePosition, resizeMode, step]
  );

  const handleMouseDown = useCallback(() => {
    if (isMouseOver) {
      setSelectedBoxId(id);
      setIsMouseDown(true);
    }
  }, [id, isMouseOver]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    resetMouseMoveAmount();
  }, []);

  return (
    <div
      ref={boxRef}
      style={style}
      className={clsx(styles.box)}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className={clsx(styles.boxInner)}>{children}</div>
    </div>
  );
};
