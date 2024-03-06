import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styles from './index.module.scss';

import type { MousePosition } from '@/types';

type Props = {
  width: number;
  height: number;
  step: number;
  children: React.ReactNode;
};

type Transform = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

const initialTransform = {
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
};

export const DraggableBox: React.FC<Props> = ({ width, height, step, children }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>(initialTransform);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [mouseMoveAmount, setMouseMoveAmount] = useState<MousePosition>({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cursor, setCursor] = useState<'unset' | 'grab' | 'grabbing'>('unset');

  const style = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: CSS.Translate.toString(transform),
      cursor,
    };
  }, [transform, cursor]);

  const resetMouseMoveAmount = () => {
    setMouseMoveAmount({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isMouseDown) {
      setCursor('grabbing');
      setIsDragging(true);
    } else if (isMouseOver) {
      setCursor('grab');
      setIsDragging(false);
    } else {
      setCursor('unset');
      setIsDragging(false);
    }
  }, [isMouseDown, isMouseOver]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!boxRef.current) {
        return;
      }

      const box: HTMLDivElement = boxRef.current;
      const rect = box.getBoundingClientRect();
      const rectMousePosition = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      };

      const newMousePosition = {
        x: e.pageX || e.clientX + document.documentElement.scrollLeft,
        y: e.pageY || e.clientY + document.documentElement.scrollTop,
      };

      const isMouseOver = rectMousePosition.y <= rect.height;

      if (isDragging) {
        const dx = newMousePosition.x - mousePosition.x;
        const dy = newMousePosition.y - mousePosition.y;
        const newTransform = { ...transform };
        const newMouseMoveAmount = { ...mouseMoveAmount };

        newMouseMoveAmount.x = newMouseMoveAmount.x + dx;
        newMouseMoveAmount.y = newMouseMoveAmount.y + dy;

        if (Math.abs(newMouseMoveAmount.y) >= step) {
          if (newMouseMoveAmount.y > 0) {
            newTransform.y = transform.y + step;
          } else {
            newTransform.y = transform.y - step;
          }

          resetMouseMoveAmount();
        } else {
          setMouseMoveAmount(newMouseMoveAmount);
        }

        setTransform(newTransform);
      }

      setIsMouseOver(isMouseOver);
      setMousePosition(newMousePosition);
    },
    [boxRef.current, isDragging, transform, mousePosition, mouseMoveAmount]
  );

  const handleMouseDown = useCallback(() => {
    if (isMouseOver) {
      setIsMouseDown(true);
    }
  }, [isMouseOver]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    resetMouseMoveAmount();
  }, []);

  const handleMouseLeave = useCallback(() => {
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
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};
