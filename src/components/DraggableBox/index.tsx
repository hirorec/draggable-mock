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
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [cursor, setCursor] = useState<'unset' | 'grab' | 'grabbing'>('unset');

  const style = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: CSS.Translate.toString(transform),
      cursor,
    };
  }, [transform, cursor]);

  useEffect(() => {
    if (isMouseDown) {
      setCursor('grabbing');
    } else if (isMouseOver) {
      setCursor('grab');
    } else {
      setCursor('unset');
    }
  }, [isMouseDown, isMouseOver]);

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

      setIsMouseOver(newMousePosition.y <= rect.height);
      setMousePosition(newMousePosition);
    },
    [boxRef.current]
  );

  const handleMouseDown = useCallback(() => {
    if (isMouseOver) {
      setIsMouseDown(true);
    }
  }, [isMouseOver]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseDown(false);
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
