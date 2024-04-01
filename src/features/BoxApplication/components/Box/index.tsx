import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useBoxApp } from '@/features/BoxApplication/hooks/useBoxApp';

import styles from './index.module.scss';

import type { Position, Step } from '@/features/BoxApplication/types';

type Props = {
  id: string;
  label: string;
  width: number;
  height: number;
  step: Step;
  // resizeMode: boolean;
  stepBasePosition: Position;
  localPosition: Position;
  borderColor: string;
  backgroundColor: string;

  // isMouseDown: boolean;
  // setIsMouseDown: (value: boolean) => void;
  // onUpdatePosition: (position: Position) => void;
  // onDragStart: (position: Position) => void;
  // onDragEnd: (position: Position) => void;
  // onDragLeave: (position: Position) => void;
};

type Transform = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

export const Box: React.FC<Props> = ({
  id,
  label,
  width,
  height,
  step,
  // resizeMode,
  stepBasePosition,
  localPosition,
  borderColor,
  backgroundColor,

  // isMouseDown,
  // setIsMouseDown,
  // onUpdatePosition,
  // onDragStart,
  // onDragEnd,
  // onDragLeave,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const { setSelectedBoxId, setHoveredBoxId, selectedBoxId, rowScale, setIsBoxEdge, setCurrentBoxElement } = useBoxApp();
  const [transform, setTransform] = useState<Transform>({
    x: step.x * (stepBasePosition.x + localPosition.x),
    y: step.y * rowScale * (stepBasePosition.y + localPosition.y),
    scaleX: 1,
    scaleY: 1,
  });
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [mouseMoveAmount, setMouseMoveAmount] = useState<Position>({ x: 0, y: 0 });
  // const [isMouseOver, setIsMouseOver] = useState(false);
  // const [isEdge, setIsEdge] = useState(false);
  // const [cursor, setCursor] = useState<'unset' | 'pointer' | 'all-scroll'>('unset');

  const style = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: CSS.Translate.toString(transform),
      // cursor,
    };
  }, [transform]);

  const innerStyle: React.CSSProperties = useMemo(() => {
    return {
      backgroundColor,
      borderColor,
    };
  }, [borderColor, backgroundColor]);

  const resetMouseMoveAmount = () => {
    setMouseMoveAmount({ x: 0, y: 0 });
  };

  const modifiedPosition = useMemo((): Position => {
    const position = { ...stepBasePosition };
    position.x = Math.round(position.x);
    position.y = Math.round(position.y);
    return position;
  }, [stepBasePosition]);

  // useEffect(() => {
  //   const onWindowMouseUp = () => {
  //     if (selectedBoxId === id) {
  //       onDragEnd(modifiedPosition);
  //       onDragLeave(modifiedPosition);
  //       setIsMouseDown(false);
  //       setIsBoxDragging(false);
  //       setSelectedBoxId(undefined);
  //     }
  //   };

  //   window.addEventListener('mouseup', onWindowMouseUp);

  //   return () => {
  //     window.removeEventListener('mouseup', onWindowMouseUp);
  //   };
  // }, [modifiedPosition, isMouseOver, selectedBoxId, isBoxDragging]);

  useEffect(() => {
    setTransform({
      x: step.x * (modifiedPosition.x + localPosition.x),
      y: step.y * (modifiedPosition.y + localPosition.y),
      scaleX: 1,
      scaleY: 1,
    });
  }, [localPosition, modifiedPosition]);

  // useEffect(() => {
  //   if (resizeMode) {
  //     setCursor('unset');
  //     return;
  //   }

  //   if (isMouseDown) {
  //     setCursor('all-scroll');
  //     setIsBoxDragging(true);
  //   } else if (isMouseOver) {
  //     setCursor('pointer');
  //     setIsBoxDragging(false);
  //   } else {
  //     setCursor('unset');
  //     setIsBoxDragging(false);
  //   }
  // }, [isMouseDown, isMouseOver, resizeMode]);

  // useEffect(() => {
  //   if (!resizeMode && isMouseDown && !isBoxDragging) {
  //     onDragStart(modifiedPosition);
  //   }
  // }, [isMouseDown, resizeMode, modifiedPosition, isBoxDragging]);

  // const _handleMouseMove = useCallback(
  //   (e: React.MouseEvent<HTMLDivElement>) => {
  //     if (!boxRef.current || resizeMode) {
  //       return;
  //     }

  //     const box: HTMLDivElement = boxRef.current;
  //     const rect = box.getBoundingClientRect();
  //     const rectMousePosition = {
  //       x: e.clientX - rect.x,
  //       y: e.clientY - rect.y,
  //     };

  //     const newMousePosition = {
  //       x: e.clientX,
  //       y: e.clientY,
  //     };

  //     const isMouseOver =
  //       rectMousePosition.x > 0 && rectMousePosition.x <= rect.width && rectMousePosition.y <= rect.height && rectMousePosition.y > 0;

  //     // if (isBoxDragging) {
  //     //   const dx = newMousePosition.x - mousePosition.x;
  //     //   const dy = newMousePosition.y - mousePosition.y;
  //     //   const newMouseMoveAmount = { ...mouseMoveAmount };
  //     //   const newStepBasePosition = { ...stepBasePosition };
  //     //   const y = newStepBasePosition.y + dy / step.y;
  //     //   newStepBasePosition.y = y;

  //     //   newMouseMoveAmount.x = newMouseMoveAmount.x + dx;
  //     //   newMouseMoveAmount.y = newMouseMoveAmount.y + dy;

  //     //   if (rectMousePosition.x >= rect.width && isBoxDragging) {
  //     //     newStepBasePosition.x = newStepBasePosition.x + 1;
  //     //     resetMouseMoveAmount();
  //     //   } else if (rectMousePosition.x <= 0 && isBoxDragging) {
  //     //     newStepBasePosition.x = newStepBasePosition.x - 1;
  //     //     resetMouseMoveAmount();
  //     //   } else {
  //     //     setMouseMoveAmount(newMouseMoveAmount);
  //     //   }

  //     //   // onUpdatePosition(newStepBasePosition);
  //     // }

  //     // setIsMouseOver(isMouseOver);
  //     setMousePosition(newMousePosition);
  //   },
  //   [boxRef.current, transform, mousePosition, resizeMode, step]
  // );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!boxRef.current) {
        return;
      }

      const box: HTMLDivElement = boxRef.current;
      const rect = box.getBoundingClientRect();
      const newMousePosition = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      };
      const offset = 10;
      const isEdge = newMousePosition.y >= rect.height - offset && newMousePosition.y < rect.height;

      setIsBoxEdge(isEdge);
      setMousePosition(newMousePosition);

      // if (resizeMode) {
      //   if (newMousePosition.y >= rect.height + step.y) {
      //     onResizeHeight(true);
      //   } else if (newMousePosition.y <= rect.height - step.y) {
      //     onResizeHeight(false);
      //   }
      // }
    },
    [boxRef.current, mousePosition, step]
  );

  const handleMouseDown = useCallback(() => {
    // if (isMouseOver) {
    if (boxRef.current) {
      setCurrentBoxElement(boxRef.current);
    }

    setSelectedBoxId(id);

    // setIsMouseDown(true);
    // }
  }, [id, boxRef]);

  const handleMouseUp = useCallback(() => {
    // setIsMouseDown(false);
    resetMouseMoveAmount();
  }, []);

  const handleMouseEnter = useCallback(() => {
    setHoveredBoxId(id);
  }, [id]);

  const handleMouseLeave = () => {
    setHoveredBoxId(undefined);
  };

  return (
    <div
      ref={boxRef}
      style={style}
      className={clsx(styles.box)}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // onMouseUp={handleMouseUp}
    >
      <div className={clsx(styles.boxInner)} style={innerStyle}>
        {label}
      </div>
    </div>
  );
};
